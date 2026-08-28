import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export async function write({ path, content = '' }, context = {}) {
    if (!context.cwd) throw new Error('write 需要 context.cwd');
    if (!path) throw new Error('path 不能为空');

    const file = resolve(context.cwd, path);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, String(content), 'utf8');

    return { path: file, bytes: Buffer.byteLength(String(content)) };
}
