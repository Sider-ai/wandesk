// 直播 reducer —— 每个打开的对话一份,事件按 conversationId 认领。
// 行对象原地修改,改完由调用方 bump 触发重渲染。
import { EVENTS } from '../shared/events';
import type { ChannelEvent } from '../lib/channel';
import { mkKey, toolRow, type Row } from './thread';

export interface StreamPorts {
    conversationId: string;
    getRows: () => Row[];
    pushRow: (row: Row) => Row;
    setBusy: (busy: boolean) => void;
    /** 终局后的对账刷新:补齐服务端事实,不动用户视角。 */
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

    /** 终局时把还挂着的工具行收掉 —— 停止 / 出错后等不到 output 事件,
        不收就永远「执行中」。 */
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
                // 另一个窗口发起的轮:把提问补进画面,不然只看到答案不见问题
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
                // 模型转去吐工具参数了:正文行到此为止,不收会把等待动画压住
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
                const row = pushRow({ key: mkKey('s'), kind: 'system', code: 'compacting', content: '正在压缩早期对话…', at: Date.now() });
                compactKey = row.key;
                break;
            }
            case EVENTS.COMPACT_DONE: {
                const row = compactKey ? find(compactKey) : null;
                if (row) { row.code = 'compacted'; row.content = '已压缩早期对话'; }
                compactKey = '';
                break;
            }

            case EVENTS.DONE:
                closeStreaming();
                settleCalls();
                setBusy(false);
                refresh(); // 对账:补齐 seq 等服务端事实,不动视角
                break;

            case EVENTS.ABORTED:
                closeStreaming();
                settleCalls();
                setBusy(false);
                // 停下来要留痕:不留的话半截回复像网络断了。服务端也落了持久标记,
                // 重开对话由 thread.ts 认出来;这里只管眼下这一屏
                pushRow({ key: mkKey('s'), kind: 'system', code: 'stopped', content: '', at: Date.now() });
                break;

            case EVENTS.ERROR:
                closeStreaming();
                settleCalls();
                setBusy(false);
                pushRow({ key: mkKey('s'), kind: 'system', code: 'error', content: String(event.message || '运行失败'), at: Date.now() });
                break;

            default:
                return;
        }
        bump();
    }

    return { onEvent, close: closeStreaming };
}
