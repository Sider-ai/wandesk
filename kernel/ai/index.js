// Model → tools → model, until the model stops calling tools.
import { request } from './request.js';
import { runTools } from './runner.js';
import { EVENTS } from './events.js';

export { complete } from './complete.js';
export { DRIVER_IDS, DEFAULT_DRIVER, DRIVERS } from './drivers/index.js';

export async function runAgent({
    runId,
    driver,
    responsesUrl,
    apiKey,
    model,
    instructions = '',
    input,
    tools = [],
    modelOptions,
    retry,
    executors = new Map(),
    maxRounds,
    errorMaxChars,
    workdir,
    env,
    signal,
    emit = () => {},
    prepareInput = async (items) => items,
}) {
    if (!runId || !Array.isArray(input)) throw new Error('runId and input are required');
    if (!Number.isInteger(maxRounds) || maxRounds <= 0) throw new Error('maxRounds must be a positive integer');

    try {
        const generated = [];
        for (let round = 0; round < maxRounds; round += 1) {
            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

            const result = await request({
                driver,
                url: responsesUrl,
                apiKey,
                model,
                input: await prepareInput([...input, ...generated]),
                instructions: String(instructions),
                tools,
                modelOptions,
                retry,
                signal,
                onEvent: emit,
                errorMaxChars,
            });

            const calls = result.items.filter((item) => item.type === 'function_call');
            result.items.forEach((item, index) => {
                generated.push(item);
                const usage = index === result.items.length - 1 ? result.usage : undefined;
                if (item.type === 'message') emit(EVENTS.MESSAGE, { item, usage });
                else if (item.type === 'reasoning') emit(EVENTS.REASONING, { item, usage });
                else if (item.type === 'function_call') emit(EVENTS.FUNCTION_CALL, { phase: 'completed', item, usage });
            });

            if (!calls.length) {
                // Truncation / content filtering goes through incomplete. Pass it through as-is —
                // don't let the caller mistake a partial reply for a complete result.
                const done = { runId, status: result.status || 'completed', usage: result.usage };
                if (result.stopReason) done.stopReason = result.stopReason;
                emit(EVENTS.DONE, done);
                return { items: generated, usage: result.usage, status: done.status, stopReason: result.stopReason || '' };
            }

            const outputs = await runTools(calls, executors, {
                signal,
                cwd: workdir,
                env,
            });
            for (const item of outputs) {
                generated.push(item);
                emit(EVENTS.FUNCTION_CALL_OUTPUT, { item });
            }
        }
        throw new Error(`Reached the tool loop limit (${maxRounds})`);
    } catch (error) {
        if (signal?.aborted) emit(EVENTS.DONE, { runId, status: 'aborted' });
        else emit(EVENTS.ERROR, { runId, terminal: true, error: String(error?.message || error) });
        throw error;
    }
}
