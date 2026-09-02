// Left sidebar, top to bottom: brand row · new conversation · pinned group · recent group · footer (theme + version).
// Hovering a row reveals its actions (pin / rename / delete); a running row shows a breathing dot.
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

    // The breathing dot reconciles every ten seconds — it lights up and off from events; polling is just a fallback
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
            {live.has(conversation.id) && <span className="conv-live" title="Running" />}
            <span className="conv-title clip">{conversation.title}</span>
            <span className="conv-ops" onClick={(event) => event.stopPropagation()}>
                <button
                    className={`op${conversation.pinned ? ' held' : ''}`}
                    title={conversation.pinned ? 'Unpin' : 'Pin'}
                    onClick={() => void togglePinned(conversation)}
                >
                    <Icon name={conversation.pinned ? 'pinFill' : 'pin'} size={13} />
                </button>
                <button className="op" title="Rename" onClick={() => setRenaming(conversation)}>
                    <Icon name="pen" size={13} />
                </button>
                <button className="op danger" title="Delete" onClick={() => setRemoving(conversation)}>
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
                    <button className="icon-btn fold-btn" title="Collapse sidebar" onClick={shell.toggleCollapsed}>
                        <Icon name="panel" size={16} />
                    </button>
                </div>

                {/* New conversation is an action row, not a list item — always stays at the top, outside the scroll area */}
                <button
                    className="side-new"
                    onClick={() => { shell.showConversation(); createDraft(); }}
                >
                    <Icon name="compose" size={16} /><span>New conversation</span>
                </button>

                <div className="side-scroll">
                    {pinned.length > 0 && (<>
                        <div className="side-label">Pinned</div>
                        {pinned.map(row)}
                    </>)}
                    {recent.length > 0 && (<>
                        <div className="side-label">Recent</div>
                        {recent.map(row)}
                    </>)}
                    {!conversations.length && <div className="side-empty">No conversations yet</div>}
                </div>

                <div className="side-foot">
                    <button className={`side-settings${shell.page === 'settings' ? ' on' : ''}`} onClick={shell.showSettings}>
                        <Icon name="settings" size={15} /><span>Settings</span>
                    </button>
                    <span className="side-meta clip">{meta.version ? `v${meta.version}` : ''}</span>
                </div>
            </aside>

            {renaming && (
                <Sheet title="Rename conversation" onClose={() => setRenaming(null)}>
                    <input
                        className="field-input"
                        value={renameText}
                        autoFocus
                        placeholder="Conversation title"
                        onChange={(event) => setRenameText(event.target.value)}
                        onKeyDown={(event) => { if (event.key === 'Enter') confirmRename(); }}
                    />
                    <div className="sheet-foot">
                        <button className="btn btn-quiet" onClick={() => setRenaming(null)}>Cancel</button>
                        <button className="btn btn-accent" onClick={confirmRename}>Save</button>
                    </div>
                </Sheet>
            )}

            {removing && (
                <Sheet title="Delete conversation" onClose={() => setRemoving(null)}>
                    <div className="sheet-note">All messages in "{removing.title}" will be deleted along with it. This can't be undone.</div>
                    <div className="sheet-foot">
                        <button className="btn btn-quiet" onClick={() => setRemoving(null)}>Cancel</button>
                        <button
                            className="btn btn-danger"
                            onClick={() => { const target = removing; setRemoving(null); void removeConversation(target.id); }}
                        >Delete</button>
                    </div>
                </Sheet>
            )}
        </>
    );
}
