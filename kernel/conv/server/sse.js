// Persistent event channel: GET /api/events opens an SSE stream, and every conversation
// event is broadcast from here.
// A run is no longer tied to a single HTTP request —— switching conversations, refreshing
// the page, or opening a second window never drops the stream;
// reconnect-on-disconnect is EventSource's native behavior, the server just needs to set retry clearly.
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
