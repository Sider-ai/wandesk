// phone —— 由 appsrc/build.mjs 生成,改这里会被下次构建覆盖。
// 前端源码在 appsrc/apps/phone/,改完跑 `npm run build:apps`。
//
// 应用即网站:静态资源与 API 都由它自己应答。三个 API 是从 wandesk-skill 平移过来的
// 宿主能力,现在接在自己的 binding 上 —— 应用前端一行没改。
const SCHEMA = "-- 手机 · the AI-generated screen log. Every screen the AI improvises is appended here,\n-- so reopening the phone resumes the latest screen. \"重新开机\" wipes the table for a fresh\n-- phone (and a fresh owner/world). Continuity within a session is native to the agent\n-- conversation (conversationId), so we don't need to store history for the model — just\n-- enough to put the last screen back on the LCD.\nCREATE TABLE IF NOT EXISTS app_phone_screens (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,\n  content    TEXT NOT NULL,                       -- inline-styled HTML for the screen body\n  options    TEXT NOT NULL DEFAULT '[]',          -- JSON array of {text} follow-up choices\n  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n);\n\n-- 整部手机 = 一个持久对话:conversationId 存在这里,跨窗口/跨重启接着聊,\n-- 机主和他的生活不会因为关掉窗口而断片。\nCREATE TABLE IF NOT EXISTS app_phone_state (\n  key   TEXT PRIMARY KEY,\n  value TEXT NOT NULL\n);\n";

let ready = false;
const ensure = async (env) => {
  if (ready) return;
  if (SCHEMA) await env.DB.exec(SCHEMA);
  ready = true;
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(req);

    try {
      // ── 自己的库(D1) ──
      if (url.pathname === "/api/db") {
        await ensure(env);
        const { sql, params } = await req.json();
        const stmt = env.DB.prepare(String(sql || ""));
        const r = await (Array.isArray(params) && params.length ? stmt.bind(...params) : stmt).all();
        return json({ ok: true, rows: r.results, changes: r.meta?.changes ?? 0, lastInsertRowid: r.meta?.last_row_id ?? 0 });
      }

      // ── 唯一的智能面 ──
      if (url.pathname === "/api/agent") {
        const { prompt, data, system, schema } = await req.json();
        const want = schema
          ? "\n\n只输出符合下面 JSON Schema 的 JSON,不要代码围栏、不要解释:\n" + JSON.stringify(schema)
          : "";
        const out = await env.AI.ask({
          summary: `phone:` + String(prompt || "").slice(0, 24),
          system: String(system || ""),
          prompt: String(prompt || "") + want,
          data,
        });
        if (!out.ok) return json({ ok: false, error: out.error });
        let parsed;
        if (schema) {
          try { parsed = JSON.parse(String(out.text).trim().replace(/^\`\`\`[a-z]*\n?|\`\`\`$/g, "")); } catch { /* 模型没给出合法 JSON */ }
        }
        return json({ ok: true, result: out.text, json: parsed, engine: "wandesk" });
      }

      // ── 出网:能力全开,后端直接 fetch ──
      if (url.pathname === "/api/http") {
        const { url: target, method, headers, body } = await req.json();
        const res = await fetch(String(target), { method: method || "GET", headers, body });
        return json({ ok: res.ok, status: res.status, body: await res.text() });
      }

      return json({ ok: false, error: "not found" }, 404);
    } catch (e) {
      return json({ ok: false, error: String(e?.message || e) });
    }
  },
};
