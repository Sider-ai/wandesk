import { readFile, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { toLf } from './text.js';

const IMAGES = new Map([['.png', 'image/png'], ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'], ['.gif', 'image/gif'], ['.webp', 'image/webp']]);
const MAX_LIMIT = 2000;
// Character budget per call: a max line count alone can't stop an oversized line (a minified
// JS file with hundreds of thousands of characters on one line would still blow the context),
// so once over budget we stop at a **line boundary** — the returned `lines` count shrinks
// accordingly, and the model naturally continues reading via `offset`.
const MAX_CHARS = 30_000;

export async function read({ path, offset = 1, limit = MAX_LIMIT }, context = {}) {
    if (!context.cwd) throw new Error('read requires context.cwd');
    if (!path) throw new Error('path must not be empty');

    const file = resolve(context.cwd, path);
    const mimeType = IMAGES.get(extname(file).toLowerCase());
    if (mimeType) {
        const info = await stat(file);
        return { path: file, image: { path: file, mimeType, size: info.size } };
    }
    // Returned with LF line endings, matching how `edit` does its matching, so no trailing
    // \r ever leaks through to the model.
    const content = toLf(await readFile(file, 'utf8'));
    const lines = content.split('\n');
    // A file ending in a newline splits off a trailing empty string that isn't a real line —
    // otherwise every line number would be off by one.
    if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
    const start = Math.max(1, Number(offset) || 1);
    const count = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || MAX_LIMIT));
    const slice = lines.slice(start - 1, start - 1 + count);

    // Close out at a whole line within the character budget: always return at least one line
    // (if a single line exceeds the budget, truncate it and note that, so the model can fetch
    // the full line via bash)
    const kept = [];
    let used = 0;
    for (const line of slice) {
        if (kept.length > 0 && used + line.length + 1 > MAX_CHARS) break;
        kept.push(line);
        used += line.length + 1;
    }
    let body = kept.join('\n');
    if (kept.length === 1 && body.length > MAX_CHARS) {
        body = `${body.slice(0, MAX_CHARS)}\n[line ${start} has ${slice[0].length} characters, exceeding the per-call budget so it was truncated; to get the full line use bash: sed -n '${start}p' on this file]`;
    }

    return {
        path: file,
        content: body,
        offset: start,
        lines: kept.length,
        total_lines: lines.length,
    };
}
