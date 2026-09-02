// Compacts earlier history between runs once the context watermark is crossed.
import { complete } from '../ai/index.js';

const chars = (item) => {
    try { return JSON.stringify(item).length; } catch { return 0; }
};

const text = (item, config) => {
    if (item?.type === 'function_call') return `${item.name}: ${String(item.arguments || '').slice(0, config.callArgsMaxChars)}`;
    if (item?.type === 'function_call_output') return String(item.output || '').slice(0, config.callOutputMaxChars);
    const content = item?.content;
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) return content.map((part) => part?.text || '').join('');
    return '';
};

// The tail-keep amount is adaptive: min(tailChars, 40% of total) — since the watermark has
// already been crossed, this compaction pass needs to actually cut the bulk of it away;
// with a fixed 40k kept, history that's just over 40k would trim the "earlier part" down to
// one or two items, and the summarizer would faithfully report the false fact that "nothing
// happened" — plus the watermark wouldn't drop, so it'd happen again every single turn.
const splitAt = (history, tailChars) => {
    const total = history.reduce((sum, item) => sum + chars(item), 0);
    const tailKeep = Math.min(tailChars, Math.floor(total * 0.4));
    let at = history.length;
    let size = 0;
    while (at > 0 && (size < tailKeep || history.length - at < 2)) {
        at -= 1;
        size += chars(history[at]);
    }
    while (at > 0 && history[at]?.type === 'function_call_output') at -= 1;
    while (at > 0 && history[at - 1]?.type === 'function_call') at -= 1;
    return at;
};

/** The material handed to the summarizer must be at least this many characters — compacting
 *  a mere scrap is pointless and would only produce a misleading summary. */
const MATERIAL_MIN_CHARS = 1500;

const material = (items, config) => items
    .filter((item) => item?.type !== 'reasoning')
    .map((item, index) => `#${index + 1} ${item.role || item.type || 'unknown'}\n${text(item, config)}`)
    .join('\n\n---\n\n');

const mechanical = (items, config) => [
    '[Mechanical summary of earlier conversation]',
    ...items.map((item, index) => `#${index + 1} ${item.role || item.type || 'unknown'} ${text(item, config).replace(/\s+/g, ' ').slice(0, config.mechanicalItemMaxChars)}`),
].join('\n');

/** Whether usage has reached the compaction watermark. Exported separately so callers can
 *  anticipate it (e.g. the web frontend broadcasting "compacting" ahead of time). */
export function shouldCompact({ usage, compaction }) {
    if (!compaction || typeof compaction !== 'object') throw new Error('compaction config is required');
    const used = (Number(usage?.input_tokens) || 0) + (Number(usage?.output_tokens) || 0);
    return Boolean(compaction.contextWindowTokens) && used >= compaction.contextWindowTokens * compaction.foldRatio;
}

export async function compact({
    history,
    usage,
    compaction,
    driver,
    responsesUrl,
    apiKey,
    model,
    errorMaxChars,
    signal,
}) {
    if (!shouldCompact({ usage, compaction })) return { history, compacted: false };

    const at = splitAt(history, compaction.tailKeepChars);
    if (at < 2) return { history, compacted: false };

    const early = history.slice(0, at);
    // Skip compaction when the material is too thin (e.g. just the first user message, blank
    // once reasoning items are filtered out): it wouldn't fold away much context, but it would
    // still plant a false "nothing happened" fact in the history.
    if (material(early, compaction).length < MATERIAL_MIN_CHARS) return { history, compacted: false };
    let summary = '';
    let kind = 'summary';
    let tokens = 0;
    try {
        const result = await complete({
            driver,
            responsesUrl,
            apiKey,
            model,
            instructions: compaction.prompt,
            input: [{ role: 'user', content: `Compact the conversation below:\n\n${material(early, compaction)}` }],
            errorMaxChars,
            signal,
        });
        tokens = (Number(result.usage?.input_tokens) || 0) + (Number(result.usage?.output_tokens) || 0);
        if (String(result.text).trim().length >= compaction.summaryMinChars) summary = String(result.text).trim();
    } catch { /* fall back to the deterministic index when summarization fails */ }
    if (!summary) {
        summary = mechanical(early, compaction);
        kind = 'mechanical';
    }

    return {
        compacted: true,
        summary,
        kind,
        tokens,
        sourceCount: early.length,
        tailCount: history.length - at,
        history: [
            { role: 'system', content: `[Summary of earlier conversation]\n${summary}` },
            ...history.slice(at),
        ],
    };
}
