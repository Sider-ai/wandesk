// 左侧栏,自上而下:品牌行 · 新对话 · 置顶组 · 最近组 · 底部(主题 + 版本)。
// 行悬停露出操作(置顶 / 重命名 / 删除),正在跑的行画呼吸点。
import { useEffect, useState } from 'react';

import { Icon, Mark } from '../icons/Icon';
import { Sheet } from '../overlay/Sheet';
import {
    createDraft, loadRuns, openConversation, removeConversation, renameConversation,
    togglePinned, useConversation, type Conversation,
} from '../conversation/store';
import { useShell } from './layout';

export function Sidebar() {
    const shell = useShell();
    const { conversations, currentId, liveIds, meta } = useConversation();
    const [renaming, setRenaming] = useState<Conversation | null>(null);
    const [renameText, setRenameText] = useState('');
    const [removing, setRemoving] = useState<Conversation | null>(null);

    useEffect(() => { if (renaming) setRenameText(renaming.title); }, [renaming]);

    // 呼吸点十秒对一次账 —— 事件即亮即灭,轮询只兜底
    useEffect(() => {
        const timer = setInterval(() => { void loadRuns(); }, 10_000);
        return () => clearInterval(timer);
    }, []);

    const pinned = conversations.filter((item) => item.pinned);
    const recent = conversations.filter((item) => !item.pinned);
    const live = new Set(liveIds);

    const pick = (id: string) => {
        shell.showConversation();
        shell.closeDrawer();
        void openConversation(id);
    };

    const confirmRename = () => {
        const conversation = renaming;
        setRenaming(null);
        if (!conversation) return;
        const title = renameText.trim();
        if (title && title !== conversation.title) void renameConversation(conversation.id, title);
    };

    const row = (conversation: Conversation) => (
        <div
            key={conversation.id}
            className={`conv${shell.page === 'conversation' && conversation.id === currentId ? ' on' : ''}`}
            onClick={() => pick(conversation.id)}
        >
            {live.has(conversation.id) && <span className="conv-live" title="正在运行" />}
            <span className="conv-title clip">{conversation.title}</span>
            <span className="conv-ops" onClick={(event) => event.stopPropagation()}>
                <button
                    className={`op${conversation.pinned ? ' held' : ''}`}
                    title={conversation.pinned ? '取消置顶' : '置顶'}
                    onClick={() => void togglePinned(conversation)}
                >
                    <Icon name={conversation.pinned ? 'pinFill' : 'pin'} size={13} />
                </button>
                <button className="op" title="重命名" onClick={() => setRenaming(conversation)}>
                    <Icon name="pen" size={13} />
                </button>
                <button className="op danger" title="删除" onClick={() => setRemoving(conversation)}>
                    <Icon name="trash" size={13} />
                </button>
            </span>
        </div>
    );

    return (
        <>
            {shell.drawer && <div className="side-veil" onClick={shell.closeDrawer} />}

            <aside className={`sidebar${shell.collapsed ? ' folded' : ''}${shell.drawer ? ' open' : ''}`}>
                <div className="side-head">
                    <Mark size={24} />
                    <span className="side-brand">AGENT</span>
                    <span className="grow" />
                    <button className="icon-btn fold-btn" title="收起侧栏" onClick={shell.toggleCollapsed}>
                        <Icon name="panel" size={16} />
                    </button>
                </div>

                {/* 新对话是动作不是清单的一行,恒在顶部,不进滚动区 */}
                <button
                    className="side-new"
                    onClick={() => { shell.showConversation(); createDraft(); }}
                >
                    <Icon name="compose" size={16} /><span>新对话</span>
                </button>

                <div className="side-scroll">
                    {pinned.length > 0 && (<>
                        <div className="side-label">置顶</div>
                        {pinned.map(row)}
                    </>)}
                    {recent.length > 0 && (<>
                        <div className="side-label">最近</div>
                        {recent.map(row)}
                    </>)}
                    {!conversations.length && <div className="side-empty">还没有对话</div>}
                </div>

                <div className="side-foot">
                    <button className={`side-settings${shell.page === 'settings' ? ' on' : ''}`} onClick={shell.showSettings}>
                        <Icon name="settings" size={15} /><span>设置</span>
                    </button>
                    <span className="side-meta clip">{meta.version ? `v${meta.version}` : ''}</span>
                </div>
            </aside>

            {renaming && (
                <Sheet title="重命名对话" onClose={() => setRenaming(null)}>
                    <input
                        className="field-input"
                        value={renameText}
                        autoFocus
                        placeholder="对话标题"
                        onChange={(event) => setRenameText(event.target.value)}
                        onKeyDown={(event) => { if (event.key === 'Enter') confirmRename(); }}
                    />
                    <div className="sheet-foot">
                        <button className="btn btn-quiet" onClick={() => setRenaming(null)}>取消</button>
                        <button className="btn btn-accent" onClick={confirmRename}>保存</button>
                    </div>
                </Sheet>
            )}

            {removing && (
                <Sheet title="删除对话" onClose={() => setRemoving(null)}>
                    <div className="sheet-note">「{removing.title}」的全部消息会一并删除,不可恢复。</div>
                    <div className="sheet-foot">
                        <button className="btn btn-quiet" onClick={() => setRemoving(null)}>取消</button>
                        <button
                            className="btn btn-danger"
                            onClick={() => { const target = removing; setRemoving(null); void removeConversation(target.id); }}
                        >删除</button>
                    </div>
                </Sheet>
            )}
        </>
    );
}
