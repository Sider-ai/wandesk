// Generated once from a template; now plain source — edit freely.
// Frontend source lives in src/; after editing, run `npm install && npm run build` in this directory.
//
// The app is its own website: it answers both static assets and its API. The three API
// routes were moved over from the wandesk-skill host capabilities, now wired to this app's
// own bindings — the app frontend wasn't changed at all.
const SCHEMA = "-- Weather · data model\n-- No per-app backend: the frontend reads/writes this table through the shared\n-- db capability, landing idempotently in database/apps/weather.db via IF NOT EXISTS.\n--\n-- The user's saved cities. One row per city (from Open-Meteo geocoding).\n-- is_default = 1 marks the city shown by default on open (at most one row).\n-- sort controls the order in the switcher; smaller sorts first.\nCREATE TABLE IF NOT EXISTS app_weather_cities (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,\n  name       TEXT NOT NULL DEFAULT '',          -- display name (includes region/country to disambiguate same-name cities)\n  lat        REAL NOT NULL,                      -- latitude\n  lon        REAL NOT NULL,                      -- longitude\n  is_default INTEGER NOT NULL DEFAULT 0,         -- 1 = default city (at most one)\n  sort       INTEGER NOT NULL DEFAULT 0,         -- list order, smaller sorts first\n  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n);\n\nCREATE INDEX IF NOT EXISTS app_weather_idx_cities_sort ON app_weather_cities (sort ASC, id ASC);\n";

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
      // ── own database (D1) ──
      if (url.pathname === "/api/db") {
        await ensure(env);
        const { sql, params } = await req.json();
        const stmt = env.DB.prepare(String(sql || ""));
        const r = await (Array.isArray(params) && params.length ? stmt.bind(...params) : stmt).all();
        return json({ ok: true, rows: r.results, changes: r.meta?.changes ?? 0, lastInsertRowid: r.meta?.last_row_id ?? 0 });
      }

      // ── the one AI surface ──
      if (url.pathname === "/api/agent") {
        const { prompt, data, system, schema } = await req.json();
        const want = schema
          ? "\n\nOutput only JSON matching the JSON Schema below, no code fences, no explanation:\n" + JSON.stringify(schema)
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
          try { parsed = JSON.parse(String(out.text).trim().replace(/^\`\`\`[a-z]*\n?|\`\`\`$/g, "")); } catch { /* model didn't return valid JSON */ }
        }
        return json({ ok: true, result: out.text, json: parsed, engine: "wandesk" });
      }

      // ── outbound network: no restrictions, backend fetches directly ──
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
