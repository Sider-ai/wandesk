import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export async function write({ path, content = '' }, context = {}) {
    if (!context.cwd) throw new Error('write requires context.cwd');
    if (!path) throw new Error('path must not be empty');

    const file = resolve(context.cwd, path);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, String(content), 'utf8');

    return { path: file, bytes: Buffer.byteLength(String(content)) };
}
