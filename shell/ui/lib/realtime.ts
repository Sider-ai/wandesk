// Kernel → shell events. One-way, receive only, never send.
import { EV } from "./events";

type Handler = (payload: any) => void;
const handlers = new Map<string, Set<Handler>>();

let socket: WebSocket | null = null;
let retry = 0;

const connect = () => {
  const proto = location.protocol === "https:" ? "wss" : "ws";
  // In dev, vite is on 5180 and the kernel on 9600 — WebSocket doesn't go through the vite proxy, connect straight to the kernel.
  const host = location.port === "5180" ? "127.0.0.1:9600" : location.host;
  socket = new WebSocket(`${proto}://${host}/`);
  socket.onopen = () => { retry = 0; };
  socket.onmessage = (e) => {
    try {
      const { event, payload } = JSON.parse(e.data);
      for (const fn of handlers.get(event) || []) fn(payload);
    } catch { /* ignore a bad frame */ }
  };
  socket.onclose = () => {
    socket = null;
    retry = Math.min(retry + 1, 6);
    setTimeout(connect, 500 * 2 ** (retry - 1)); // backoff reconnect
  };
  socket.onerror = () => { try { socket?.close(); } catch { /* already closed */ } };
};

export const startRealtime = () => { if (!socket) connect(); };

export const on = (event: string, fn: Handler) => {
  if (!handlers.has(event)) handlers.set(event, new Set());
  handlers.get(event)!.add(fn);
  return () => { handlers.get(event)?.delete(fn); };
};

export { EV };
