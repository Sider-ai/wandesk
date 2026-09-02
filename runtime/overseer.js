// 应用运行时监理 —— 跑在 workerd 里,只干四件事:
//
//   1. **路由**:<token>.localhost/* → 那个应用自己的 fetch handler(token 是路由键,见 apps/token.ts);
//   2. **装载**:按需(首个请求才起)、按 server.js 内容哈希做版本键(改完下次请求即新版);
//   3. **注入 binding**:把 Cloudflare 形态的 env 递给应用 —— DB / ASSETS / AI / PROC / FS / UI;
//   4. **存数据**:env.DB 落在这里的 AppStore(Durable Object + workerd 内置 SQLite),不回内核。
//
// 应用本身只是一个标准 Worker 网站,静态资源与 API 都由它自己应答。
// 与 CF 平台同构不是比喻:env.DB 就是 D1 接口,这份 server.js 原样能部署上云 ——
// 而 D1 在 Cloudflare 上本来就是「DO + SQLite」包了一层,这里用的正是那个底层。
import { DurableObject, WorkerEntrypoint } from "cloudflare:workers";

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
  /**
   * 会话面:把一整个 HTTP 请求转给内核的会话 API(对话 / 消息 / 常驻 SSE / 设置 / 附件)。
   * 应用只要 return env.AI.fetch(req) 就有了一套完整的对话后端 —— 「助理」就是这么来的,
   * 它没有任何特权,换个 UI 照样能接。SSE 也走这条路:流是在同一条请求里下来的。
   */
  async fetch(req) {
    const url = new URL(req.url);
    const body = req.method === "GET" || req.method === "HEAD" ? null : await req.text();
    return this.host.aiFetch(url.pathname + url.search, req.method, body, req.headers.get("content-type") || "");
  }
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


// ── AppStore:env.DB 的执行端 ─────────────────────────────────
// 每个应用一个 Durable Object(idFromName(appId)),数据在 workerd 内置的 SQLite 里,
// 文件落在 <workspace>/.wandesk/store/<uniqueKey>/<对象ID>.sqlite。第一次开门时通知内核,
// 内核在 apps/<id>/data.db 放一个指向它的符号链接,`sqlite3 apps/notes/data.db` 照样能查。
const MAX_DB_BYTES = 200 * 1024 * 1024; // 单库上限:失控膨胀的保险丝
const FORBIDDEN = /\b(attach|load_extension)\b/i;   // 「应用只该碰自己的库」—— workerd 本来也拦,双保险
const isRead = (sql) => /^\s*(select|with|pragma|explain)\b/i.test(sql);
const META_TABLE = "_wd_meta"; // 库里自报家门:sqlite3 打开一个 .sqlite 能知道它是哪个应用的

export class AppStore extends DurableObject {
  #ready = false;

  get #sql() { return this.ctx.storage.sql; }

  #hasMeta() {
    return this.#sql.exec("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?", META_TABLE).toArray().length > 0;
  }

  /** 首次开门:写下自己是谁,通知内核去挂 apps/<id>/data.db 链接。 */
  async #ensure(appId) {
    if (this.#ready) return;
    if (!this.#hasMeta()) {
      this.#sql.exec(`CREATE TABLE IF NOT EXISTS ${META_TABLE} (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '')`);
      this.#sql.exec(`INSERT INTO ${META_TABLE} (key, value) VALUES ('app_id', ?), ('created_at', ?)`, appId, new Date().toISOString());
      await this.env.NODE.fetch("http://node/api/app/db-opened", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ appId, storeId: this.ctx.id.toString() }),
      }).catch(() => {}); // 挂不上链接只是少个快捷方式,不影响开库
    }
    this.#ready = true;
  }

  #assertQuota(sql) {
    if (isRead(sql)) return;
    if (this.#sql.databaseSize > MAX_DB_BYTES) {
      throw new Error(`应用数据库已超上限(${Math.round(MAX_DB_BYTES / 1024 / 1024)}MB),仅允许读取`);
    }
  }

  #runOne(sql, params) {
    const text = String(sql || "").trim();
    if (!text) throw new Error("sql 不能为空");
    if (FORBIDDEN.test(text)) throw new Error("不允许的语句:ATTACH / load_extension");
    this.#assertQuota(text);
    const values = (Array.isArray(params) ? params : []).map((v) => (v === undefined ? null : v));
    if (isRead(text)) return { rows: this.#sql.exec(text, ...values).toArray() };
    // 无参多语句(建表脚本)整体执行
    if (!values.length && /;\s*\S/.test(text)) { this.#sql.exec(text); return {}; }
    this.#sql.exec(text, ...values);
    const m = this.#sql.exec("SELECT changes() AS c, last_insert_rowid() AS id").one();
    return { changes: Number(m.c), lastInsertRowid: Number(m.id) };
  }

  /** D1 的单条:SELECT 回 rows,写入回 changes / lastInsertRowid。 */
  async exec(appId, sql, params) {
    await this.#ensure(appId);
    return this.#runOne(sql, params);
  }

  /** D1 的 batch:一个事务里跑完,任一失败整体回滚。 */
  async batch(appId, statements) {
    await this.#ensure(appId);
    const list = (Array.isArray(statements) ? statements : []).slice(0, 200);
    const results = this.ctx.storage.transactionSync(() => list.map((s) => this.#runOne(String(s?.sql || ""), s?.params || [])));
    return { results };
  }
}

/** 应用 → 它的 AppStore 存根。appId 由调用方(HostGate / 内部路由)填,应用伪造不了。 */
const storeFor = (env, appId) => {
  const id = String(appId || "");
  if (!id) throw new Error("缺少 appId");
  const stub = env.STORE.get(env.STORE.idFromName(id));
  return {
    exec: (sql, params) => stub.exec(id, sql, params),
    batch: (statements) => stub.batch(id, statements),
    storeId: () => env.STORE.idFromName(id).toString(),
  };
};

/** 应用对外的唯一通道:动作全部回内核执行(DB 除外,它进 AppStore)。appId 由这里填,应用伪造不了。 */
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

  // ── env.DB:不回内核,直接进 AppStore(每个应用一个 DO,SQLite 就在 workerd 进程里) ──
  dbExec(sql, params) { return storeFor(this.env, this.ctx.props?.appId).exec(String(sql || ""), Array.isArray(params) ? params : []); }
  dbBatch(statements) { return storeFor(this.env, this.ctx.props?.appId).batch(Array.isArray(statements) ? statements : []); }

  // ── env.ASSETS ──
  async asset(path) {
    const data = await this.#node("asset", { path: String(path || "") }).catch(() => null);
    return data && data.b64 !== undefined ? { b64: data.b64 } : null;
  }

  // ── env.AI ──
  aiAsk(req) { return this.#node("ai-ask", { summary: req.summary, prompt: req.prompt, system: req.system, data: req.data }); }
  aiRun(req) { return this.#node("ai-run", { summary: req.summary, prompt: req.prompt, system: req.system, data: req.data }); }
  /** 会话面透传。直接把 Response 交回去 —— workerd RPC 支持流式返回值,SSE 因此能一路到前端。 */
  aiFetch(path, method, body, contentType) {
    const init = { method, headers: {} };
    if (contentType) init.headers["content-type"] = contentType;
    if (body !== null && body !== undefined) init.body = body;
    return this.env.NODE.fetch("http://node/conv" + path, init);
  }
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
    // 能力全开:应用可以直接 fetch() 出网(见 CONTRACT.md「当前取舍」)
  }));
};

const resolveApp = async (env, token) => {
  const res = await env.NODE.fetch(`http://node/api/apps/resolve-token?token=${encodeURIComponent(token)}`);
  if (!res.ok) return null;
  const { appId } = await res.json();
  return appId || null;
};


// ── 内部路由:内核 → workerd ─────────────────────────────────
// syscall 的镜像:应用在 workerd 里调内核,这里是内核调 workerd 里的数据。
// AI(经内核的 /api/apps/db)和内核自己要写应用数据,走这条,不绕过 AppStore 直接碰文件。
// 只认带装机时生成的内部令牌的请求;令牌只在 overseer 的 env 里,应用拿不到。
const jsonResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

// 行里的 BLOB 是 ArrayBuffer,JSON 带不走,包成 { __wd_b64 }
const packRows = (rows) => (rows || []).map((row) => {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = v instanceof ArrayBuffer ? { __wd_b64: btoa(String.fromCharCode(...new Uint8Array(v))) } : v;
  }
  return out;
});

const internal = async (req, env, url) => {
  if (!env.WD_INTERNAL || req.headers.get("x-wd-internal") !== env.WD_INTERNAL) return jsonResponse({ ok: false, error: "forbidden" }, 403);
  try {
    if (url.pathname === "/_wd/db/id") {
      return jsonResponse({ ok: true, storeId: storeFor(env, url.searchParams.get("app")).storeId() });
    }
    if (url.pathname === "/_wd/db" && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const store = storeFor(env, body.appId);
      if (Array.isArray(body.statements)) {
        const { results } = await store.batch(body.statements);
        return jsonResponse({ ok: true, results: results.map((r) => ({ ...r, rows: r.rows ? packRows(r.rows) : undefined })) });
      }
      const r = await store.exec(String(body.sql || ""), Array.isArray(body.params) ? body.params : []);
      return jsonResponse({ ok: true, ...r, rows: r.rows ? packRows(r.rows) : undefined });
    }
    return jsonResponse({ ok: false, error: "not found" }, 404);
  } catch (e) {
    return jsonResponse({ ok: false, error: String(e?.message || e) }, 200);
  }
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
      // 没有子域 = 不是冲着某个应用来的。健康检查与内核的内部调用走这条。
      if (url.pathname === "/health") return new Response("ok");
      if (url.pathname.startsWith("/_wd/")) return internal(req, env, url);
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
