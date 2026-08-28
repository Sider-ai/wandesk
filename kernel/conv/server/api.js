// /api/* 路由表。只做解析、校验和应答,业务在 store / runs / channel 里。
import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import { EVENTS } from '../shared/events.js';
import { DRIVER_IDS } from '../../ai/index.js';

const json = (response, status, body) => {
    response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(body));
};

const readBody = async (request) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    if (!chunks.length) return {};
    try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return {}; }
};

const isDirectory = (path) => {
    try { return statSync(path).isDirectory(); } catch { return false; }
};

export function createApi({ config, store, runs, files, channel, meta }) {
    /** 校验并归一工作目录;非法时返回 null。 */
    const normalizeWorkdir = (value) => {
        const path = resolve(String(value || '').trim() || config.workdir);
        return isDirectory(path) ? path : null;
    };

    /** 处理了返回 true;不是 /api 请求返回 false 交给静态层。 */
    return async function handle(request, response, url) {
        if (!url.pathname.startsWith('/api/')) return false;
        const segments = url.pathname.split('/').filter(Boolean);
        const method = request.method || 'GET';

        try {
            if (method === 'GET' && url.pathname === '/api/health') { json(response, 200, { ok: true }); return true; }
            if (method === 'GET' && url.pathname === '/api/meta') {
                json(response, 200, { model: store.getSettings().model || '', defaultWorkdir: config.workdir, version: meta.version });
                return true;
            }
            if (method === 'GET' && url.pathname === '/api/settings') {
                json(response, 200, { settings: store.getSettings() }); return true;
            }
            if (method === 'PUT' && url.pathname === '/api/settings') {
                const input = await readBody(request);
                const allowed = ['driver', 'responsesUrl', 'apiKey', 'model', 'instructions'];
                const values = Object.fromEntries(allowed.filter((key) => typeof input[key] === 'string').map((key) => [key, input[key].trim()]));
                // 驱动名要挡在这里 —— 存进去一个不认识的值,下次运行才炸就太晚了
                if (values.driver && !DRIVER_IDS.includes(values.driver)) {
                    json(response, 400, { error: `未知的驱动:${values.driver}` }); return true;
                }
                const settings = store.setSettings(values);
                json(response, 200, { settings }); return true;
            }
            if (method === 'GET' && url.pathname === '/api/events') { channel.handle(request, response); return true; }
            if (method === 'GET' && url.pathname === '/api/runs') { json(response, 200, { ids: runs.ids() }); return true; }
            if (method === 'GET' && segments[1] === 'files' && segments[2]) {
                if (await files.serve(segments[2], response)) return true;
                json(response, 404, { error: '文件不存在' }); return true;
            }
            if (method === 'POST' && url.pathname === '/api/files') {
                const attachment = await files.upload(await readBody(request));
                json(response, 201, { attachment }); return true;
            }

            if (method === 'GET' && url.pathname === '/api/conversations') {
                json(response, 200, { conversations: store.listConversations() });
                return true;
            }
            if (method === 'POST' && url.pathname === '/api/conversations') {
                const input = await readBody(request);
                const workdir = normalizeWorkdir(input.workdir);
                if (!workdir) { json(response, 400, { error: '工作目录不存在' }); return true; }
                const conversation = store.createConversation({
                    id: crypto.randomUUID(),
                    title: String(input.title || '').trim().slice(0, 64) || '新对话',
                    workdir,
                });
                channel.broadcast(EVENTS.CONVERSATIONS_CHANGED, {});
                json(response, 201, { conversation });
                return true;
            }

            if (segments[0] === 'api' && segments[1] === 'conversations' && segments[2]) {
                const id = segments[2];
                const conversation = store.getConversation(id);
                if (!conversation) { json(response, 404, { error: '对话不存在' }); return true; }

                if (method === 'PATCH' && segments.length === 3) {
                    const input = await readBody(request);
                    if (typeof input.title === 'string') {
                        const title = input.title.trim().slice(0, 64);
                        if (!title) { json(response, 400, { error: '标题不能为空' }); return true; }
                        store.setTitle(id, title);
                    }
                    if (typeof input.pinned === 'boolean') store.setPinned(id, input.pinned);
                    if (typeof input.workdir === 'string') {
                        const workdir = normalizeWorkdir(input.workdir);
                        if (!workdir) { json(response, 400, { error: '工作目录不存在' }); return true; }
                        store.setWorkdir(id, workdir);
                    }
                    channel.broadcast(EVENTS.CONVERSATIONS_CHANGED, {});
                    json(response, 200, { conversation: store.getConversation(id) });
                    return true;
                }
                if (method === 'DELETE' && segments.length === 3) {
                    runs.stop(id);
                    const deleted = store.deleteConversation(id);
                    channel.broadcast(EVENTS.CONVERSATION_DELETED, { conversationId: id });
                    channel.broadcast(EVENTS.CONVERSATIONS_CHANGED, {});
                    json(response, 200, { deleted });
                    return true;
                }
                if (method === 'GET' && segments[3] === 'messages') {
                    const before = Number(url.searchParams.get('before')) || 0;
                    const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit')) || 60));
                    json(response, 200, store.listMessages(id, { before, limit }));
                    return true;
                }
                if (method === 'POST' && segments[3] === 'messages') {
                    const input = await readBody(request);
                    const content = String(input.content || '').trim();
                    const attachments = files.normalizeMany(input.attachments);
                    if (!content && !attachments.length) { json(response, 400, { error: '消息不能为空' }); return true; }
                    const message = runs.start(conversation, content, attachments, String(input.clientId || ''));
                    json(response, 202, { message });
                    return true;
                }
                if (method === 'POST' && segments[3] === 'stop') {
                    json(response, 200, { stopped: runs.stop(id) });
                    return true;
                }
            }

            json(response, 404, { error: '接口不存在' });
        } catch (error) {
            json(response, error?.status || 500, { error: String(error?.message || error) });
        }
        return true;
    };
}
