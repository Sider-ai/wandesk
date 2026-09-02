// The rendering model for the message thread: persisted Responses items → user-readable rows.
//
// Rows are **mutable objects**: streaming deltas mutate fields directly, and the store's tick
// then drives a re-render. React reuses DOM by key, updating content in place without remounting
// (no flicker, no lost scroll position, no broken selection).

/** One entry returned by the server's /messages endpoint. */
export interface RawMessage {
    seq: number;
    item: StoredItem;
    createdAt: string;
}

/** The persisted item — shaped per the Responses spec. */
export interface StoredItem {
    type?: string;
    role?: string;
    content?: string | Array<{ type?: string; text?: string }> | null;
    /** Reasoning block: some models put it in `summary`, others in `content` — read both. */
    summary?: Array<{ text?: string }>;
    call_id?: string;
    name?: string;
    arguments?: string;
    output?: string;
    attachments?: Attachment[];
}

export interface Attachment { id: string; name: string; path: string; mimeType: string; size: number; url: string; }

export interface Row {
    key: string;
    kind: 'user' | 'assistant' | 'tool' | 'system';
    /** Row timestamp (ms), used for the date divider and turn duration. */
    at?: number;
    content?: string;

    // user
    clientId?: string;
    sending?: boolean;
    failed?: boolean;
    attachments?: Attachment[];

    // assistant: reasoning and the main text share one row (reasoning streams first, text arrives after)
    reasoning?: string;
    streaming?: boolean;

    // system
    code?: 'stopped' | 'error' | 'compacting' | 'compacted' | '';

    // tool
    callId?: string;
    name?: string;
    args?: Record<string, unknown>;
    result?: string;
    status?: 'running' | 'done';
}

let keySeq = 0;
export function mkKey(prefix = 'r') {
    keySeq += 1;
    return `${prefix}:${keySeq}`;
}

const parseArgs = (value: unknown): Record<string, unknown> => {
    if (value && typeof value === 'object') return value as Record<string, unknown>;
    try { return JSON.parse(String(value ?? '{}')); } catch { return {}; }
};

/** The plain text inside an item: content may be a string or segments; reasoning lives in summary/content. */
function itemText(item: StoredItem): string {
    if (item.type === 'reasoning') {
        const parts = [...(item.summary || []), ...(Array.isArray(item.content) ? item.content : [])];
        return parts.map((part) => String(part?.text || '')).join('');
    }
    if (typeof item.content === 'string') return item.content;
    if (!Array.isArray(item.content)) return '';
    return item.content
        .filter((part) => part?.type === 'output_text' || part?.type === 'input_text')
        .map((part) => String(part.text || ''))
        .join('');
}

export function toolRow(call: { call_id?: string; callId?: string; name?: string; args?: unknown; arguments?: unknown }, status: 'running' | 'done'): Row {
    return {
        key: mkKey('tool'),
        kind: 'tool',
        callId: call.call_id || call.callId || mkKey('cid'),
        name: call.name || 'tool',
        args: parseArgs(call.args ?? call.arguments),
        result: '',
        status,
    };
}

/**
 * History items → rendered rows.
 *
 * Reasoning is a separate item, but in the UI it belongs to the main text that follows it —
 * hold onto it, and merge it in once an assistant text item shows up; a reasoning-only turn
 * (straight into a tool call, no text) becomes its own row.
 * Tool results are filled back into their matching call row; an orphaned result whose call
 * was trimmed by compaction becomes its own row rather than being dropped.
 */
export function renderMessages(raw: RawMessage[]): Row[] {
    const rows: Row[] = [];
    const calls = new Map<string, Row>();
    let pendingReasoning = '';

    const flushReasoning = (at?: number) => {
        if (!pendingReasoning.trim()) { pendingReasoning = ''; return; }
        rows.push({ key: mkKey('a'), kind: 'assistant', content: '', reasoning: pendingReasoning.trim(), at });
        pendingReasoning = '';
    };

    for (const message of raw) {
        const item = message.item;
        const at = Date.parse(message.createdAt) || undefined;

        if (item.type === 'reasoning') {
            pendingReasoning += itemText(item);
            continue;
        }
        if (item.type === 'function_call') {
            flushReasoning(at);
            const row = toolRow(item, 'done');
            row.at = at;
            calls.set(row.callId!, row);
            rows.push(row);
            continue;
        }
        if (item.type === 'function_call_output') {
            const row = calls.get(item.call_id || '');
            if (row) {
                row.result = item.output || '';
                row.status = 'done';
            } else {
                rows.push({ ...toolRow(item, 'done'), result: item.output || '', at });
            }
            continue;
        }
        if (item.role === 'user') {
            flushReasoning(at);
            rows.push({ key: mkKey('u'), kind: 'user', content: itemText(item), attachments: item.attachments || [], at });
            continue;
        }
        if (item.role === 'system') {
            flushReasoning(at);
            const text = itemText(item);
            if (/^\[stopped\]/.test(text)) rows.push({ key: mkKey('s'), kind: 'system', code: 'stopped', content: '', at });
            else if (/^\[error\]/.test(text)) {
                rows.push({ key: mkKey('s'), kind: 'system', code: 'error', content: text.replace(/^\[error\]\s*/, ''), at });
            }
            // Other system entries are meant for the model, not the UI
            continue;
        }
        if (item.role === 'assistant') {
            const content = itemText(item).trim();
            const reasoning = pendingReasoning.trim();
            pendingReasoning = '';
            if (content || reasoning) {
                rows.push({ key: mkKey('a'), kind: 'assistant', content, reasoning, at });
            }
        }
    }
    flushReasoning();
    return rows;
}
