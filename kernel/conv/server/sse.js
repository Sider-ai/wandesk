// 常驻事件通道:GET /api/events 挂一条 SSE,所有对话事件都从这儿广播。
// 运行不再绑在某次 HTTP 请求上 —— 切对话、刷新页面、开第二个窗口都不丢流;
// 断线重连是 EventSource 的原生能力,服务端只管把 retry 写清楚。
const HEARTBEAT_MS = 25_000;

export function createChannel() {
    const clients = new Set();

    const heartbeat = setInterval(() => {
        for (const client of clients) {
            if (client.writableEnded) { clients.delete(client); continue; }
            client.write(': ping\n\n');
        }
    }, HEARTBEAT_MS);
    heartbeat.unref?.();

    return {
        handle(request, response) {
            response.writeHead(200, {
                'content-type': 'text/event-stream; charset=utf-8',
                'cache-control': 'no-cache',
                connection: 'keep-alive',
                'x-accel-buffering': 'no',
            });
            response.write('retry: 2000\n\n');
            clients.add(response);
            request.on('close', () => clients.delete(response));
        },

        broadcast(type, data = {}) {
            const frame = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
            for (const client of clients) {
                if (client.writableEnded) { clients.delete(client); continue; }
                client.write(frame);
            }
        },

        close() {
            clearInterval(heartbeat);
            for (const client of clients) client.end();
            clients.clear();
        },
    };
}
