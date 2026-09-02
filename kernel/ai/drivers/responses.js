// Responses API driver.
// Does exactly one thing: send the unified { input, instructions, tools } out, parse the
// stream into a unified { items, usage, status, stopReason }, emitting deltas via onEvent
// along the way.
// Retries, looping, and tool execution don't live here — those are protocol-agnostic and
// live one layer up.
import { EVENTS } from '../events.js';

const readError = async (response) => {
    const body = await response.text().catch(() => '');
    try { return JSON.parse(body)?.error?.message || body; } catch { return body; }
};

/** Parameters that can be passed through to the model. Values are decided by the caller (config / GUI); this layer sets no defaults. */
const MODEL_OPTION_KEYS = [
    'reasoning',
    'max_output_tokens',
    'temperature',
    'top_p',
    'parallel_tool_calls',
    'tool_choice',
    'text',
    'truncation',
    'store',
    'service_tier',
    'prompt_cache_key',
    'metadata',
    'include',
];

const pickModelOptions = (options) => {
    const picked = {};
    if (!options || typeof options !== 'object') return picked;
    for (const key of MODEL_OPTION_KEYS) {
        if (options[key] !== undefined && options[key] !== null) picked[key] = options[key];
    }
    return picked;
};

/** A single attempt: send the request, read the stream, parse it. Errors thrown on failure carry `status` and `emitted`. */
async function attempt({ url, apiKey, model, input, instructions, tools, modelOptions, signal, onEvent, errorMaxChars }) {
    let emitted = false;
    const fail = (message, status) => {
        const error = new Error(message);
        if (status) error.status = status;
        error.emitted = emitted;
        return error;
    };

    let response;
    try {
        response = await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model,
                input,
                instructions,
                tools,
                stream: true,
                ...pickModelOptions(modelOptions),
            }),
            signal,
        });
    } catch (error) {
        if (error?.name === 'AbortError') throw error;
        throw fail(String(error?.message || error));
    }

    if (!response.ok) throw fail(`Responses API ${response.status}: ${(await readError(response)).slice(0, errorMaxChars)}`, response.status);
    if (!response.body) throw fail('Responses API returned an empty response', response.status);

    const items = [];
    let usage = {};
    let status = '';
    let stopReason = '';
    let sawTerminal = false;
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
                if (!payload || payload === '[DONE]') continue;
                let event;
                try { event = JSON.parse(payload); } catch { continue; }
                if (event.type === 'response.output_text.delta') {
                    emitted = true;
                    onEvent(EVENTS.MESSAGE, { delta: String(event.delta || '') });
                } else if (event.type === 'response.reasoning_text.delta' || event.type === 'response.reasoning_summary_text.delta') {
                    emitted = true;
                    onEvent(EVENTS.REASONING, { delta: String(event.delta || '') });
                } else if (event.type === 'response.output_item.added' && event.item?.type === 'function_call') {
                    onEvent(EVENTS.FUNCTION_CALL, { phase: 'started' });
                } else if (event.type === 'response.output_item.done' && event.item) {
                    items.push(event.item);
                } else if (event.type === 'response.completed' || event.type === 'response.incomplete') {
                    sawTerminal = true;
                    usage = event.response?.usage || {};
                    status = String(event.response?.status || (event.type === 'response.completed' ? 'completed' : 'incomplete'));
                    // Both truncation and content filtering go through incomplete. Skipping the reason
                    // would let a partial reply be reported back as a success.
                    stopReason = String(event.response?.incomplete_details?.reason || '');
                } else if (event.type === 'response.failed') {
                    sawTerminal = true;
                    throw fail(event.response?.error?.message || 'Model response failed');
                } else if (event.type === 'error') {
                    sawTerminal = true;
                    throw fail(event.error?.message || event.message || 'Model stream returned an error');
                }
            }
        }
    } catch (error) {
        if (error?.name === 'AbortError') throw error;
        error.emitted = emitted;
        throw error;
    }

    // The stream finished but no terminal event was seen — the connection dropped mid-stream.
    // Without this guard, partial content would be treated as a normal completion.
    if (!sawTerminal) throw fail('Responses API stream was interrupted before a terminal event');

    return { items, usage, status: status || 'completed', stopReason };
}

export default { id: 'responses', label: 'Responses API', attempt };
