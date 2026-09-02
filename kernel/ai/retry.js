// Retry determination.
//
// Check order is fixed: quota/billing (terminal) → HTTP status code → error text fallback.
// Status codes are structured and reliable; the text tables are only a fallback for the
// network- and stream-layer errors thrown by fetch.
// Doing it the other way round causes false positives — the "500" and "429" in the tables
// are bare substrings that would match body text like "max 500 tokens".
//
// The two classification tables are ported from earendil-works/pi (MIT)
// https://github.com/earendil-works/pi/blob/main/packages/ai/src/utils/retry.ts
// Copyright (c) 2025 Mario Zechner. Licensed under the MIT License.

const pattern = (parts) => new RegExp(parts.join('|'), 'i');

/** Account credit, quota, or billing exhausted. Looks like rate limiting, but no number of retries will fix it. */
const NON_RETRYABLE = pattern([
    'insufficient_quota',
    'quota exceeded',
    'out of budget',
    'billing',
    'Monthly usage limit reached',
    'available balance',
    'GoUsageLimitError',
    'FreeUsageLimitError',
]);

/** Transient network- and stream-layer failures. Used only as a fallback when no HTTP status code is available. */
const RETRYABLE_TEXT = pattern([
    'overloaded',
    'rate.?limit',
    'too many requests',
    'service.?unavailable',
    'server.?error',
    'internal.?error',
    'provider.?returned.?error',
    'network.?error',
    'connection.?error',
    'connection.?refused',
    'connection.?lost',
    'other side closed',
    'fetch failed',
    'getaddrinfo',
    'ENOTFOUND',
    'EAI_AGAIN',
    'ECONNRESET',
    'ETIMEDOUT',
    'EPIPE',
    'upstream.?connect',
    'reset before headers',
    'socket hang up',
    'socket connection was closed',
    'timed? out',
    'timeout',
    'terminated',
    'websocket.?closed',
    'websocket.?error',
    'ended without',
    'stream ended before message_stop',
    'stream ended before a terminal response event',
    'http2 request did not get a response',
]);

/** HTTP status codes that are explicitly retryable. All other 4xx codes are treated as terminal. */
const RETRYABLE_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504, 524]);

export const DEFAULT_RETRY = Object.freeze({
    enabled: true,
    maxRetries: 3,
    baseDelayMs: 1_000,
    maxDelayMs: 30_000,
    /** If the stream has already emitted content before breaking, retrying would duplicate the body. Default is not to retry; let the caller surface the error. */
    retryAfterStream: false,
});

export function normalizeRetry(policy) {
    if (policy === false) return { ...DEFAULT_RETRY, enabled: false };
    return { ...DEFAULT_RETRY, ...(policy && typeof policy === 'object' ? policy : {}) };
}

/**
 * Whether this error is worth retrying.
 * @param error The thrown error, which may carry a `status` (HTTP status code).
 */
export function isRetryable(error) {
    if (error?.name === 'AbortError') return false;
    const text = String(error?.message || error || '');
    if (NON_RETRYABLE.test(text)) return false;
    const status = Number(error?.status);
    if (Number.isInteger(status) && status > 0) return RETRYABLE_STATUS.has(status);
    return RETRYABLE_TEXT.test(text);
}

/** Exponential backoff with jitter. Jitter adds up to 25% on top of the base, to avoid multiple paths hitting the origin at once. */
export function backoffMs(attempt, policy) {
    const raw = policy.baseDelayMs * 2 ** Math.max(0, attempt - 1);
    const capped = Math.min(policy.maxDelayMs, raw);
    return Math.round(capped * (1 + Math.random() * 0.25));
}

/** A wait that can be interrupted by abort. */
export function sleep(ms, signal) {
    if (signal?.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'));
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            signal?.removeEventListener('abort', onAbort);
            resolve();
        }, ms);
        const onAbort = () => {
            clearTimeout(timer);
            reject(new DOMException('Aborted', 'AbortError'));
        };
        signal?.addEventListener('abort', onAbort, { once: true });
    });
}
