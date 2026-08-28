import { readFile, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { toLf } from './text.js';

const IMAGES = new Map([['.png', 'image/png'], ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'], ['.gif', 'image/gif'], ['.webp', 'image/webp']]);
const MAX_LIMIT = 2000;
// 单次返回的字符预算:行数上限挡不住超长行(压缩过的 JS 一行几十万字符照样撑爆上下文),
// 超预算就在**行边界**停下 —— 返回的 lines 数如实缩小,模型按 offset 自然续读。
const MAX_CHARS = 30_000;

export async function read({ path, offset = 1, limit = MAX_LIMIT }, context = {}) {
    if (!context.cwd) throw new Error('read 需要 context.cwd');
    if (!path) throw new Error('path 不能为空');

    const file = resolve(context.cwd, path);
    const mimeType = IMAGES.get(extname(file).toLowerCase());
    if (mimeType) {
        const info = await stat(file);
        return { path: file, image: { path: file, mimeType, size: info.size } };
    }
    // 按 LF 返回，和 edit 的匹配口径保持一致，行尾的 \r 不会漏给模型。
    const content = toLf(await readFile(file, 'utf8'));
    const lines = content.split('\n');
    // 以换行结尾的文件会切出一个尾随空串，它不是一行，否则行号整体多 1。
    if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
    const start = Math.max(1, Number(offset) || 1);
    const count = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || MAX_LIMIT));
    const slice = lines.slice(start - 1, start - 1 + count);

    // 字符预算内整行收口:至少返回一行(单行超预算时截行并注明,模型可用 bash 取整行)
    const kept = [];
    let used = 0;
    for (const line of slice) {
        if (kept.length > 0 && used + line.length + 1 > MAX_CHARS) break;
        kept.push(line);
        used += line.length + 1;
    }
    let body = kept.join('\n');
    if (kept.length === 1 && body.length > MAX_CHARS) {
        body = `${body.slice(0, MAX_CHARS)}\n[第 ${start} 行共 ${slice[0].length} 字符,超出单次预算已截行;完整行可用 bash: sed -n '${start}p' 该文件]`;
    }

    return {
        path: file,
        content: body,
        offset: start,
        lines: kept.length,
        total_lines: lines.length,
    };
}
