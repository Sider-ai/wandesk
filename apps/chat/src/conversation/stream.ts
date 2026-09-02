// Live reducer — one instance per open conversation, events are claimed by conversationId.
// Row objects are mutated in place; the caller triggers a re-render with bump() afterward.
import { EVENTS } from '../shared/events';
import type { ChannelEvent } from '../lib/channel';
import { mkKey, toolRow, type Row } from './thread';

export interface StreamPorts {
    conversationId: string;
    getRows: () => Row[];
    pushRow: (row: Row) => Row;
    setBusy: (busy: boolean) => void;
    /** Reconciliation refresh after completion: fill in server-side facts without moving the user's view. */
    refresh: () => void;
    bump: () => void;
}

export function setupStream(ports: StreamPorts) {
    const { conversationId, getRows, pushRow, setBusy, refresh, bump } = ports;
    let streamingKey = '';
    let compactKey = '';

    const find = (key: string) => getRows().find((row) => row.key === key);

    function closeStreaming() {
        if (!streamingKey) return;
        const row = find(streamingKey);
        if (row) row.streaming = false;
        streamingKey = '';
    }

    function streamingRow(): Row {
        if (streamingKey) {
            const existing = find(streamingKey);
            if (existing) return existing;
        }
        const row = pushRow({
            key: mkKey('a'), kind: 'assistant',
            content: '', reasoning: '', streaming: true, at: Date.now(),
        });
        streamingKey = row.key;
        return row;
    }

    function completeCall(callId: string, result: string) {
        const rows = getRows();
        let target: Row | undefined;
        for (let i = rows.length - 1; i >= 0; i--) {
            if (rows[i].kind === 'tool' && rows[i].callId === callId) { target = rows[i]; break; }
        }
        if (!target) {
            for (let i = rows.length - 1; i >= 0; i--) {
                if (rows[i].kind === 'tool' && rows[i].status !== 'done') { target = rows[i]; break; }
            }
        }
        if (!target) return;
        target.result = result;
        target.status = 'done';
    }

    /** At the end, close out any tool rows still hanging open — after a stop/error the output event
        never arrives, and without closing them they'd stay "running" forever. */
    function settleCalls() {
        for (const row of getRows()) {
            if (row.kind === 'tool' && row.status !== 'done') row.status = 'done';
        }
    }

    function onEvent(type: string, event: ChannelEvent) {
        if (event.conversationId !== conversationId) return;

        switch (type) {
            case EVENTS.START: {
                setBusy(true);
                closeStreaming();
                const clientId = String(event.clientId || '');
                const mine = clientId && getRows().some((row) => row.kind === 'user' && row.clientId === clientId);
                // A turn started from another window: add the question to the view, otherwise only the answer shows with no question
                if (!mine) pushRow({ key: mkKey('u'), kind: 'user', content: String(event.content || ''), at: Date.now() });
                break;
            }

            case EVENTS.REASONING: {
                const row = streamingRow();
                row.reasoning = (row.reasoning || '') + String(event.content || '');
                break;
            }
            case EVENTS.DELTA: {
                const row = streamingRow();
                row.content = (row.content || '') + String(event.content || '');
                break;
            }

            case EVENTS.CALL_STARTED:
                // The model has switched to emitting tool arguments: the text row ends here; leaving it open would block the waiting animation
                closeStreaming();
                break;

            case EVENTS.CALLS: {
                closeStreaming();
                const calls = (event.calls as Array<{ callId?: string; name?: string; args?: Record<string, unknown> }>) || [];
                for (const call of calls) pushRow({ ...toolRow(call, 'running'), at: Date.now() });
                break;
            }
            case EVENTS.CALL_OUTPUT:
                completeCall(String(event.callId || ''), typeof event.result === 'string' ? event.result : JSON.stringify(event.result));
                break;

            case EVENTS.COMPACT_START: {
                closeStreaming();
                const row = pushRow({ key: mkKey('s'), kind: 'system', code: 'compacting', content: 'Compacting earlier conversation…', at: Date.now() });
                compactKey = row.key;
                break;
            }
            case EVENTS.COMPACT_DONE: {
                const row = compactKey ? find(compactKey) : null;
                if (row) { row.code = 'compacted'; row.content = 'Earlier conversation compacted'; }
                compactKey = '';
                break;
            }

            case EVENTS.DONE:
                closeStreaming();
                settleCalls();
                setBusy(false);
                refresh(); // reconcile: fill in seq and other server-side facts without moving the view
                break;

            case EVENTS.ABORTED:
                closeStreaming();
                settleCalls();
                setBusy(false);
                // Stopping needs to leave a trace — without one, a half-finished reply looks like a dropped
                // connection. The server also persists a marker, which thread.ts recognizes on reopening the
                // conversation; this only handles the current screen
                pushRow({ key: mkKey('s'), kind: 'system', code: 'stopped', content: '', at: Date.now() });
                break;

            case EVENTS.ERROR:
                closeStreaming();
                settleCalls();
                setBusy(false);
                pushRow({ key: mkKey('s'), kind: 'system', code: 'error', content: String(event.message || 'Run failed'), at: Date.now() });
                break;

            default:
                return;
        }
        bump();
    }

    return { onEvent, close: closeStreaming };
}
