// 应用 syscall 的执行端。
//
// 这些端点**只由 workerd 里的 HostGate 调用**(overseer 经 NODE 外部服务绑定回环过来),
// 请求体里的 appId 由 HostGate 按 token 填,应用自己伪造不了。
import type { IncomingMessage, ServerResponse } from "http";
import { json, readJson } from "./http.js";
import { appAsset, appServerCode } from "../apps/scan.js";
import { execAppSql, batchAppSql } from "../syscall/db.js";
import { aiAsk, aiRun, aiStream } from "../syscall/ai.js";
import { procSpawn, procList, procLog, procKill, procExec } from "../syscall/proc.js";
import { fsList, fsRead, fsReadBase64, fsWrite, fsMkdir, fsDelete } from "../syscall/fs.js";
import { uiToast, uiOpenApp, uiOpenExternal } from "../syscall/ui.js";

type Body = Record<string, any>;

/** 每个 syscall 一个 handler。抛异常 = 应用侧 env.* 抛异常,信息原样带过去。 */
const HANDLERS: Record<string, (appId: string, body: Body) => unknown | Promise<unknown>> = {
  // ── env.DB ──
  "db": (appId, b) => execAppSql(appId, String(b.sql || ""), Array.isArray(b.params) ? b.params : []),
  "db-batch": (appId, b) => batchAppSql(appId, Array.isArray(b.statements) ? b.statements : []),

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

  // ── 服务端日志:AI 调试应用后端要看得见 ──
  "log": (appId, b) => { console.log(`[app:${appId}]`, String(b.message || "")); return { ok: true }; },
};

export const handleAppApi = async (req: IncomingMessage, res: ServerResponse, action: string): Promise<boolean> => {
  // 取应用代码:overseer 装载应用时问的,GET
  if (action === "server-code") {
    const id = new URL(req.url || "/", "http://x").searchParams.get("id") || "";
    const code = appServerCode(id);
    return code ? json(res, 200, code) : json(res, 404, { error: "应用不存在" });
  }

  if (!(action in HANDLERS) && action !== "ai-stream") return false;

  const body = (await readJson(req)) as Body;
  const appId = String(body.appId || "");
  if (!appId) return json(res, 400, { error: "缺少 appId" });

  // ai-stream 走 SSE,不能包成 JSON —— 应用会把这条响应体原样透传给自己的前端
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
    } catch { /* 下游断开 */ }
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
