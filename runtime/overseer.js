// 应用运行时监理 —— 跑在 workerd 里,只干三件事:
//
//   1. **路由**:/app/<token>/* → 那个应用自己的 fetch handler(token 是路由键,见 apps/token.ts);
//   2. **装载**:按需(首个请求才起)、按 server.js 内容哈希做版本键(改完下次请求即新版);
//   3. **注入 binding**:把 Cloudflare 形态的 env 递给应用 —— DB / ASSETS / AI / PROC / FS / UI。
//
// 应用本身只是一个标准 Worker 网站,静态资源与 API 都由它自己应答。
// 与 CF 平台同构不是比喻:env.DB 就是 D1 接口,这份 server.js 原样能部署上云。
import { WorkerEntrypoint } from "cloudflare:workers";

// ── 注入进每个应用 isolate 的运行时垫片 ─────────────────────────────
// 应用看到的是标准形态的 env;底下这些桩把调用回环到内核(Node)。
const RUNTIME_MODULE = `
class D1Result {
  constructor(rows, meta) { this.results = rows; this.success = true; this.meta = meta; }
}

class D1PreparedStatement {
  constructor(host, sql, params) { this.host = host; this.sql = sql; this.params = params || []; }
  bind(...values) { return new D1PreparedStatement(this.host, this.sql, values); }
  async all() {
    const r = await this.host.dbExec(this.sql, this.params);
    return new D1Result(r.rows || [], { changes: r.changes || 0, last_row_id: r.lastInsertRowid || 0 });
  }
  async first(column) {
    const { results } = await this.all();
    const row = results[0];
    if (!row) return null;
    return column === undefined ? row : row[column];
  }
  async run() { return this.all(); }
  async raw() { const { results } = await this.all(); return results.map((r) => Object.values(r)); }
}

class D1Database {
  constructor(host) { this.host = host; }
  prepare(sql) { return new D1PreparedStatement(this.host, String(sql), []); }
  /** 多语句脚本(建表等)。 */
  async exec(sql) { const r = await this.host.dbExec(String(sql), []); return { count: 1, duration: 0, ...r }; }
  /** 批量:一次往返,一个事务里跑完。 */
  async batch(statements) {
    const list = (statements || []).map((s) => ({ sql: s.sql, params: s.params || [] }));
    const out = await this.host.dbBatch(list);
    return (out.results || []).map((r) => new D1Result(r.rows || [], { changes: r.changes || 0, last_row_id: r.lastInsertRowid || 0 }));
  }
}

const MIME = {
  html: "text/html; charset=utf-8", htm: "text/html; charset=utf-8",
  js: "text/javascript; charset=utf-8", mjs: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8", json: "application/json; charset=utf-8",
  svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  gif: "image/gif", webp: "image/webp", ico: "image/x-icon", woff2: "font/woff2",
  mp4: "video/mp4", txt: "text/plain; charset=utf-8", md: "text/plain; charset=utf-8",
};

const bytesOf = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

class AssetsBinding {
  constructor(host) { this.host = host; }
  async fetch(input) {
    const url = new URL(typeof input === "string" ? input : input.url);
    let p = decodeURIComponent(url.pathname);
    if (p.endsWith("/")) p += "index.html";
    let got = await this.host.asset(p);
    let ext = (p.split(".").pop() || "").toLowerCase();
    if (!got && !/\\.[a-z0-9]+$/i.test(p)) { got = await this.host.asset("/index.html"); ext = "html"; }
    if (!got) return new Response("not found", { status: 404 });
    return new Response(bytesOf(got.b64), {
      headers: { "content-type": MIME[ext] || "application/octet-stream", "cache-control": "no-cache" },
    });
  }
}

/** env.AI —— 唯一的智能面。stream 直接给一个 Response,应用当自己的响应体透传即可。 */
class AiBinding {
  constructor(host) { this.host = host; }
  ask(req)  { return this.host.aiAsk(req || {}); }
  run(req)  { return this.host.aiRun(req || {}); }
  async stream(req) {
    const body = await this.host.aiStream(req || {});
    return new Response(body, {
      headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-cache" },
    });
  }
}

class ProcBinding {
  constructor(host) { this.host = host; }
  spawn(command, args, cwd) { return this.host.procSpawn(command, args || [], cwd); }
  exec(command, args, cwd, timeoutMs) { return this.host.procExec(command, args || [], cwd, timeoutMs); }
  list() { return this.host.procList(); }
  log(id, tail) { return this.host.procLog(id, tail); }
  kill(id, signal) { return this.host.procKill(id, signal); }
}

class FsBinding {
  constructor(host) { this.host = host; }
  list(path) { return this.host.fsList(path || ""); }
  read(path) { return this.host.fsRead(path); }
  readBase64(path) { return this.host.fsReadBase64(path); }
  write(path, content) { return this.host.fsWrite(path, content); }
  mkdir(path) { return this.host.fsMkdir(path); }
  delete(path) { return this.host.fsDelete(path); }
}

class UiBinding {
  constructor(host) { this.host = host; }
  toast(text, kind) { return this.host.uiToast(text, kind); }
  openApp(appId, route) { return this.host.uiOpenApp(appId, route); }
  openExternal(url) { return this.host.uiOpenExternal(url); }
}

export const makeEnv = (raw) => {
  const host = raw.__WD_HOST;
  return {
    ...raw,
    DB: new D1Database(host),
    ASSETS: new AssetsBinding(host),
    AI: new AiBinding(host),
    PROC: new ProcBinding(host),
    FS: new FsBinding(host),
    UI: new UiBinding(host),
    log: (...m) => host.log(...m),
  };
};
`;

// 入口垫片:包装 env 后转交给应用自己的 default export。
const ENTRY_MODULE = `
import app from "app-server.js";
import { makeEnv } from "wd-runtime.js";

export default {
  async fetch(req, env, ctx) {
    if (typeof app?.fetch !== "function") {
      return new Response("应用的 server.js 必须 export default { async fetch(req, env) {…} }", {
        status: 500, headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    return app.fetch(req, makeEnv(env), ctx);
  },
};
`;

/** 应用对外的唯一通道:动作全部回内核执行。appId 由这里填,应用伪造不了。 */
export class HostGate extends WorkerEntrypoint {
  async #node(action, body) {
    const res = await this.env.NODE.fetch(`http://node/api/app/${action}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ appId: this.ctx.props?.appId, ...body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.ok === false) throw new Error(String(data?.error || `内核错误 ${res.status}`));
    return data;
  }

  // ── env.DB ──
  dbExec(sql, params) { return this.#node("db", { sql: String(sql || ""), params: Array.isArray(params) ? params : [] }); }
  dbBatch(statements) { return this.#node("db-batch", { statements: statements || [] }); }

  // ── env.ASSETS ──
  async asset(path) {
    const data = await this.#node("asset", { path: String(path || "") }).catch(() => null);
    return data && data.b64 !== undefined ? { b64: data.b64 } : null;
  }

  // ── env.AI ──
  aiAsk(req) { return this.#node("ai-ask", { summary: req.summary, prompt: req.prompt, system: req.system, data: req.data }); }
  aiRun(req) { return this.#node("ai-run", { summary: req.summary, prompt: req.prompt, system: req.system, data: req.data }); }
  /** 返回 ReadableStream —— workerd RPC 支持流式返回值,SSE 因此能一路透到应用前端。 */
  async aiStream(req) {
    const res = await this.env.NODE.fetch("http://node/api/app/ai-stream", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ appId: this.ctx.props?.appId, summary: req.summary, prompt: req.prompt, system: req.system, data: req.data }),
    });
    return res.body;
  }

  // ── env.PROC ──
  procSpawn(command, args, cwd) { return this.#node("proc-spawn", { command, args, cwd }); }
  procExec(command, args, cwd, timeoutMs) { return this.#node("proc-exec", { command, args, cwd, timeoutMs }); }
  procList() { return this.#node("proc-list", {}); }
  procLog(id, tail) { return this.#node("proc-log", { id, tail }); }
  procKill(id, signal) { return this.#node("proc-kill", { id, signal }); }

  // ── env.FS ──
  fsList(path) { return this.#node("fs-list", { path }); }
  fsRead(path) { return this.#node("fs-read", { path }); }
  fsReadBase64(path) { return this.#node("fs-read-b64", { path }); }
  fsWrite(path, content) { return this.#node("fs-write", { path, content }); }
  fsMkdir(path) { return this.#node("fs-mkdir", { path }); }
  fsDelete(path) { return this.#node("fs-delete", { path }); }

  // ── env.UI ──
  uiToast(text, kind) { return this.#node("ui-toast", { text, kind }); }
  uiOpenApp(appId, route) { return this.#node("ui-open-app", { appId, route }); }
  uiOpenExternal(url) { return this.#node("ui-open-external", { url }); }

  /** 服务端日志回流内核控制台 —— AI 调试自己写的后端要看得到。 */
  async log(...message) {
    await this.#node("log", {
      message: message.map((m) => { try { return typeof m === "string" ? m : JSON.stringify(m); } catch { return String(m); } }).join(" "),
    }).catch(() => {});
  }
}

const loadApp = async (env, ctx, appId) => {
  const res = await env.NODE.fetch(`http://node/api/app/server-code?id=${encodeURIComponent(appId)}`);
  if (!res.ok) throw new Error(`取应用代码失败:${appId}(${res.status})`);
  const { code, version } = await res.json();
  return env.LOADER.get(`${appId}@${version}`, () => ({
    compatibilityDate: "2026-02-01",
    mainModule: "entry.js",
    modules: {
      "entry.js": ENTRY_MODULE,
      "wd-runtime.js": RUNTIME_MODULE,
      "app-server.js": String(code),
    },
    env: { __WD_HOST: ctx.exports.HostGate({ props: { appId } }) },
    // 能力全开:应用可以直接 fetch() 出网(见 APP.md「当前取舍」)
  }));
};

const resolveApp = async (env, token) => {
  const res = await env.NODE.fetch(`http://node/api/apps/resolve-token?token=${encodeURIComponent(token)}`);
  if (!res.ok) return null;
  const { appId } = await res.json();
  return appId || null;
};

// 每个应用一个 origin:`http://<token>.localhost:<port>/`。
// 为什么不是 `/app/<token>/` 路径前缀 —— 那样应用就不站在自己的网站根上,
// `/style.css` 和契约里写的 `fetch("/api/…")` 会逃出应用根,契约立不住。
// `*.localhost` 由浏览器直接解析到 127.0.0.1(Chromium / Firefox 原生支持,
// 桌面壳是 Electron,所以生产路径稳)。
export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const token = /^([a-f0-9]{16,64})\.localhost$/.exec(url.hostname)?.[1];

    if (!token) {
      // 没有子域 = 不是冲着某个应用来的。健康检查走这条。
      if (url.pathname === "/health") return new Response("ok");
      return new Response("请经 <token>.localhost 访问应用", { status: 404 });
    }

    const appId = await resolveApp(env, token);
    if (!appId) return new Response("forbidden", { status: 403 });

    // 壳的 SDK:应用 <script src="/_wd/sdk.js"> 引入
    if (url.pathname === "/_wd/sdk.js") {
      const sdk = await env.NODE.fetch("http://node/api/apps/sdk.js");
      return new Response(await sdk.text(), {
        headers: { "content-type": "text/javascript; charset=utf-8", "cache-control": "no-cache" },
      });
    }

    try {
      const worker = await loadApp(env, ctx, appId);
      return await worker.getEntrypoint().fetch(req);
    } catch (e) {
      return new Response(`应用启动失败:${e?.message || e}`, {
        status: 500, headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
  },
};
