import { useEffect, useRef, useState } from 'react';

import { Icon } from '../icons/Icon';
import { useChannel } from '../lib/channel';
import { Sheet } from '../overlay/Sheet';
import { currentWorkdir, send, setWorkdir, stopRun, useConversation } from './store';
import { useDraftSeed } from './draft';
import { api } from '../lib/api';
import { toast } from '../overlay/toast';
import type { Attachment } from './thread';

/** The Enter that confirms an IME composition isn't a submit. Check isComposing while composing;
    Safari doesn't dispatch that keydown until after compositionend, so also block it within
    50ms of the composition ending. Only trust the event's own isComposing — don't accumulate
    a sticky flag ourselves, because if it never sees the end event (some IME inputs) it would
    get stuck forever and Enter would stop working entirely. */
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

/** Working directory: show the tail end, click to edit. Whether the directory exists is decided server-side. */
function WorkdirChip() {
    // Select the string itself: when the directory changes (switching conversations / editing the draft /
    // list refresh) it naturally re-renders
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
            setError(err instanceof Error ? err.message : 'Failed to save');
        }
    };

    return (
        <>
            <button
                className="tool-chip"
                title={`Working directory: ${workdir}`}
                onClick={() => { setValue(workdir); setError(''); setEditing(true); }}
            >
                <Icon name="folder" size={14} />
                <span className="clip">{shortPath}</span>
            </button>
            {editing && (
                <Sheet title="Working directory" onClose={() => setEditing(false)}>
                    <input
                        className="field-input mono"
                        value={value}
                        autoFocus
                        spellCheck={false}
                        placeholder="/absolute/path"
                        onChange={(event) => setValue(event.target.value)}
                        onKeyDown={(event) => { if (event.key === 'Enter') void save(); }}
                    />
                    <div className="sheet-note">The Agent's commands and file operations all happen inside this directory.</div>
                    {error && <div className="sheet-error">{error}</div>}
                    <div className="sheet-foot">
                        <button className="btn btn-quiet" onClick={() => setEditing(false)}>Cancel</button>
                        <button className="btn btn-accent" onClick={() => void save()}>Save</button>
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

    // Drafts persist to localStorage per conversation, surviving restarts; a blank draft is kept under the 'blank' key
    const draftKey = `agent.draft:${currentId || 'blank'}`;
    useEffect(() => {
        try { setText(localStorage.getItem(draftKey) || ''); } catch { setText(''); }
    }, [currentId]);
    const persistDraft = (value: string) => {
        try {
            if (value) localStorage.setItem(draftKey, value);
            else localStorage.removeItem(draftKey);
        } catch { /* can't persist in private mode, that's fine */ }
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
        } catch (error) { toast(error instanceof Error ? error.message : 'File upload failed'); }
        finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
    };

    const autosize = (element: HTMLTextAreaElement) => {
        element.style.height = 'auto';
        element.style.height = `${Math.min(element.scrollHeight, 200)}px`;
    };

    // Starter card was clicked → fill it into the input (not sent), cursor at the end
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
                        <button title="Remove" onClick={() => setAttachments((items) => items.filter((item) => item.id !== file.id))}><Icon name="x" size={12} /></button>
                    </div>
                ))}</div>}
                <textarea
                    ref={areaRef}
                    rows={2}
                    value={text}
                    placeholder={connected ? 'Hand the Agent something to do…' : 'Waiting for the local service to connect…'}
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
                        <button className="tool-chip attach-button" title="Add an image or file" disabled={busy || uploading} onClick={() => fileRef.current?.click()}>
                            <Icon name="plus" size={14} />{uploading && <span>Uploading</span>}
                        </button>
                        <WorkdirChip />
                    </div>
                    <div className="composer-right">
                        {meta.model && <span className="model-tag clip" title={`Model: ${meta.model}`}>{meta.model}</span>}
                        {busy ? (
                            <button
                                className="round stop"
                                title={stopping ? 'Stopping…' : 'Stop'}
                                disabled={stopping}
                                onClick={stopRun}
                            >
                                <Icon name="stop" size={15} />
                            </button>
                        ) : (
                            <button className="round go" title="Send" disabled={!canSend} onClick={submit}>
                                <Icon name="send" size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="foot-note">The Agent runs commands and reads/writes files inside the working directory</div>
        </div>
    );
}
