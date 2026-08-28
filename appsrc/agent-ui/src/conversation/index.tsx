// 对话列:顶栏 + 消息流 + 输入区。
import { Icon } from '../icons/Icon';
import { useChannel } from '../lib/channel';
import { useShell } from '../shell/layout';
import { Composer } from './Composer';
import { MessageStream } from './MessageStream';
import { useConversation } from './store';

export function ConversationView() {
    const shell = useShell();
    const connected = useChannel((state) => state.connected);
    const { conversations, currentId, rows, ready } = useConversation();

    const title = currentId
        ? conversations.find((item) => item.id === currentId)?.title || '对话'
        : '新对话';

    return (
        <section className={`conversation${ready && !rows.length ? ' is-blank' : ''}`}>
            <header className="topbar">
                <button
                    className={`icon-btn menu-btn${shell.collapsed ? ' show' : ''}`}
                    title="展开侧栏"
                    onClick={shell.openSidebar}
                >
                    <Icon name="panel" size={17} />
                </button>
                <span className="topbar-title clip">{title}</span>
                <span className="grow" />
                {!connected && <span className="offline-pill"><i />连接已断开,恢复中…</span>}
            </header>
            <MessageStream />
            <Composer />
        </section>
    );
}
