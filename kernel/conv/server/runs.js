// Run orchestration: only one round runs at a time per conversation, the loop runs in the
// background, and events go out over the broadcast.
//
// Key difference from 0.0.2: **persisted item by item**. Previously result.items was only
// stored once the whole round finished, so a mid-round stop or crash lost the whole round;
// now every item is persisted as soon as it completes, and stopping only drops the half-
// streamed fragment in flight.
// On stop / error, dangling function_calls are backfilled (Responses requires call and
// output to come in pairs; missing one gets the entire next request rejected), and a system
// trace note is recorded —— for the user to see, and for the model to see.
import { runAgent } from '../../agent/index.js';
import { compact, shouldCompact } from '../../agent/compact.js';
import { complete } from '../../ai/index.js';
import { EVENTS } from '../shared/events.js';

const DEFAULT_TITLE = 'New conversation';

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

    /** After a stop / error, backfill an output for any function_call that never got a result, persist it, and fold it into the context. */
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

    /** After the first round finishes, ask the model for a title; on failure just keep the mechanical title and don't bother anyone. */
    async function autoTitle(conversationId, userContent, items, runtime) {
        const reply = items.filter((item) => item?.type === 'message').map(itemText).join('\n').slice(0, 1200);
        try {
            const result = await complete({
                driver: runtime.driver,
                responsesUrl: runtime.responsesUrl,
                apiKey: runtime.apiKey,
                model: runtime.model,
                errorMaxChars: config.errorMaxChars,
                instructions: 'Write a title of no more than 16 words that summarizes what the user is trying to do. Output only the title itself — no quotation marks, no period.',
                input: [{ role: 'user', content: `User: ${String(userContent).slice(0, 1200)}\n\nAssistant: ${reply}` }],
            });
            const title = String(result.text).replace(/\s+/g, ' ').trim().slice(0, 32);
            if (!title) return;
            store.setTitle(conversationId, title);
            broadcast(EVENTS.CONVERSATIONS_CHANGED, {});
        } catch { /* if title generation fails, keep the mechanical title */ }
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
                ? [{ role: 'system', content: `[incomplete] The previous reply did not finish completely: ${result.stopReason}` }]
                : [];
            for (const marker of tail) store.append(conversationId, marker);
            store.saveContext(conversationId, [...folded.history, user, ...result.items, ...tail], result.usage);
            broadcast(EVENTS.DONE, { conversationId, usage: result.usage, stopReason: result.stopReason || '' });
            if (conversation.title === DEFAULT_TITLE) void autoTitle(conversationId, user.content, result.items, runtime);
        } catch (error) {
            const aborted = controller.signal.aborted;
            const reason = aborted ? 'The task was stopped by the user; this call did not complete' : 'The run errored; this call did not complete';
            const settled = settleDanglingCalls(conversationId, generated, reason);
            const marker = aborted
                ? { role: 'system', content: '[stopped] The previous reply was stopped by the user; output ends here.' }
                : { role: 'system', content: `[error] The previous run failed: ${String(error?.message || error).slice(0, config.errorMaxChars)}` };
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

        /** Persist the user message, light up the title, kick the loop off in the background, and immediately return the saved message. */
        start(conversation, content, attachments = [], clientId = '') {
            if (active.has(conversation.id)) throw Object.assign(new Error('This conversation is already running'), { status: 409 });
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
                throw Object.assign(new Error('Please select a driver and fill in the API URL, API key, and model in settings first'), { status: 400 });
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
                // work() catches its own errors; getting here means the catch itself blew up (e.g. persisting failed) —— don't let the process silently rot
                console.error('[runs] failed to finalize:', error);
                active.delete(conversation.id);
                broadcast(EVENTS.ERROR, { conversationId: conversation.id, message: String(error?.message || error) });
            });
            return saved;
        },
    };
}
