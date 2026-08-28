// imagine —— 由 appsrc/build.mjs 生成,改这里会被下次构建覆盖。
// 前端源码在 appsrc/apps/imagine/,改完跑 `npm run build:apps`。
//
// 应用即网站:静态资源与 API 都由它自己应答。三个 API 是从 wandesk-skill 平移过来的
// 宿主能力,现在接在自己的 binding 上 —— 应用前端一行没改。
const SCHEMA = "-- 想象 (imagine) — 创意发散画布。项目 = 一棵树;节点 = 一版 HTML 设计稿。\nCREATE TABLE IF NOT EXISTS app_imagine_projects (\n  id         TEXT PRIMARY KEY,\n  title      TEXT NOT NULL DEFAULT '',\n  prompt     TEXT NOT NULL DEFAULT '',\n  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n);\nCREATE TABLE IF NOT EXISTS app_imagine_nodes (\n  id          TEXT PRIMARY KEY,\n  project_id  TEXT NOT NULL,\n  parent_id   TEXT,                         -- NULL = 根节点\n  instruction TEXT NOT NULL DEFAULT '',     -- 生成这一版用的指令/方向\n  title       TEXT,                         -- 产物首行 <!--TITLE--> 抓的短标题\n  html        TEXT NOT NULL DEFAULT '',     -- 产物(自包含 HTML);tree 查询不取,按节点懒加载\n  status      TEXT NOT NULL DEFAULT 'generating',  -- generating | done | error\n  error       TEXT NOT NULL DEFAULT '',\n  created_at  TEXT NOT NULL DEFAULT (datetime('now'))\n);\nCREATE INDEX IF NOT EXISTS idx_app_imagine_nodes_project ON app_imagine_nodes (project_id, created_at);\n";

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
          summary: `imagine:` + String(prompt || "").slice(0, 24),
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
