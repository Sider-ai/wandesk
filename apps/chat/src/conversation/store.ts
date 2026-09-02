// 对话状态与动作。
//
// currentId 为空 = 空白草稿:不落库不进列表,发首条消息那刻才真正建对话 ——
// 侧栏不会攒出一排空的「新对话」。行数组是可变结构,流式直接改行,tick 触发重渲染。
import { create } from 'zustand';
import { EVENTS } from '../shared/events';

import { api, ApiError } from '../lib/api';
import { connectChannel, onChannel, useChannel, type ChannelEvent } from '../lib/channel';
import { toast } from '../overlay/toast';
import { mkKey, renderMessages, type Attachment, type RawMessage, type Row } from './thread';
import { setupStream } from './stream';

export interface Conversation {
    id: string;
    title: string;
    workdir: string;
    pinned: number;
    created_at: string;
    updated_at: string;
}

export interface Meta {
    model: string;
    defaultWorkdir: string;
    version: string;
}

const ID_KEY = 'agent.conversation';
const PAGE = 60;

// null = 从没记过,回到最近对话;'' = 用户明确停在草稿,恢复草稿
const loadId = (): string | null => { try { return localStorage.getItem(ID_KEY); } catch { return null; } };
const saveId = (id: string) => { try { localStorage.setItem(ID_KEY, id); } catch { /* ignore */ } };

interface ConversationState {
    conversations: Conversation[];
    currentId: string;
    /** 草稿期选的工作目录;空 = 用默认。建对话那刻随 POST 带走。 */
    draftWorkdir: string;
    meta: Meta;
    liveIds: string[];

    /** 可变数组:流式直接改行,靠 tick 触发重渲染。 */
    rows: Row[];
    busy: boolean;
    stopping: boolean;
    ready: boolean;
    tick: number;
    /** 自增 = 把视口拉回底部。 */
    viewSeq: number;
    hasMore: boolean;
    loadingOlder: boolean;
}

export const useConversation = create<ConversationState>(() => ({
    conversations: [],
    currentId: '',
    draftWorkdir: '',
    meta: { model: '', defaultWorkdir: '', version: '' },
    liveIds: [],
    rows: [],
    busy: false,
    stopping: false,
    ready: false,
    tick: 0,
    viewSeq: 0,
    hasMore: false,
    loadingOlder: false,
}));

const set = useConversation.setState;
const get = useConversation.getState;

let stream: ReturnType<typeof setupStream> | null = null;
let bound = false;
let oldestSeq = 0;
let lastSig = '';

const bump = () => set((state) => ({ tick: state.tick + 1 }));
const pushRow = (row: Row) => { get().rows.push(row); return row; };

function rebuildStream() {
    stream?.close();
    const id = get().currentId;
    stream = id
        ? setupStream({
            conversationId: id,
            getRows: () => get().rows,
            pushRow,
            setBusy: (busy) => set({ busy, ...(busy ? {} : { stopping: false }) }),
            refresh: () => { void refresh({ keepView: true }); },
            bump,
        })
        : null;
}

function bind() {
    if (bound) return;
    bound = true;

    // 断线重连:补上断线期间漏掉的消息和状态。首次连接不刷 —— init 刚拉过,再刷只会闪一下
    let hadConnected = false;
    useChannel.subscribe((state) => {
        if (!state.connected) return;
        if (!hadConnected) { hadConnected = true; return; }
        void loadConversations();
        void loadRuns();
        void refresh({ keepView: true });
    });

    onChannel((type, event: ChannelEvent) => {
        stream?.onEvent(type, event);

        const id = String(event.conversationId || '');
        const ENDED = [EVENTS.DONE, EVENTS.ABORTED, EVENTS.ERROR] as string[];
        // 呼吸点跟事件走,任何对话的都算 —— 切走之后它还活着,侧栏那行得替它说话
        if (id && type === EVENTS.START && !get().liveIds.includes(id)) {
            set((state) => ({ liveIds: [...state.liveIds, id] }));
        }
        if (id && ENDED.includes(type)) {
            set((state) => ({ liveIds: state.liveIds.filter((value) => value !== id) }));
        }

        if (type === EVENTS.CONVERSATIONS_CHANGED) void loadConversations();
        if (type === EVENTS.CONVERSATION_DELETED && id === get().currentId) {
            void (async () => {
                await loadConversations();
                const next = get().conversations[0]?.id;
                set({ currentId: '' });
                if (next) await openConversation(next);
                else createDraft();
            })();
        }
    });
}

export async function loadMeta() {
    const meta = await api.get<Meta>('/api/meta').catch(() => null);
    if (meta) set({ meta });
}

export async function loadConversations() {
    const data = await api.get<{ conversations: Conversation[] }>('/api/conversations').catch(() => null);
    if (data) set({ conversations: data.conversations || [] });
}

/** 谁还在跑。失败当成都没有 —— 少画一个点,好过网络一抖整列都亮。 */
export async function loadRuns() {
    const data = await api.get<{ ids: string[] }>('/api/runs').catch(() => null);
    if (!data) return;
    set({ liveIds: data.ids || [] });
    const id = get().currentId;
    if (id) set({ busy: data.ids.includes(id) });
}

/** 入口:连通道 → 拉列表 → 恢复上次停留(草稿或某段对话)。 */
export async function init() {
    bind();
    connectChannel();
    void loadMeta();
    await loadConversations();
    let id = loadId();
    if (id === null) id = get().conversations[0]?.id || '';
    else if (id && !get().conversations.some((item) => item.id === id)) id = get().conversations[0]?.id || '';
    if (!id) { createDraft(); return; }
    set({ currentId: id });
    rebuildStream();
    void loadRuns();
    await refresh();
}

/** keepView=true 是终局后的对账刷新:原地换数据,不动用户视角。 */
export async function refresh({ keepView = false }: { keepView?: boolean } = {}) {
    const id = get().currentId;
    if (!id) return;
    const data = await api
        .get<{ messages: RawMessage[]; hasMore: boolean }>(`/api/conversations/${id}/messages?limit=${PAGE}`)
        .catch(() => null);
    if (!data || id !== get().currentId) return; // 期间切走了,丢弃

    const raw = data.messages || [];
    // 指纹没变就跳过整体替换,避免无谓重渲染;有行还在流式时不替换
    const sig = `${raw.length}:${raw[0]?.seq || 0}:${raw[raw.length - 1]?.seq || 0}`;
    if (get().ready && sig === lastSig && !get().rows.some((row) => row.streaming)) return;
    // 真在跑才护着直播行;不在跑还挂着 streaming 的是残骸(比如服务重启),照常替换
    if (get().busy && keepView && get().rows.some((row) => row.streaming)) return;
    lastSig = sig;
    oldestSeq = raw[0]?.seq || 0;

    const next = renderMessages(raw);
    // 同位置同类的行复用旧 key:React 原地复用 DOM,不整屏重挂
    const prev = get().rows;
    for (let i = 0; i < next.length && i < prev.length; i++) {
        if (next[i].kind === prev[i].kind) next[i].key = prev[i].key;
    }
    set((state) => ({
        rows: next,
        ready: true,
        hasMore: Boolean(data.hasMore),
        viewSeq: keepView ? state.viewSeq : state.viewSeq + 1,
    }));
    bump();
}

/** 上滑加载更早一页:往头部插入。 */
export async function loadOlder() {
    const { hasMore, loadingOlder, currentId } = get();
    if (!hasMore || loadingOlder || !oldestSeq || !currentId) return;
    set({ loadingOlder: true });
    try {
        const data = await api
            .get<{ messages: RawMessage[]; hasMore: boolean }>(
                `/api/conversations/${currentId}/messages?limit=${PAGE}&before=${oldestSeq}`,
            )
            .catch(() => null);
        const raw = data?.messages || [];
        if (!raw.length) { set({ hasMore: false }); return; }
        oldestSeq = raw[0].seq;
        set({ rows: [...renderMessages(raw), ...get().rows], hasMore: Boolean(data?.hasMore) });
        bump();
    } finally {
        set({ loadingOlder: false });
    }
}

/** 切对话。正在跑的那段不打断 —— 轮子在服务端,切走它继续转,呼吸点替它说话。 */
export async function openConversation(id: string) {
    if (!id || id === get().currentId) return;
    set((state) => ({
        currentId: id, rows: [], ready: false, hasMore: false,
        busy: state.liveIds.includes(id), stopping: false,
    }));
    saveId(id);
    oldestSeq = 0;
    lastSig = '';
    rebuildStream();
    void loadRuns(); // live 集合可能是十秒前的,切完对一次账
    await refresh();
}

/** 新对话 = 本地空白草稿。 */
export function createDraft() {
    set((state) => ({
        currentId: '', rows: [], ready: true, hasMore: false,
        busy: false, stopping: false, draftWorkdir: '',
        viewSeq: state.viewSeq + 1,
    }));
    saveId('');
    oldestSeq = 0;
    lastSig = '';
    rebuildStream();
    bump();
}

/** 当前生效的工作目录(草稿看草稿的选择,空 = 服务端默认)。 */
export function currentWorkdir(): string {
    const { currentId, conversations, draftWorkdir, meta } = get();
    if (!currentId) return draftWorkdir || meta.defaultWorkdir;
    return conversations.find((item) => item.id === currentId)?.workdir || meta.defaultWorkdir;
}

export async function setWorkdir(workdir: string) {
    const id = get().currentId;
    if (!id) { set({ draftWorkdir: workdir }); return; }
    await api.patch(`/api/conversations/${id}`, { workdir });
    await loadConversations();
}

export async function send(text: string, attachments: Attachment[] = [], retryRow: Row | null = null) {
    const content = text.trim();
    if ((!content && !attachments.length) || get().busy) return;

    const row = retryRow || pushRow({
        key: mkKey('u'), kind: 'user', content,
        attachments, clientId: crypto.randomUUID(), sending: true, failed: false, at: Date.now(),
    });
    row.clientId ||= crypto.randomUUID();
    row.sending = true;
    row.failed = false;
    set((state) => ({ busy: true, stopping: false, viewSeq: state.viewSeq + 1 }));
    bump();

    const fail = (message?: string) => {
        row.sending = false;
        row.failed = true;
        set({ busy: false });
        bump();
        if (message) toast(message);
    };

    // 草稿的首条消息:此刻才真正建对话
    if (!get().currentId) {
        const created = await api
            .post<{ conversation: Conversation }>('/api/conversations', { workdir: get().draftWorkdir || undefined })
            .catch((error: unknown) => { fail(error instanceof Error ? error.message : '创建对话失败'); return null; });
        if (!created?.conversation) return;
        set((state) => ({
            conversations: [created.conversation, ...state.conversations],
            currentId: created.conversation.id,
        }));
        saveId(created.conversation.id);
        rebuildStream();
    }

    const id = get().currentId;
    try {
        await api.post(`/api/conversations/${id}/messages`, { content, attachments: row.attachments, clientId: row.clientId });
        row.sending = false;
        if (!get().liveIds.includes(id)) set((state) => ({ liveIds: [...state.liveIds, id] }));
        bump();
    } catch (error) {
        if (error instanceof ApiError && error.status === 409) fail('这个对话正在运行,等它跑完再发');
        else fail(error instanceof Error ? error.message : '发送失败');
    }
}

export const retrySend = (row: Row) => (row.failed ? send(row.content || '', row.attachments || [], row) : undefined);

export function stopRun() {
    const { busy, stopping, currentId } = get();
    if (!busy || stopping || !currentId) return;
    set({ stopping: true });
    void api.post(`/api/conversations/${currentId}/stop`).catch(() => set({ stopping: false }));
}

export async function renameConversation(id: string, title: string) {
    await api.patch(`/api/conversations/${id}`, { title }).catch(() => toast('重命名失败'));
    await loadConversations();
}

export async function togglePinned(conversation: Conversation) {
    await api.patch(`/api/conversations/${conversation.id}`, { pinned: !conversation.pinned }).catch(() => null);
    await loadConversations();
}

export async function removeConversation(id: string) {
    const removed = await api.del<{ deleted: boolean }>(`/api/conversations/${id}`).catch(() => null);
    if (!removed) { toast('删除失败'); return; }
    await loadConversations();
    if (id !== get().currentId) return;
    set({ currentId: '' }); // 保证 openConversation 不被同 id 短路
    const next = get().conversations[0]?.id;
    if (next) await openConversation(next);
    else createDraft();
}
