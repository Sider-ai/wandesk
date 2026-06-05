import { useSyncExternalStore } from "react";

type Handler = (payload?: any) => void;
type WsStatus = "disconnected" | "connecting" | "connected";

const handlers = new Map<string, Handler[]>();
const statusListeners = new Set<() => void>();

let ws: WebSocket | null = null;
let pingTimer: number | null = null;
let pongTimer: number | null = null;
let reconnectTimer: number | null = null;
let reconnectBlocked = false;
let status: WsStatus = "disconnected";

const getDefaultWsUrl = () => {
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const base = `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/ws`;
  return token ? `${base}?token=${token}` : base;
};

let wsUrl = getDefaultWsUrl();

const setStatus = (next: WsStatus) => {
  status = next;
  for (const listener of statusListeners) listener();
};

const emit = (type: string, data?: any) => {
  handlers.get(type)?.forEach((fn) => fn(data));
};

const clearTimers = () => {
  if (pingTimer) window.clearInterval(pingTimer);
  if (pongTimer) window.clearTimeout(pongTimer);
  if (reconnectTimer) window.clearTimeout(reconnectTimer);
  pingTimer = null;
  pongTimer = null;
  reconnectTimer = null;
};

const scheduleReconnect = (delay = 3000) => {
  if (reconnectBlocked) return;
  if (reconnectTimer) window.clearTimeout(reconnectTimer);
  reconnectTimer = window.setTimeout(() => {
    if (status === "disconnected") connect();
  }, delay);
};

export const connect = (url?: string) => {
  if (url) wsUrl = url;
  reconnectBlocked = false;
  if (ws) {
    ws.onclose = null;
    ws.close();
  }
  clearTimers();
  setStatus("connecting");
  ws = new WebSocket(wsUrl);
  ws.onopen = () => {
    setStatus("connected");
    emit("open");
    pingTimer = window.setInterval(() => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
        pongTimer = window.setTimeout(() => {
          setStatus("disconnected");
          ws?.close();
        }, 5000);
      }
    }, 30000);
  };
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "pong") {
      if (pongTimer) window.clearTimeout(pongTimer);
      pongTimer = null;
      return;
    }
    emit(data.type, data);
  };
  ws.onclose = (event) => {
    setStatus("disconnected");
    clearTimers();
    emit("close");
    if (event?.code === 1008) {
      reconnectBlocked = true;
      return;
    }
    scheduleReconnect();
  };
  ws.onerror = () => {
    setStatus("disconnected");
  };
  return ws;
};

export const disconnect = () => {
  reconnectBlocked = true;
  clearTimers();
  if (ws) {
    ws.onclose = null;
    ws.close();
  }
  ws = null;
  setStatus("disconnected");
};

export const ensureConnected = () => {
  if (ws?.readyState === WebSocket.OPEN) return Promise.resolve();
  if (status !== "connecting") connect();
  return new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error("WebSocket connection timed out")), 5000);
    const unsub = on("open", () => {
      window.clearTimeout(timeout);
      unsub();
      resolve();
    });
  });
};

export const send = (data: unknown) => {
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
};

export const on = (type: string, fn: Handler) => {
  if (!handlers.has(type)) handlers.set(type, []);
  handlers.get(type)!.push(fn);
  return () => {
    const list = handlers.get(type);
    if (!list) return;
    const index = list.indexOf(fn);
    if (index >= 0) list.splice(index, 1);
  };
};

export const getWsStatus = () => status;
export const getWsUrl = () => wsUrl;

export const useWsStatus = () => useSyncExternalStore(
  (listener) => {
    statusListeners.add(listener);
    return () => statusListeners.delete(listener);
  },
  getWsStatus,
  getWsStatus
);
