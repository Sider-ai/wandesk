// One-shot completion without tools, for summaries and titles.
import { request } from './request.js';

export async function complete({
    driver,
    responsesUrl,
    apiKey,
    model,
    instructions = '',
    input,
    modelOptions,
    retry,
    errorMaxChars,
    signal,
}) {
    if (!Array.isArray(input)) throw new Error('input must be an array');

    const result = await request({
        driver,
        url: responsesUrl,
        apiKey,
        model,
        input,
        instructions: String(instructions),
        tools: [],
        modelOptions,
        retry,
        signal,
        errorMaxChars,
    });
    const text = result.items
        .filter((item) => item.type === 'message')
        .flatMap((item) => Array.isArray(item.content) ? item.content : [])
        .map((part) => part.text || '')
        .join('');

    return { text, usage: result.usage };
}
