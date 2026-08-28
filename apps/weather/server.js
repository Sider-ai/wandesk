// weather —— 由 appsrc/build.mjs 生成,改这里会被下次构建覆盖。
// 前端源码在 appsrc/apps/weather/,改完跑 `npm run build:apps`。
//
// 应用即网站:静态资源与 API 都由它自己应答。三个 API 是从 wandesk-skill 平移过来的
// 宿主能力,现在接在自己的 binding 上 —— 应用前端一行没改。
const SCHEMA = "-- 天气 · 数据模型\n-- 没有每个应用单独的后端：前端用共享的 db 能力读写这张表，\n-- 用 IF NOT EXISTS 幂等地落进 database/apps/weather.db。\n--\n-- 用户收藏的城市清单。每行一个城市（来自 Open-Meteo geocoding）。\n-- is_default = 1 标记打开时默认展示的城市（最多一行）。\n-- sort 决定切换器里的排列顺序；越小越靠前。\nCREATE TABLE IF NOT EXISTS app_weather_cities (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,\n  name       TEXT NOT NULL DEFAULT '',          -- 展示名（含省/国，便于区分同名城市）\n  lat        REAL NOT NULL,                      -- 纬度\n  lon        REAL NOT NULL,                      -- 经度\n  is_default INTEGER NOT NULL DEFAULT 0,         -- 1 = 默认城市（最多一个）\n  sort       INTEGER NOT NULL DEFAULT 0,         -- 列表排序，越小越靠前\n  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n);\n\nCREATE INDEX IF NOT EXISTS app_weather_idx_cities_sort ON app_weather_cities (sort ASC, id ASC);\n";

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
          summary: `weather:` + String(prompt || "").slice(0, 24),
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
