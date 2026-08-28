// reader —— 由 appsrc/build.mjs 生成,改这里会被下次构建覆盖。
// 前端源码在 appsrc/apps/reader/,改完跑 `npm run build:apps`。
//
// 应用即网站:静态资源与 API 都由它自己应答。三个 API 是从 wandesk-skill 平移过来的
// 宿主能力,现在接在自己的 binding 上 —— 应用前端一行没改。
const SCHEMA = "-- 阅读 —— 每本 book 是一部可续写、可重开的交互小说\n-- 续写靠引擎原生多轮:conversation_id 存活会话;失效时用 pages 兜底重建。\n\nCREATE TABLE IF NOT EXISTS app_reader_books (\n  id              INTEGER PRIMARY KEY AUTOINCREMENT,\n  title           TEXT NOT NULL DEFAULT '无题',     -- AI 起的书名\n  premise         TEXT NOT NULL DEFAULT '',          -- 用户给的设定(类型 + 开场)\n  conversation_id TEXT,                              -- 引擎会话 id,用于原生续写\n  status          TEXT NOT NULL DEFAULT 'ongoing',   -- 'ongoing' | 'ended'\n  created_at      TEXT NOT NULL DEFAULT (datetime('now')),\n  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))\n);\n\n-- 每一页:一段叙事 + 玩家在这一页做出的选择(末页 chosen 为空)\n-- 末页还把\"这一页给出的待选项\"存进 choices(JSON),这样重开时停在抉择点能直接接着选。\nCREATE TABLE IF NOT EXISTS app_reader_pages (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,\n  book_id    INTEGER NOT NULL,\n  idx        INTEGER NOT NULL,                       -- 页序号,从 0 开始\n  narrative  TEXT NOT NULL DEFAULT '',               -- 这一页的正文\n  chosen     TEXT NOT NULL DEFAULT '',               -- 玩家从这一页走出的行动\n  choices    TEXT NOT NULL DEFAULT '[]',             -- 这一页给出的待选项(JSON 数组),用于恢复抉择点\n  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n);\n\nCREATE INDEX IF NOT EXISTS app_reader_idx_pages_book ON app_reader_pages (book_id, idx);\n";

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
          summary: `reader:` + String(prompt || "").slice(0, 24),
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
