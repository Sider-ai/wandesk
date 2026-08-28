// 笔记本 —— 一个完整的 Cloudflare Worker 网站。
//
// 这份文件原样能部署到 Cloudflare:env.DB 是 D1 接口,env.ASSETS 是 Workers Assets。
// 只有 env.AI 是 Wandesk 专有的,上云时降级掉那一个按钮即可。
const SCHEMA = `
CREATE TABLE IF NOT EXISTS pages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL DEFAULT '',
  body       TEXT NOT NULL DEFAULT '',
  pinned     INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pages_order ON pages (pinned DESC, updated_at DESC);
`;

let ready = false;
const ensure = async (env) => { if (!ready) { await env.DB.exec(SCHEMA); ready = true; } };

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path.startsWith("/api/")) {
      await ensure(env);
      try {
        if (path === "/api/pages") {
          const { results } = await env.DB
            .prepare("SELECT id, title, body, pinned, updated_at FROM pages ORDER BY pinned DESC, updated_at DESC")
            .all();
          return json({ pages: results });
        }

        if (path === "/api/create" && req.method === "POST") {
          const r = await env.DB.prepare("INSERT INTO pages (title, body) VALUES ('', '')").run();
          return json({ id: r.meta.last_row_id });
        }

        if (path === "/api/save" && req.method === "POST") {
          const { id, title, body } = await req.json();
          await env.DB
            .prepare("UPDATE pages SET title = ?, body = ?, updated_at = datetime('now') WHERE id = ?")
            .bind(String(title ?? ""), String(body ?? ""), Number(id))
            .run();
          return json({ ok: true });
        }

        if (path === "/api/pin" && req.method === "POST") {
          const { id, pinned } = await req.json();
          await env.DB.prepare("UPDATE pages SET pinned = ? WHERE id = ?").bind(pinned ? 1 : 0, Number(id)).run();
          return json({ ok: true });
        }

        if (path === "/api/delete" && req.method === "POST") {
          const { id } = await req.json();
          await env.DB.prepare("DELETE FROM pages WHERE id = ?").bind(Number(id)).run();
          return json({ ok: true });
        }

        // env.AI —— 应用不需要知道系统里有什么,说一句话就行。
        // 内核会在这一刻注入用户的长期记忆,应用自己拿不到那些原文。
        if (path === "/api/assist" && req.method === "POST") {
          const { mode, text } = await req.json();
          const how = mode === "polish" ? "润色这段文字,保持原意与语气,只输出润色后的正文"
            : mode === "summary" ? "用三句话总结这段文字,只输出总结"
            : "接着这段文字往下写一段,只输出续写的部分";
          const out = await env.AI.ask({
            summary: `笔记本:${mode === "polish" ? "润色" : mode === "summary" ? "总结" : "续写"}当前这一页`,
            system: "你在帮用户写笔记。只输出正文,不要解释、不要前后缀。",
            prompt: `${how}。\n\n---\n${String(text || "").slice(0, 8000)}`,
          });
          return out.ok ? json({ text: out.text }) : json({ error: out.error }, 200);
        }

        return json({ error: "not found" }, 404);
      } catch (e) {
        return json({ error: String(e?.message || e) }, 500);
      }
    }

    return env.ASSETS.fetch(req);
  },
};
