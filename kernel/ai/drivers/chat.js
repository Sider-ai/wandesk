// Chat Completions driver.
// For services that only expose /chat/completions (GLM, most third-party gateways).
//
// Upward, it hands back exactly the same shape as the Responses driver: the unified items
// vocabulary, unified onEvent deltas, normalized usage. Downward, it absorbs all the Chat
// protocol's own quirks itself — zero dependency between the two drivers.
//
// The internal item vocabulary follows the Responses one (message / reasoning / function_call /
// function_call_output), because that's already AGENT's internal contract: the database, the
// UI, and context compaction all key off of it.
import { EVENTS } from '../events.js';

const readError = async (response) => {
    const body = await response.text().catch(() => '');
    try { return JSON.parse(body)?.error?.message || body; } catch { return body; }
};

let seq = 0;
const nextId = (prefix) => `${prefix}_${Date.now().toString(36)}${(seq += 1).toString(36)}`;

/* ────────────── Request: unified shape → Chat shape ────────────── */

const textOf = (parts) => (Array.isArray(parts) ? parts : [])
    .filter((part) => part?.type === 'input_text' || part?.type === 'output_text' || typeof part?.text === 'string')
    .map((part) => String(part.text || ''))
    .join('');

const imagesOf = (parts) => (Array.isArray(parts) ? parts : [])
    .filter((part) => part?.type === 'input_image' && part.image_url)
    .map((part) => ({ type: 'image_url', image_url: { url: String(part.image_url) } }));

/** Content of a plain message: plain text gets a string, images get an array (some services only accept strings). */
function contentOf(raw) {
    if (typeof raw === 'string') return raw;
    const images = imagesOf(raw);
    const text = textOf(raw);
    if (!images.length) return text;
    return [...(text ? [{ type: 'text', text }] : []), ...images];
}

/**
 * input[] → messages[].
 *
 * Three hard requirements of the Chat protocol:
 *  1. Consecutive function_calls must be merged into **one** assistant message carrying
 *     multiple tool_calls; splitting them into separate messages gets flagged as "tool_calls
 *     with no matching assistant message".
 *  2. reasoning items must not be sent back — Chat has no such role, and sending one gets a
 *     flat 400.
 *  3. A tool message's content can only be text; images returned by tools are collected and
 *     sent out afterward in a separate user message once this batch of tool messages is done,
 *     otherwise it would break the assistant/tool pairing.
 */
export function toMessages(input = [], instructions = '') {
    const messages = [];
    if (String(instructions || '').trim()) messages.push({ role: 'system', content: String(instructions) });

    let pendingCalls = null;   // tool_calls currently being accumulated
    let pendingImages = [];    // tool-returned images currently being accumulated

    const flushCalls = () => {
        if (!pendingCalls) return;
        messages.push({ role: 'assistant', content: null, tool_calls: pendingCalls });
        pendingCalls = null;
    };
    const flushImages = () => {
        if (!pendingImages.length) return;
        messages.push({ role: 'user', content: [{ type: 'text', text: '(image returned by the previous tool step)' }, ...pendingImages] });
        pendingImages = [];
    };

    for (const item of input) {
        if (!item || typeof item !== 'object') continue;

        if (item.type === 'function_call') {
            flushImages();
            pendingCalls ??= [];
            pendingCalls.push({
                id: String(item.call_id || item.id || nextId('call')),
                type: 'function',
                function: { name: String(item.name || ''), arguments: String(item.arguments ?? '{}') },
            });
            continue;
        }
        flushCalls();

        if (item.type === 'function_call_output') {
            const parts = Array.isArray(item.output) ? item.output : null;
            messages.push({
                role: 'tool',
                tool_call_id: String(item.call_id || ''),
                content: parts ? textOf(parts) : String(item.output ?? ''),
            });
            if (parts) pendingImages.push(...imagesOf(parts));
            continue;
        }
        flushImages();

        // Chat has no reasoning role. Sending it back gets a 400, so just drop it.
        if (item.type === 'reasoning') continue;

        const role = String(item.role || (item.type === 'message' ? 'assistant' : 'user'));
        const content = contentOf(item.content);
        if (content === '' || (Array.isArray(content) && !content.length)) continue;
        messages.push({ role, content });
    }
    flushCalls();
    flushImages();
    return messages;
}

/** Responses' flat tool → Chat's nested tool. */
export const toTools = (tools = []) => (Array.isArray(tools) ? tools : [])
    .filter((tool) => tool && (tool.name || tool.function?.name))
    .map((tool) => (tool.function ? tool : {
        type: 'function',
        function: {
            name: String(tool.name),
            ...(tool.description ? { description: String(tool.description) } : {}),
            ...(tool.parameters ? { parameters: tool.parameters } : {}),
        },
    }));

/**
 * Model parameters. Only a handful of keys map one-to-one between the two protocols; the rest
 * differ per provider — map what maps, and pass the rest through as-is via modelOptions.chat.
 * Don't guess here.
 */
const DIRECT_KEYS = ['temperature', 'top_p', 'tool_choice', 'parallel_tool_calls', 'stop', 'seed'];

export function toModelOptions(options) {
    const out = {};
    if (!options || typeof options !== 'object') return out;
    for (const key of DIRECT_KEYS) if (options[key] !== undefined && options[key] !== null) out[key] = options[key];
    if (options.max_output_tokens !== undefined) out.max_tokens = options.max_output_tokens;
    if (options.chat && typeof options.chat === 'object') Object.assign(out, options.chat);
    return out;
}

/** Chat's usage → Responses' field names. Context compaction reads input_tokens/output_tokens;
 *  without normalizing, the watermark would stay at 0 forever, compaction would never trigger,
 *  and the context would just overflow. */
export function toUsage(usage) {
    if (!usage || typeof usage !== 'object') return {};
    const input = Number(usage.prompt_tokens ?? usage.input_tokens ?? 0) || 0;
    const output = Number(usage.completion_tokens ?? usage.output_tokens ?? 0) || 0;
    return {
        input_tokens: input,
        output_tokens: output,
        total_tokens: Number(usage.total_tokens ?? input + output) || input + output,
        ...(usage.completion_tokens_details ? { output_tokens_details: usage.completion_tokens_details } : {}),
        ...(usage.prompt_tokens_details ? { input_tokens_details: usage.prompt_tokens_details } : {}),
    };
}

/** finish_reason → Responses' status / incomplete reason.
 *  Both length and content_filter mean "didn't finish speaking"; treating them as completed
 *  would report a partial reply as a complete result. */
export function toStatus(finishReason) {
    const reason = String(finishReason || '');
    if (reason === 'length') return { status: 'incomplete', stopReason: 'max_output_tokens' };
    if (reason === 'content_filter') return { status: 'incomplete', stopReason: 'content_filter' };
    return { status: 'completed', stopReason: '' };
}

/* ────────────── Response: Chat stream → unified items ────────────── */

/**
 * Accumulates Chat's streaming deltas into Responses-shaped items.
 *
 * The difference from the Responses driver: there, the server hands back fully-formed items
 * directly; here there are only fragments that must be assembled by hand. A tool call's
 * arguments behave differently across services — OpenAI splits them into many pieces, GLM
 * sends the whole thing at once — accumulating by index holds for both.
 */
export function createAssembler(onEvent = () => {}) {
    let text = '';
    let reasoning = '';
    const calls = new Map(); // index -> { id, name, arguments }
    let finishReason = '';
    let usage = null;
    let emitted = false;

    return {
        get emitted() { return emitted; },

        /** Consumes one chunk. Returns false if the chunk had no content (a heartbeat, etc.). */
        push(chunk) {
            if (chunk?.usage) usage = chunk.usage;
            const choice = (chunk?.choices || [])[0];
            if (!choice) return false;
            if (choice.finish_reason) finishReason = String(choice.finish_reason);

            const delta = choice.delta || choice.message || {};
            const think = delta.reasoning_content ?? delta.reasoning;
            if (think) { reasoning += String(think); emitted = true; onEvent(EVENTS.REASONING, { delta: String(think) }); }
            if (delta.content) {
                const piece = typeof delta.content === 'string' ? delta.content : textOf(delta.content);
                if (piece) { text += piece; emitted = true; onEvent(EVENTS.MESSAGE, { delta: piece }); }
            }

            for (const part of delta.tool_calls || []) {
                const index = Number(part.index ?? calls.size);
                let call = calls.get(index);
                if (!call) {
                    call = { id: String(part.id || nextId('call')), name: '', arguments: '' };
                    calls.set(index, call);
                    onEvent(EVENTS.FUNCTION_CALL, { phase: 'started' });
                }
                if (part.id) call.id = String(part.id);
                if (part.function?.name) call.name += String(part.function.name);
                if (part.function?.arguments) call.arguments += String(part.function.arguments);
            }
            return true;
        },

        /** Finalize: assembles accumulated fragments into items. Order follows the Responses convention: reasoning first, then the message body, then tool calls. */
        finish() {
            const items = [];
            if (reasoning) {
                items.push({
                    type: 'reasoning', id: nextId('rs'),
                    summary: [], content: [{ type: 'reasoning_text', text: reasoning }],
                });
            }
            if (text) {
                items.push({
                    type: 'message', id: nextId('msg'), role: 'assistant', status: 'completed',
                    content: [{ type: 'output_text', text, annotations: [] }],
                });
            }
            for (const call of calls.values()) {
                items.push({
                    type: 'function_call', id: nextId('fc'), call_id: call.id,
                    name: call.name, arguments: call.arguments || '{}', status: 'completed',
                });
            }
            // When there are tool calls, finish_reason is tool_calls — that's a normal completion, not truncation
            const { status, stopReason } = toStatus(calls.size && finishReason === 'length' ? 'tool_calls' : finishReason);
            return { items, usage: toUsage(usage), status, stopReason };
        },
    };
}

async function attempt({ url, apiKey, model, input, instructions, tools, modelOptions, signal, onEvent, errorMaxChars }) {
    const assembler = createAssembler(onEvent);
    const fail = (message, status) => {
        const error = new Error(message);
        if (status) error.status = status;
        error.emitted = assembler.emitted;
        return error;
    };

    let response;
    try {
        response = await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model,
                messages: toMessages(input, instructions),
                ...(tools?.length ? { tools: toTools(tools) } : {}),
                stream: true,
                // Many services don't include usage in the stream by default — must ask explicitly, otherwise context compaction never triggers
                stream_options: { include_usage: true },
                ...toModelOptions(modelOptions),
            }),
            signal,
        });
    } catch (error) {
        if (error?.name === 'AbortError') throw error;
        throw fail(String(error?.message || error));
    }

    if (!response.ok) throw fail(`Chat Completions ${response.status}: ${(await readError(response)).slice(0, errorMaxChars)}`, response.status);
    if (!response.body) throw fail('Chat Completions returned an empty response', response.status);

    let sawData = false;
    let buffer = '';
    const decoder = new TextDecoder();
    try {
        for await (const chunk of response.body) {
            buffer += decoder.decode(chunk, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            for (const line of lines) {
                const raw = line.trim();
                if (!raw.startsWith('data:')) continue;
                const payload = raw.slice(5).trim();
                if (!payload) continue;
                if (payload === '[DONE]') { sawData = true; continue; }
                let event;
                try { event = JSON.parse(payload); } catch { continue; }
                // Some gateways stuff the error into the stream instead of the HTTP status code
                if (event?.error) throw fail(event.error?.message || String(event.error));
                assembler.push(event);
                sawData = true;
            }
        }
    } catch (error) {
        if (error?.name === 'AbortError') throw error;
        error.emitted = assembler.emitted;
        throw error;
    }

    // Never having seen any data = the connection broke mid-stream. Without this check, an empty reply would be treated as a normal completion.
    if (!sawData) throw fail('Chat Completions stream broke before any data was received');
    return assembler.finish();
}

export default { id: 'chat', label: 'Chat Completions', attempt };
