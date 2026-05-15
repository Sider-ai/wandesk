import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createSession } from "../chat/session.js";
import { isAuthenticated, isConfigured } from "../auth/session.js";
import { redact } from "./redact.js";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const loadMeemApp = (relativePath) => {
  const modulePath = resolve(__dirname, relativePath);
  if (!existsSync(modulePath)) return null;
  try {
    return require(modulePath);
  } catch (error) {
    console.warn(`[meem] skipped ${relativePath}: ${error?.message || error}`);
    return null;
  }
};

// === meem apps (CJS) — terminal / files ===
// 这些 app 来自 meem-dev,继续用 `module.exports + require`,
// 通过 createRequire 加载,挂在同一个 /ws 连接上,按消息 type 分发.
const meemApps = [
  loadMeemApp("../../../apps/terminal/index.js"),
  loadMeemApp("../../../apps/files/index.js")
].filter(Boolean);

const clients = new Set();
const clientById = new Map(); // clientId → ws

const safeStringify = (msg) => redact(JSON.stringify(msg));

const sendOne = (ws, payload) => {
  if (ws.readyState === WebSocket.OPEN) ws.send(payload);
};

export const broadcast = (msg) => {
  const payload = safeStringify(msg);
  for (const ws of clients) sendOne(ws, payload);
};

const sendToClient = (clientId, msg) => {
  const ws = clientById.get(clientId);
  if (ws) sendOne(ws, safeStringify(msg));
};

// meem 老代码通过 globalThis.__meem_ws__ 反向调 broadcast / sendToClient.
globalThis.__meem_ws__ = {
  broadcast: (msg) => broadcast(msg),
  sendToClient: (clientId, msg) => sendToClient(clientId, msg)
};

let meemInited = false;
const initMeemAppsOnce = async () => {
  if (meemInited) return;
  meemInited = true;
  for (const app of meemApps) {
    if (typeof app.init === "function") {
      try { await app.init(); }
      catch (err) { console.error(`[meem-init ${app.name}]`, err); }
    }
  }
};

const chatWss = new WebSocketServer({ noServer: true });
chatWss.on("connection", (ws) => {
  const clientId = randomUUID();
  clients.add(ws);
  clientById.set(clientId, ws);

  const send = (msg) => sendOne(ws, safeStringify(msg));
  const { handleMessage } = createSession(send);

  // 给 meem app 推一份当前快照(终端列表 + 当前活动终端)
  for (const app of meemApps) {
    if (typeof app.onClientConnect === "function") {
      try { app.onClientConnect(clientId); }
      catch (err) { console.error(`[meem-connect ${app.name}]`, err); }
    }
  }

  ws.on("message", async (raw) => {
    let data;
    try { data = JSON.parse(raw.toString()); } catch { return; }
    // 先给 meem app 一次接管机会,不命中再走 AIOS chat 处理.
    for (const app of meemApps) {
      if (typeof app.wsMatch === "function" && app.wsMatch(data?.type)) {
        try {
          data.meta = { ...(data.meta || {}), clientId };
          await app.handleWs(data);
        } catch (err) {
          console.error(`[meem-ws ${app.name}]`, err);
        }
        return;
      }
    }
    await handleMessage(data);
  });

  ws.on("close", () => {
    clients.delete(ws);
    clientById.delete(clientId);
  });
});

export const setupWebSocket = (httpServer) => {
  initMeemAppsOnce().catch((err) => console.error("[meem-init]", err));
  httpServer.on("upgrade", (req, socket, head) => {
    try {
      if (isConfigured() && !isAuthenticated(req, { allowQueryToken: true })) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      const url = new URL(req.url, `http://${req.headers.host}`);
      if (url.pathname === "/ws") {
        chatWss.handleUpgrade(req, socket, head, (ws) => {
          chatWss.emit("connection", ws, req);
        });
        return;
      }
      socket.destroy();
    } catch (err) {
      console.error("[ws-upgrade]", err);
      socket.destroy();
    }
  });
};

export { chatWss };
