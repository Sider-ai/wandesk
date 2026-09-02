// The execution endpoint for app syscalls.
//
// These endpoints are **only ever called by the HostGate inside workerd** (overseer loops back
// here through the NODE external-service binding); the appId in the request body is filled in
// by HostGate from the token — an app can never forge it itself.
import type { IncomingMessage, ServerResponse } from "http";
import { json, readJson } from "./http.js";
import { appAsset, appServerCode } from "../apps/scan.js";
import { linkAppDb } from "../syscall/db.js";
import { aiAsk, aiRun, aiStream } from "../syscall/ai.js";
import { procSpawn, procList, procLog, procKill, procExec } from "../syscall/proc.js";
import { fsList, fsRead, fsReadBase64, fsWrite, fsMkdir, fsDelete } from "../syscall/fs.js";
import { uiToast, uiOpenApp, uiOpenExternal } from "../syscall/ui.js";

type Body = Record<string, any>;

/** One handler per syscall. Throwing here = env.* throws on the app side; the message carries straight through. */
const HANDLERS: Record<string, (appId: string, body: Body) => unknown | Promise<unknown>> = {
  // ── env.DB: queries don't go through here (they execute in place, inside workerd's AppStore). Mounts a link back on first open ──
  "db-opened": (appId, b) => { linkAppDb(appId, String(b.storeId || "")); return {}; },

  // ── env.ASSETS ──
  "asset": (appId, b) => {
    const b64 = appAsset(appId, String(b.path || ""));
    return b64 === null ? { missing: true } : { b64 };
  },

  // ── env.AI ──
  "ai-ask": (appId, b) => aiAsk(appId, { summary: b.summary, prompt: b.prompt, system: b.system, data: b.data }),
  "ai-run": (appId, b) => aiRun(appId, { summary: b.summary, prompt: b.prompt, system: b.system, data: b.data }),

  // ── env.PROC ──
  "proc-spawn": (appId, b) => procSpawn(appId, String(b.command || ""), Array.isArray(b.args) ? b.args.map(String) : [], b.cwd),
  "proc-exec": (appId, b) => procExec(appId, String(b.command || ""), Array.isArray(b.args) ? b.args.map(String) : [], b.cwd, Number(b.timeoutMs) || 120000),
  "proc-list": (appId) => ({ procs: procList(appId) }),
  "proc-log": (_appId, b) => procLog(String(b.id || ""), Number(b.tail) || 200) ?? { missing: true },
  "proc-kill": (_appId, b) => ({ ok: procKill(String(b.id || ""), b.signal) }),

  // ── env.FS ──
  "fs-list": (_appId, b) => ({ entries: fsList(String(b.path || "")) }),
  "fs-read": (_appId, b) => ({ content: fsRead(String(b.path || "")) }),
  "fs-read-b64": (_appId, b) => ({ b64: fsReadBase64(String(b.path || "")) }),
  "fs-write": (_appId, b) => fsWrite(String(b.path || ""), String(b.content ?? "")),
  "fs-mkdir": (_appId, b) => fsMkdir(String(b.path || "")),
  "fs-delete": (_appId, b) => fsDelete(String(b.path || "")),

  // ── env.UI ──
  "ui-toast": (appId, b) => uiToast(appId, String(b.text || ""), String(b.kind || "info")),
  "ui-open-app": (appId, b) => uiOpenApp(appId, String(b.appId || ""), String(b.route || "/")),
  "ui-open-external": (appId, b) => uiOpenExternal(appId, String(b.url || "")),

  // ── Server-side logs: the AI debugging an app's backend needs to be able to see these ──
  "log": (appId, b) => { console.log(`[app:${appId}]`, String(b.message || "")); return { ok: true }; },
};

export const handleAppApi = async (req: IncomingMessage, res: ServerResponse, action: string): Promise<boolean> => {
  // Fetch app code: asked by overseer when it loads an app, GET
  if (action === "server-code") {
    const id = new URL(req.url || "/", "http://x").searchParams.get("id") || "";
    const code = appServerCode(id);
    return code ? json(res, 200, code) : json(res, 404, { error: "App does not exist" });
  }

  if (!(action in HANDLERS) && action !== "ai-stream") return false;

  const body = (await readJson(req)) as Body;
  const appId = String(body.appId || "");
  if (!appId) return json(res, 400, { error: "appId is missing" });

  // ai-stream rides SSE and can't be wrapped as JSON —— the app passes this response body straight through to its own frontend
  if (action === "ai-stream") {
    res.writeHead(200, {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache",
      "connection": "keep-alive",
    });
    const stream = aiStream(appId, { summary: body.summary, prompt: body.prompt, system: body.system, data: body.data });
    const reader = stream.getReader();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
    } catch { /* downstream disconnected */ }
    res.end();
    return true;
  }

  try {
    const result = await HANDLERS[action](appId, body);
    return json(res, 200, { ok: true, ...(result as object) });
  } catch (e: any) {
    return json(res, 200, { ok: false, error: String(e?.message || e) });
  }
};
