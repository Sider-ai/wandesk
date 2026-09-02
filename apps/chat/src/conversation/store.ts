// Conversation state and actions.
//
// An empty currentId = a blank draft: nothing is persisted or added to the list; the conversation
// is only actually created the moment the first message is sent — the sidebar never fills up with
// a row of empty "New conversation" entries. The rows array is a mutable structure: streaming mutates
// rows in place, and `tick` triggers re-render.
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

// null = never recorded, fall back to the most recent conversation; '' = the user deliberately stayed on a draft, restore the draft
const loadId = (): string | null => { try { return localStorage.getItem(ID_KEY); } catch { return null; } };
const saveId = (id: string) => { try { localStorage.setItem(ID_KEY, id); } catch { /* ignore */ } };

interface ConversationState {
    conversations: Conversation[];
    currentId: string;
    /** The working directory chosen during the draft stage; empty = use the default. Sent along with the POST when the conversation is created. */
    draftWorkdir: string;
    meta: Meta;
    liveIds: string[];

    /** Mutable array: streaming mutates rows in place, and `tick` drives re-render. */
    rows: Row[];
    busy: boolean;
    stopping: boolean;
    ready: boolean;
    tick: number;
    /** Incrementing this scrolls the viewport back to the bottom. */
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

    // Reconnect: catch up on the messages and state missed while disconnected. Skip the first connection —
    // init just fetched everything, refetching again would only cause a flash
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
        // The "breathing" indicator follows the events, for any conversation — after switching away it's still
        // alive, and the sidebar row needs to speak for it
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

/** Which conversations are still running. On failure, treat it as none — missing one dot beats the whole list flashing on a network blip. */
export async function loadRuns() {
    const data = await api.get<{ ids: string[] }>('/api/runs').catch(() => null);
    if (!data) return;
    set({ liveIds: data.ids || [] });
    const id = get().currentId;
    if (id) set({ busy: data.ids.includes(id) });
}

/** Entry point: connect the channel → fetch the list → restore where the user last was (a draft or a conversation). */
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

/** keepView=true is the reconciliation refresh after completion: swap data in place without moving the user's view. */
export async function refresh({ keepView = false }: { keepView?: boolean } = {}) {
    const id = get().currentId;
    if (!id) return;
    const data = await api
        .get<{ messages: RawMessage[]; hasMore: boolean }>(`/api/conversations/${id}/messages?limit=${PAGE}`)
        .catch(() => null);
    if (!data || id !== get().currentId) return; // switched away in the meantime, discard

    const raw = data.messages || [];
    // Skip the wholesale replacement if the fingerprint hasn't changed, to avoid a pointless re-render;
    // don't replace while a row is still streaming
    const sig = `${raw.length}:${raw[0]?.seq || 0}:${raw[raw.length - 1]?.seq || 0}`;
    if (get().ready && sig === lastSig && !get().rows.some((row) => row.streaming)) return;
    // Only protect the live row while actually running; a `streaming` flag left over while not running is
    // debris (e.g. from a service restart), so replace it as usual
    if (get().busy && keepView && get().rows.some((row) => row.streaming)) return;
    lastSig = sig;
    oldestSeq = raw[0]?.seq || 0;

    const next = renderMessages(raw);
    // Rows of the same kind in the same position reuse the old key: React reuses the DOM in place instead of remounting the whole screen
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

/** Swipe up to load an earlier page: insert at the top. */
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

/** Switch conversations. A running turn is not interrupted — the wheel keeps turning server-side after
 *  switching away, and the breathing indicator speaks for it. */
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
    void loadRuns(); // the live set could be ten seconds stale, reconcile once after switching
    await refresh();
}

/** New conversation = a local blank draft. */
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

/** The currently effective working directory (a draft uses its own choice; empty = server default). */
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

    // The draft's first message: this is when the conversation is actually created
    if (!get().currentId) {
        const created = await api
            .post<{ conversation: Conversation }>('/api/conversations', { workdir: get().draftWorkdir || undefined })
            .catch((error: unknown) => { fail(error instanceof Error ? error.message : 'Failed to create conversation'); return null; });
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
        if (error instanceof ApiError && error.status === 409) fail('This conversation is still running — wait for it to finish before sending');
        else fail(error instanceof Error ? error.message : 'Failed to send');
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
    await api.patch(`/api/conversations/${id}`, { title }).catch(() => toast('Rename failed'));
    await loadConversations();
}

export async function togglePinned(conversation: Conversation) {
    await api.patch(`/api/conversations/${conversation.id}`, { pinned: !conversation.pinned }).catch(() => null);
    await loadConversations();
}

export async function removeConversation(id: string) {
    const removed = await api.del<{ deleted: boolean }>(`/api/conversations/${id}`).catch(() => null);
    if (!removed) { toast('Delete failed'); return; }
    await loadConversations();
    if (id !== get().currentId) return;
    set({ currentId: '' }); // make sure openConversation isn't short-circuited by a matching id
    const next = get().conversations[0]?.id;
    if (next) await openConversation(next);
    else createDraft();
}
