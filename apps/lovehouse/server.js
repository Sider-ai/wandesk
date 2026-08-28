// lovehouse —— 由 appsrc/build.mjs 生成,改这里会被下次构建覆盖。
// 前端源码在 appsrc/apps/lovehouse/,改完跑 `npm run build:apps`。
//
// 应用即网站:静态资源与 API 都由它自己应答。三个 API 是从 wandesk-skill 平移过来的
// 宿主能力,现在接在自己的 binding 上 —— 应用前端一行没改。
const SCHEMA = "-- 对话历史(唯一真相,渲染气泡 + 每轮重建上下文都从这里来)\nCREATE TABLE IF NOT EXISTS app_lovehouse_messages (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,\n  role       TEXT NOT NULL,            -- 'user' | 'bot'\n  content    TEXT NOT NULL DEFAULT '',\n  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n);\n\n-- 长期记忆(高等级、去重、限量;每轮回注给她)\nCREATE TABLE IF NOT EXISTS app_lovehouse_memories (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,\n  content    TEXT NOT NULL,\n  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n);\n\n-- 关系状态(键值:好感度 affection、当前心情 mood)。每轮更新、回注给她。\nCREATE TABLE IF NOT EXISTS app_lovehouse_state (\n  key   TEXT PRIMARY KEY,\n  value TEXT NOT NULL DEFAULT ''\n);\n\n-- 她的动态(右侧空间栏):AI 以苏晚的身份发的\"空间说说\",可赞可评。\n-- comments 是 JSON 数组 [{who:'我'|'苏晚', text}];likes 为基础赞数,liked 记录你是否点过。\nCREATE TABLE IF NOT EXISTS app_lovehouse_moments (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,\n  emoji      TEXT NOT NULL DEFAULT '',\n  content    TEXT NOT NULL,\n  likes      INTEGER NOT NULL DEFAULT 1,\n  liked      INTEGER NOT NULL DEFAULT 0,\n  comments   TEXT NOT NULL DEFAULT '[]',\n  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n);\n";

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
          summary: `lovehouse:` + String(prompt || "").slice(0, 24),
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
