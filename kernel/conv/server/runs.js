// 运行编排:一个对话同一时刻只有一轮在跑,轮子在后台转,事件走广播。
//
// 与 0.0.2 的关键差别:**逐条落库**。从前整轮结束才存 result.items,
// 中途停止或崩溃就整轮丢失;现在每个 item 完成即落库,停止只丢正在流式的半句。
// 停止 / 出错时补齐悬空的 function_call(Responses 要求 call 与 output 成对,
// 缺一个下一轮请求整个被拒),并落一条系统留痕 —— 给用户看,也给模型看。
import { runAgent } from '../../agent/index.js';
import { compact, shouldCompact } from '../../agent/compact.js';
import { complete } from '../../ai/index.js';
import { EVENTS } from '../shared/events.js';

const DEFAULT_TITLE = '新对话';

const mechanicalTitle = (content) => String(content).replace(/\s+/g, ' ').trim().slice(0, 24) || DEFAULT_TITLE;

const itemText = (item) => {
    if (typeof item?.content === 'string') return item.content;
    if (Array.isArray(item?.content)) return item.content.map((part) => part?.text || '').join('');
    return '';
};

const parseArgs = (value) => {
    try { return JSON.parse(String(value || '{}')); } catch { return {}; }
};

export function createRuns({ config, store, files, broadcast }) {
    const active = new Map();

    /** 停止 / 出错后,给没等到结果的 function_call 补一条输出,落库并进上下文。 */
    function settleDanglingCalls(conversationId, items, reason) {
        const pending = new Map();
        for (const item of items) {
            if (item?.type === 'function_call') pending.set(item.call_id, item);
            else if (item?.type === 'function_call_output') pending.delete(item.call_id);
        }
        const settled = [];
        for (const call of pending.values()) {
            const output = {
                type: 'function_call_output',
                call_id: call.call_id,
                output: JSON.stringify({ error: reason }),
            };
            store.append(conversationId, output);
            broadcast(EVENTS.CALL_OUTPUT, { conversationId, callId: call.call_id, result: output.output });
            settled.push(output);
        }
        return settled;
    }

    /** 首轮跑完后请模型起个标题;失败就留着机械标题,不打扰任何人。 */
    async function autoTitle(conversationId, userContent, items, runtime) {
        const reply = items.filter((item) => item?.type === 'message').map(itemText).join('\n').slice(0, 1200);
        try {
            const result = await complete({
                driver: runtime.driver,
                responsesUrl: runtime.responsesUrl,
                apiKey: runtime.apiKey,
                model: runtime.model,
                errorMaxChars: config.errorMaxChars,
                instructions: '为这段对话起一个不超过 16 个字的标题,概括用户想做的事。只输出标题本身,不要引号和句号。',
                input: [{ role: 'user', content: `用户:${String(userContent).slice(0, 1200)}\n\n助手:${reply}` }],
            });
            const title = String(result.text).replace(/\s+/g, ' ').trim().slice(0, 32);
            if (!title) return;
            store.setTitle(conversationId, title);
            broadcast(EVENTS.CONVERSATIONS_CHANGED, {});
        } catch { /* 起不出来就用机械标题 */ }
    }

    async function work(conversation, user, controller, runtime) {
        const conversationId = conversation.id;
        const generated = [];

        if (shouldCompact({ usage: conversation.usage, compaction: config.compaction })) {
            broadcast(EVENTS.COMPACT_START, { conversationId });
        }
        const folded = await compact({
            ...runtime,
            history: conversation.context,
            usage: conversation.usage,
            signal: controller.signal,
        });
        if (folded.compacted) {
            const previousEnd = store.lastCompactionEnd(conversationId);
            const endSeq = store.latestMessageSeq(conversationId) - 1 - folded.tailCount;
            const startSeq = previousEnd + 1;
            if (endSeq >= startSeq) {
                store.appendCompaction(conversationId, {
                    startSeq,
                    endSeq,
                    summary: folded.summary,
                    kind: folded.kind,
                    tokens: folded.tokens,
                });
            }
            broadcast(EVENTS.COMPACT_DONE, { conversationId });
        }

        const emit = (type, data) => {
            if (type === 'message' && data.delta) {
                broadcast(EVENTS.DELTA, { conversationId, content: data.delta });
            } else if (type === 'reasoning' && data.delta) {
                broadcast(EVENTS.REASONING, { conversationId, content: data.delta });
            } else if (type === 'function_call' && data.phase === 'started') {
                broadcast(EVENTS.CALL_STARTED, { conversationId });
            } else if (data.item) {
                generated.push(data.item);
                store.append(conversationId, data.item);
                if (type === 'function_call') {
                    broadcast(EVENTS.CALLS, {
                        conversationId,
                        calls: [{ callId: data.item.call_id, name: data.item.name, args: parseArgs(data.item.arguments) }],
                    });
                } else if (type === 'function_call_output') {
                    broadcast(EVENTS.CALL_OUTPUT, { conversationId, callId: data.item.call_id, result: data.item.output || '' });
                }
            }
        };

        try {
            const result = await runAgent({
                ...runtime,
                workdir: conversation.workdir,
                runId: crypto.randomUUID(),
                input: [...folded.history, user],
                env: process.env,
                signal: controller.signal,
                emit,
                prepareInput: files.prepareInput,
            });
            const tail = result.stopReason
                ? [{ role: 'system', content: `[incomplete] 上一条回复未完整结束:${result.stopReason}` }]
                : [];
            for (const marker of tail) store.append(conversationId, marker);
            store.saveContext(conversationId, [...folded.history, user, ...result.items, ...tail], result.usage);
            broadcast(EVENTS.DONE, { conversationId, usage: result.usage, stopReason: result.stopReason || '' });
            if (conversation.title === DEFAULT_TITLE) void autoTitle(conversationId, user.content, result.items, runtime);
        } catch (error) {
            const aborted = controller.signal.aborted;
            const reason = aborted ? '任务被用户停止,该调用未完成' : '运行出错,该调用未完成';
            const settled = settleDanglingCalls(conversationId, generated, reason);
            const marker = aborted
                ? { role: 'system', content: '[stopped] 上一条回复被用户停止,输出到此为止。' }
                : { role: 'system', content: `[error] 上一轮运行失败:${String(error?.message || error).slice(0, config.errorMaxChars)}` };
            store.append(conversationId, marker);
            store.saveContext(
                conversationId,
                [...folded.history, user, ...generated, ...settled, marker],
                conversation.usage,
            );
            if (aborted) broadcast(EVENTS.ABORTED, { conversationId });
            else broadcast(EVENTS.ERROR, { conversationId, message: String(error?.message || error) });
        } finally {
            active.delete(conversationId);
            broadcast(EVENTS.CONVERSATIONS_CHANGED, {});
        }
    }

    return {
        ids: () => [...active.keys()],
        isRunning: (id) => active.has(id),

        stop(id) {
            const controller = active.get(id);
            controller?.abort();
            return Boolean(controller);
        },

        /** 落库用户消息、点亮标题、把轮子丢进后台,立即返回已存的那条消息。 */
        start(conversation, content, attachments = [], clientId = '') {
            if (active.has(conversation.id)) throw Object.assign(new Error('该对话正在运行'), { status: 409 });
            const savedSettings = store.getSettings();
            const runtime = {
                ...config,
                driver: savedSettings.driver || config.driver || 'responses',
                responsesUrl: savedSettings.responsesUrl || '',
                apiKey: savedSettings.apiKey || '',
                model: savedSettings.model || '',
                instructions: savedSettings.instructions || '',
            };
            if (!runtime.responsesUrl || !runtime.apiKey || !runtime.model) {
                throw Object.assign(new Error('请先在设置中选择驱动并填写接口地址、API Key 和模型'), { status: 400 });
            }
            const controller = new AbortController();
            active.set(conversation.id, controller);

            const user = { role: 'user', content, attachments };
            const saved = store.append(conversation.id, user);
            if (conversation.title === DEFAULT_TITLE) {
                store.setTitle(conversation.id, mechanicalTitle(content || attachments[0]?.name));
            }
            broadcast(EVENTS.START, { conversationId: conversation.id, clientId, content });
            broadcast(EVENTS.CONVERSATIONS_CHANGED, {});

            work(conversation, user, controller, runtime).catch((error) => {
                // work 自己兜错;走到这儿说明兜错本身炸了(如落库失败),别让进程静默烂掉
                console.error('[runs] 收尾失败:', error);
                active.delete(conversation.id);
                broadcast(EVENTS.ERROR, { conversationId: conversation.id, message: String(error?.message || error) });
            });
            return saved;
        },
    };
}
