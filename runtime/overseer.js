// App runtime overseer —— runs inside workerd and does exactly four things:
//
//   1. **Routing**: <token>.localhost/* → that app's own fetch handler (the token is the routing key, see apps/token.ts);
//   2. **Loading**: on demand (starts on the first request), keyed by a version hash of server.js content (a change means a new version on the next request);
//   3. **Binding injection**: hand the app a Cloudflare-shaped env —— DB / ASSETS / AI / PROC / FS / UI;
//   4. **Data storage**: env.DB lives here in the AppStore (Durable Object + workerd's built-in SQLite), never back in the kernel.
//
// The app itself is just a standard Worker site; both static assets and the API are served by the app itself.
// The isomorphism with the CF platform isn't a metaphor: env.DB is literally the D1 interface, and this server.js
// can be deployed to the cloud as-is —— D1 on Cloudflare is itself just "DO + SQLite" wrapped in a layer, and this
// is exactly that underlying layer.
import { DurableObject, WorkerEntrypoint } from "cloudflare:workers";

// ── Runtime shims injected into every app isolate ─────────────────────────────
// The app sees a standard-shaped env; these stubs loop calls back to the kernel (Node).
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
  /** Multi-statement script (table creation etc). */
  async exec(sql) { const r = await this.host.dbExec(String(sql), []); return { count: 1, duration: 0, ...r }; }
  /** Batch: a single round trip, run inside one transaction. */
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

/** env.AI —— the one and only intelligence surface. stream() hands back a Response directly; the app can pass it straight through as its own response body. */
class AiBinding {
  constructor(host) { this.host = host; }
  ask(req)  { return this.host.aiAsk(req || {}); }
  run(req)  { return this.host.aiRun(req || {}); }
  /**
   * Conversation surface: forwards an entire HTTP request to the kernel's conversation API
   * (conversations / messages / persistent SSE / settings / attachments).
   * An app just needs to return env.AI.fetch(req) to get a complete conversational backend —— that's
   * how the "assistant" comes to exist. It has no special privileges; swap the UI and it still plugs in.
   * SSE rides this same path: the stream comes down within the same request.
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

// Entry shim: wraps env then hands off to the app's own default export.
const ENTRY_MODULE = `
import app from "app-server.js";
import { makeEnv } from "wd-runtime.js";

export default {
  async fetch(req, env, ctx) {
    if (typeof app?.fetch !== "function") {
      return new Response("The app's server.js must export default { async fetch(req, env) {…} }", {
        status: 500, headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    return app.fetch(req, makeEnv(env), ctx);
  },
};
`;


// ── AppStore: the execution side of env.DB ─────────────────────────────
// One Durable Object per app (idFromName(appId)), data lives in workerd's built-in SQLite,
// with the file at <workspace>/.wandesk/store/<uniqueKey>/<objectId>.sqlite. On first open it notifies
// the kernel, which drops a symlink at apps/<id>/data.db pointing to it — `sqlite3 apps/notes/data.db` still works.
const MAX_DB_BYTES = 200 * 1024 * 1024; // Per-database cap: a fuse against runaway growth
const FORBIDDEN = /\b(attach|load_extension)\b/i;   // "an app should only ever touch its own database" —— workerd already blocks this too, this is belt and suspenders
const isRead = (sql) => /^\s*(select|with|pragma|explain)\b/i.test(sql);
const META_TABLE = "_wd_meta"; // The database identifies itself: opening a .sqlite with sqlite3 tells you which app it belongs to

export class AppStore extends DurableObject {
  #ready = false;

  get #sql() { return this.ctx.storage.sql; }

  #hasMeta() {
    return this.#sql.exec("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?", META_TABLE).toArray().length > 0;
  }

  /** First open: record who we are, and notify the kernel to mount the apps/<id>/data.db link. */
  async #ensure(appId) {
    if (this.#ready) return;
    if (!this.#hasMeta()) {
      this.#sql.exec(`CREATE TABLE IF NOT EXISTS ${META_TABLE} (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '')`);
      this.#sql.exec(`INSERT INTO ${META_TABLE} (key, value) VALUES ('app_id', ?), ('created_at', ?)`, appId, new Date().toISOString());
      await this.env.NODE.fetch("http://node/api/app/db-opened", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ appId, storeId: this.ctx.id.toString() }),
      }).catch(() => {}); // Failing to mount the link just means one fewer shortcut; it doesn't block opening the database
    }
    this.#ready = true;
  }

  #assertQuota(sql) {
    if (isRead(sql)) return;
    if (this.#sql.databaseSize > MAX_DB_BYTES) {
      throw new Error(`App database has exceeded its limit (${Math.round(MAX_DB_BYTES / 1024 / 1024)}MB); read-only from here`);
    }
  }

  #runOne(sql, params) {
    const text = String(sql || "").trim();
    if (!text) throw new Error("sql must not be empty");
    if (FORBIDDEN.test(text)) throw new Error("Disallowed statement: ATTACH / load_extension");
    this.#assertQuota(text);
    const values = (Array.isArray(params) ? params : []).map((v) => (v === undefined ? null : v));
    if (isRead(text)) return { rows: this.#sql.exec(text, ...values).toArray() };
    // Parameter-less multi-statement text (table-creation scripts) executes as a whole
    if (!values.length && /;\s*\S/.test(text)) { this.#sql.exec(text); return {}; }
    this.#sql.exec(text, ...values);
    const m = this.#sql.exec("SELECT changes() AS c, last_insert_rowid() AS id").one();
    return { changes: Number(m.c), lastInsertRowid: Number(m.id) };
  }

  /** D1's single-statement call: SELECT returns rows, writes return changes / lastInsertRowid. */
  async exec(appId, sql, params) {
    await this.#ensure(appId);
    return this.#runOne(sql, params);
  }

  /** D1's batch: runs inside one transaction, any failure rolls the whole thing back. */
  async batch(appId, statements) {
    await this.#ensure(appId);
    const list = (Array.isArray(statements) ? statements : []).slice(0, 200);
    const results = this.ctx.storage.transactionSync(() => list.map((s) => this.#runOne(String(s?.sql || ""), s?.params || [])));
    return { results };
  }
}

/** App → its AppStore stub. appId is filled in by the caller (HostGate / internal routing); the app cannot forge it. */
const storeFor = (env, appId) => {
  const id = String(appId || "");
  if (!id) throw new Error("appId is missing");
  const stub = env.STORE.get(env.STORE.idFromName(id));
  return {
    exec: (sql, params) => stub.exec(id, sql, params),
    batch: (statements) => stub.batch(id, statements),
    storeId: () => env.STORE.idFromName(id).toString(),
  };
};

/** The app's one and only outward channel: every action executes back in the kernel (except DB, which goes to AppStore). appId is filled in here; the app cannot forge it. */
export class HostGate extends WorkerEntrypoint {
  async #node(action, body) {
    const res = await this.env.NODE.fetch(`http://node/api/app/${action}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ appId: this.ctx.props?.appId, ...body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.ok === false) throw new Error(String(data?.error || `Kernel error ${res.status}`));
    return data;
  }

  // ── env.DB: doesn't go back to the kernel, goes straight to AppStore (one DO per app, SQLite lives right in the workerd process) ──
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
  /** Conversation-surface passthrough. Hands the Response straight back —— workerd RPC supports streaming return values, so SSE can ride this all the way to the frontend. */
  aiFetch(path, method, body, contentType) {
    const init = { method, headers: {} };
    if (contentType) init.headers["content-type"] = contentType;
    if (body !== null && body !== undefined) init.body = body;
    return this.env.NODE.fetch("http://node/conv" + path, init);
  }
  /** Returns a ReadableStream —— workerd RPC supports streaming return values, so SSE can ride this all the way through to the app frontend. */
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

  /** Server-side logs flow back into the kernel console —— AI debugging its own backend needs to be able to see them. */
  async log(...message) {
    await this.#node("log", {
      message: message.map((m) => { try { return typeof m === "string" ? m : JSON.stringify(m); } catch { return String(m); } }).join(" "),
    }).catch(() => {});
  }
}

const loadApp = async (env, ctx, appId) => {
  const res = await env.NODE.fetch(`http://node/api/app/server-code?id=${encodeURIComponent(appId)}`);
  if (!res.ok) throw new Error(`Failed to fetch app code: ${appId} (${res.status})`);
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
    // Full capabilities: an app can fetch() straight out to the network (see the "current tradeoffs" section of CONTRACT.md)
  }));
};

const resolveApp = async (env, token) => {
  const res = await env.NODE.fetch(`http://node/api/apps/resolve-token?token=${encodeURIComponent(token)}`);
  if (!res.ok) return null;
  const { appId } = await res.json();
  return appId || null;
};


// ── Internal routing: kernel → workerd ─────────────────────────────
// A mirror of the syscall path: apps call into the kernel from inside workerd; this is the kernel calling
// into data living in workerd. The AI (via the kernel's /api/apps/db) and the kernel itself, when they need
// to write app data, go through here rather than bypassing AppStore to touch files directly.
// Only requests carrying the internal token generated at install time are honored; the token lives only
// in the overseer's env — apps can never get hold of it.
const jsonResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

// A BLOB in a row is an ArrayBuffer, which JSON can't carry, so wrap it as { __wd_b64 }
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

// One origin per app: `http://<token>.localhost:<port>/`.
// Why not a `/app/<token>/` path prefix —— because then the app wouldn't be standing at the root of its
// own site: `/style.css` and the `fetch("/api/…")` the contract specifies would escape the app's root, and
// the contract wouldn't hold. `*.localhost` is resolved straight to 127.0.0.1 by the browser (Chromium /
// Firefox support this natively, and the desktop shell is Electron, so this stays solid in production).
export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const token = /^([a-f0-9]{16,64})\.localhost$/.exec(url.hostname)?.[1];

    if (!token) {
      // No subdomain = not aimed at any particular app. Health checks and the kernel's internal calls go through here.
      if (url.pathname === "/health") return new Response("ok");
      if (url.pathname.startsWith("/_wd/")) return internal(req, env, url);
      return new Response("Access apps via <token>.localhost", { status: 404 });
    }

    const appId = await resolveApp(env, token);
    if (!appId) return new Response("forbidden", { status: 403 });

    // The shell's SDK: apps pull it in with <script src="/_wd/sdk.js">
    if (url.pathname === "/_wd/sdk.js") {
      // The kernel assembles this on the fly based on the current language; it must not be cached here either,
      // or an app would keep getting the old SDK after a language switch.
      const sdk = await env.NODE.fetch("http://node/api/apps/sdk.js");
      return new Response(await sdk.text(), {
        headers: { "content-type": "text/javascript; charset=utf-8", "cache-control": "no-store" },
      });
    }

    try {
      const worker = await loadApp(env, ctx, appId);
      return await worker.getEntrypoint().fetch(req);
    } catch (e) {
      return new Response(`App failed to start: ${e?.message || e}`, {
        status: 500, headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
  },
};
