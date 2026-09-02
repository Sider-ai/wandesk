import { useEffect, useRef, useState } from 'react';

import { Icon } from '../icons/Icon';
import { useChannel } from '../lib/channel';
import { Sheet } from '../overlay/Sheet';
import { currentWorkdir, send, setWorkdir, stopRun, useConversation } from './store';
import { useDraftSeed } from './draft';
import { api } from '../lib/api';
import { toast } from '../overlay/toast';
import type { Attachment } from './thread';

/** 拼音确认的那个 Enter 不是发送。组字中看 isComposing;Safari 在
    compositionend 之后才派发那次 keydown,所以刚结束的 50ms 内也拦。
    只认事件自己的 isComposing,不自己攒粘性标志 —— 攒的标志一旦收不到
    结束事件(合成输入)就永远卡死,回车从此发不出去。 */
function useComposingGuard() {
    const endedAt = useRef(0);
    return {
        onCompositionEnd: () => { endedAt.current = Date.now(); },
        isSubmit: (event: React.KeyboardEvent) =>
            event.key === 'Enter' && !event.shiftKey
            && !event.nativeEvent.isComposing
            && Date.now() - endedAt.current > 50,
    };
}

/** 工作目录:显示尾巴一段,点开改。目录是否存在由服务端裁决。 */
function WorkdirChip() {
    // 选出字符串本身:目录一变(换对话 / 改草稿 / 列表刷新)自然重渲染
    const workdir = useConversation((state) => {
        void state.conversations;
        void state.draftWorkdir;
        void state.meta;
        return currentWorkdir();
    });
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const shortPath = workdir.split('/').filter(Boolean).slice(-2).join('/') || workdir;

    const save = async () => {
        setError('');
        try {
            await setWorkdir(value.trim());
            setEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : '保存失败');
        }
    };

    return (
        <>
            <button
                className="tool-chip"
                title={`工作目录:${workdir}`}
                onClick={() => { setValue(workdir); setError(''); setEditing(true); }}
            >
                <Icon name="folder" size={14} />
                <span className="clip">{shortPath}</span>
            </button>
            {editing && (
                <Sheet title="工作目录" onClose={() => setEditing(false)}>
                    <input
                        className="field-input mono"
                        value={value}
                        autoFocus
                        spellCheck={false}
                        placeholder="/绝对路径"
                        onChange={(event) => setValue(event.target.value)}
                        onKeyDown={(event) => { if (event.key === 'Enter') void save(); }}
                    />
                    <div className="sheet-note">Agent 的命令和文件操作都发生在这个目录里。</div>
                    {error && <div className="sheet-error">{error}</div>}
                    <div className="sheet-foot">
                        <button className="btn btn-quiet" onClick={() => setEditing(false)}>取消</button>
                        <button className="btn btn-accent" onClick={() => void save()}>保存</button>
                    </div>
                </Sheet>
            )}
        </>
    );
}

export function Composer() {
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [uploading, setUploading] = useState(false);
    const areaRef = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const connected = useChannel((state) => state.connected);
    const { busy, stopping, currentId, meta } = useConversation();
    const seed = useDraftSeed();

    // 草稿按对话落 localStorage,重启不丢;空白草稿记在 blank 键下
    const draftKey = `agent.draft:${currentId || 'blank'}`;
    useEffect(() => {
        try { setText(localStorage.getItem(draftKey) || ''); } catch { setText(''); }
    }, [currentId]);
    const persistDraft = (value: string) => {
        try {
            if (value) localStorage.setItem(draftKey, value);
            else localStorage.removeItem(draftKey);
        } catch { /* 私隐模式存不了就算了 */ }
    };

    const guard = useComposingGuard();
    const canSend = connected && !busy && !uploading && (text.trim().length > 0 || attachments.length > 0);

    const upload = async (files: FileList | File[]) => {
        setUploading(true);
        try {
            const next: Attachment[] = [];
            for (const file of Array.from(files)) {
                const dataBase64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onerror = () => reject(reader.error);
                    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
                    reader.readAsDataURL(file);
                });
                const result = await api.post<{ attachment: Attachment }>('/api/files', { name: file.name, mimeType: file.type, dataBase64 });
                next.push(result.attachment);
            }
            setAttachments((current) => [...current, ...next].slice(0, 10));
        } catch (error) { toast(error instanceof Error ? error.message : '文件上传失败'); }
        finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
    };

    const autosize = (element: HTMLTextAreaElement) => {
        element.style.height = 'auto';
        element.style.height = `${Math.min(element.scrollHeight, 200)}px`;
    };

    // 起手卡点了 → 填进输入框(不发),光标落尾部
    useEffect(() => {
        if (!seed.seq) return;
        setText(seed.text);
        persistDraft(seed.text);
        const element = areaRef.current;
        if (element) {
            element.focus();
            requestAnimationFrame(() => autosize(element));
        }
    }, [seed.seq]);

    const submit = () => {
        if (!canSend) return;
        const content = text;
        const files = attachments;
        setText('');
        setAttachments([]);
        persistDraft('');
        if (areaRef.current) areaRef.current.style.height = 'auto';
        void send(content, files);
    };

    return (
        <div className="composer-wrap">
            <div className="composer" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void upload(event.dataTransfer.files); }}>
                <input ref={fileRef} hidden type="file" multiple onChange={(event) => { if (event.target.files) void upload(event.target.files); }} />
                {attachments.length > 0 && <div className="attach-tray">{attachments.map((file) => (
                    <div className="attach-chip" key={file.id}>
                        {file.mimeType.startsWith('image/') ? <img src={file.url} alt="" /> : <Icon name="doc" size={15} />}
                        <span>{file.name}</span>
                        <button title="移除" onClick={() => setAttachments((items) => items.filter((item) => item.id !== file.id))}><Icon name="x" size={12} /></button>
                    </div>
                ))}</div>}
                <textarea
                    ref={areaRef}
                    rows={2}
                    value={text}
                    placeholder={connected ? '交给 Agent 一件事…' : '等待本地服务连接…'}
                    disabled={!connected}
                    onChange={(event) => {
                        setText(event.target.value);
                        persistDraft(event.target.value);
                        autosize(event.target);
                    }}
                    onKeyDown={(event) => {
                        if (!guard.isSubmit(event)) return;
                        event.preventDefault();
                        submit();
                    }}
                    onPaste={(event) => {
                        const images = Array.from(event.clipboardData.files).filter((file) => file.type.startsWith('image/'));
                        if (!images.length) return;
                        event.preventDefault();
                        void upload(images);
                    }}
                    onCompositionEnd={guard.onCompositionEnd}
                />
                <div className="composer-bar">
                    <div className="composer-left">
                        <button className="tool-chip attach-button" title="添加图片或文件" disabled={busy || uploading} onClick={() => fileRef.current?.click()}>
                            <Icon name="plus" size={14} />{uploading && <span>上传中</span>}
                        </button>
                        <WorkdirChip />
                    </div>
                    <div className="composer-right">
                        {meta.model && <span className="model-tag clip" title={`模型:${meta.model}`}>{meta.model}</span>}
                        {busy ? (
                            <button
                                className="round stop"
                                title={stopping ? '正在停止…' : '停止'}
                                disabled={stopping}
                                onClick={stopRun}
                            >
                                <Icon name="stop" size={15} />
                            </button>
                        ) : (
                            <button className="round go" title="发送" disabled={!canSend} onClick={submit}>
                                <Icon name="send" size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="foot-note">Agent 会在工作目录里执行命令、读写文件</div>
        </div>
    );
}
