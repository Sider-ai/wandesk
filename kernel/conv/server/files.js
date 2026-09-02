import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';

const IMAGE_TYPES = new Map([
    ['.png', 'image/png'], ['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'],
    ['.gif', 'image/gif'], ['.webp', 'image/webp'],
]);
const IMAGE_EXTENSIONS = new Map([...IMAGE_TYPES].map(([extension, mimeType]) => [mimeType, extension === '.jpeg' ? '.jpg' : extension]));

const safeName = (value) => basename(String(value || 'file')).replace(/[^\p{L}\p{N}._ -]/gu, '_').slice(0, 120) || 'file';
const dataUrl = async (image) => {
    const bytes = await readFile(image.path);
    return `data:${image.mimeType};base64,${bytes.toString('base64')}`;
};

export function createFiles(config) {
    const policy = config.images || {};
    const maxBytes = Number(policy.maxBytes) || 8 * 1024 * 1024;
    const maxPerMessage = Number(policy.maxPerMessage) || 10;
    const maxLiveToolImages = Number(policy.maxLiveToolImages) || 2;
    const root = resolve(policy.directory || join(dirname(resolve(config.web.dataFile)), 'files'));

    const normalize = (input) => {
        const file = basename(String(input?.file || input?.id || ''));
        if (!file) return null;
        const path = join(root, file);
        if (!path.startsWith(`${root}/`)) return null;
        return {
            id: file,
            name: safeName(input?.name || file),
            path,
            mimeType: String(input?.mimeType || 'application/octet-stream'),
            size: Number(input?.size) || 0,
            url: `/api/files/${encodeURIComponent(file)}`,
        };
    };

    return {
        maxBytes,
        maxPerMessage,
        root,
        async upload(input) {
            const bytes = Buffer.from(String(input?.dataBase64 || ''), 'base64');
            if (!bytes.length) throw Object.assign(new Error('File content is empty'), { status: 400 });
            if (bytes.length > maxBytes) throw Object.assign(new Error(`File cannot exceed ${Math.floor(maxBytes / 1024 / 1024)}MB`), { status: 413 });
            let name = safeName(input?.name);
            let ext = extname(name).toLowerCase().slice(0, 12);
            if (!IMAGE_TYPES.has(ext) && IMAGE_EXTENSIONS.has(input?.mimeType)) {
                ext = IMAGE_EXTENSIONS.get(input.mimeType);
                name = `${name.replace(/\.[^.]*$/, '')}${ext}`;
            }
            const id = `${createHash('sha256').update(bytes).digest('hex')}${ext}`;
            await mkdir(root, { recursive: true });
            await writeFile(join(root, id), bytes, { flag: 'wx' }).catch((error) => { if (error.code !== 'EEXIST') throw error; });
            return normalize({ file: id, name, mimeType: IMAGE_TYPES.get(ext) || String(input?.mimeType || 'application/octet-stream'), size: bytes.length });
        },
        normalizeMany(values) {
            if (!Array.isArray(values)) return [];
            if (values.length > maxPerMessage) throw Object.assign(new Error(`Each message can have at most ${maxPerMessage} files`), { status: 400 });
            return values.map(normalize).filter(Boolean);
        },
        async serve(id, response) {
            const file = normalize({ file: id });
            if (!file) return false;
            try {
                const info = await stat(file.path);
                response.writeHead(200, { 'content-type': IMAGE_TYPES.get(extname(file.path).toLowerCase()) || 'application/octet-stream', 'content-length': info.size, 'cache-control': 'private, max-age=31536000, immutable' });
                response.end(await readFile(file.path));
                return true;
            } catch { return false; }
        },
        async prepareInput(items) {
            const lastUser = items.reduce((found, item, index) => item?.role === 'user' ? index : found, -1);
            let toolImages = 0;
            const output = [];
            for (let index = items.length - 1; index >= 0; index -= 1) {
                const item = items[index];
                if (index === lastUser && item?.attachments?.length) {
                    const parts = [];
                    const text = typeof item.content === 'string' ? item.content : '';
                    if (text) parts.push({ type: 'input_text', text });
                    for (const attachment of item.attachments) {
                        if (String(attachment.mimeType).startsWith('image/') && attachment.size <= maxBytes) {
                            parts.push({ type: 'input_image', image_url: await dataUrl(attachment) });
                        } else parts.push({ type: 'input_text', text: `[Local file: ${attachment.name}\nPath: ${attachment.path}]` });
                    }
                    output.unshift({ role: 'user', content: parts });
                } else if (item?.type === 'function_call_output' && item.image && index > lastUser && toolImages < maxLiveToolImages) {
                    toolImages += 1;
                    output.unshift({ type: item.type, call_id: item.call_id, output: [
                        { type: 'input_text', text: String(item.output || '') },
                        { type: 'input_image', image_url: await dataUrl(item.image) },
                    ] });
                } else {
                    const clean = { ...item };
                    delete clean.attachments;
                    delete clean.image;
                    output.unshift(clean);
                }
            }
            return output;
        },
    };
}
