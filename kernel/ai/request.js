// Driver dispatch + retry. All protocol differences live under ai/drivers/ — this layer
// doesn't know about any specific protocol.
import { EVENTS } from './events.js';
import { driverFor } from './drivers/index.js';
import { backoffMs, isRetryable, normalizeRetry, sleep } from './retry.js';

export async function request({
    driver = 'responses',
    url,
    apiKey,
    model,
    input,
    instructions = '',
    tools = [],
    modelOptions,
    retry,
    signal,
    onEvent = () => {},
    errorMaxChars,
}) {
    const impl = driverFor(driver);
    if (!url || !apiKey || !model) throw new Error(`Missing endpoint URL, API key, or model name (driver: ${impl.label})`);
    if (!Number.isInteger(errorMaxChars) || errorMaxChars <= 0) throw new Error('errorMaxChars must be a positive integer');

    const policy = normalizeRetry(retry);
    const args = { url, apiKey, model, input, instructions, tools, modelOptions, signal, onEvent, errorMaxChars };

    for (let attemptNo = 1; ; attemptNo += 1) {
        try {
            return await impl.attempt(args);
        } catch (error) {
            if (signal?.aborted || error?.name === 'AbortError') throw error;
            const exhausted = attemptNo > policy.maxRetries;
            // Retrying after content has already been emitted would duplicate the body; default is not to, let the caller surface the error.
            const streamed = error?.emitted && !policy.retryAfterStream;
            if (!policy.enabled || exhausted || streamed || !isRetryable(error)) throw error;

            const delay = backoffMs(attemptNo, policy);
            onEvent(EVENTS.RETRY, {
                attempt: attemptNo,
                maxRetries: policy.maxRetries,
                delayMs: delay,
                error: String(error?.message || error),
            });
            await sleep(delay, signal);
        }
    }
}
