// 内核 → 壳的事件。单向,只收不发。
import { EV } from "./events";

type Handler = (payload: any) => void;
const handlers = new Map<string, Set<Handler>>();

let socket: WebSocket | null = null;
let retry = 0;

const connect = () => {
  const proto = location.protocol === "https:" ? "wss" : "ws";
  // 开发态 vite 在 5180,内核在 9600 —— WebSocket 不走 vite 代理,直连内核。
  const host = location.port === "5180" ? "127.0.0.1:9600" : location.host;
  socket = new WebSocket(`${proto}://${host}/`);
  socket.onopen = () => { retry = 0; };
  socket.onmessage = (e) => {
    try {
      const { event, payload } = JSON.parse(e.data);
      for (const fn of handlers.get(event) || []) fn(payload);
    } catch { /* 忽略坏帧 */ }
  };
  socket.onclose = () => {
    socket = null;
    retry = Math.min(retry + 1, 6);
    setTimeout(connect, 500 * 2 ** (retry - 1)); // 退避重连
  };
  socket.onerror = () => { try { socket?.close(); } catch { /* 已关 */ } };
};

export const startRealtime = () => { if (!socket) connect(); };

export const on = (event: string, fn: Handler) => {
  if (!handlers.has(event)) handlers.set(event, new Set());
  handlers.get(event)!.add(fn);
  return () => { handlers.get(event)?.delete(fn); };
};

export { EV };
