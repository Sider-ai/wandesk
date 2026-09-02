// Generated once from a template; now plain source — edit freely.
// Frontend source lives in src/; after editing, run `npm install && npm run build` in this directory.
//
// The app is its own site: it serves both static assets and the API. The three API
// routes are the host capabilities ported over from wandesk-skill, now wired to this
// app's own bindings — the app frontend didn't change a single line.
const SCHEMA = "-- Player's chip stack — single row, persisted across sessions. Start at 1000.\nCREATE TABLE IF NOT EXISTS app_poker_wallet (\n  id    INTEGER PRIMARY KEY CHECK (id = 1),\n  chips INTEGER NOT NULL DEFAULT 1000\n);\nINSERT OR IGNORE INTO app_poker_wallet (id, chips) VALUES (1, 1000);\n\n-- Lifetime tally — one row per finished hand, for the win/loss header.\nCREATE TABLE IF NOT EXISTS app_poker_stats (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,\n  result     TEXT NOT NULL,                       -- 'win' | 'lose'\n  delta      INTEGER NOT NULL DEFAULT 0,          -- chips won (+) or lost (-) this hand\n  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n);\n";

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
          ? "\n\nOutput only JSON matching the schema below — no code fences, no explanation:\n" + JSON.stringify(schema)
          : "";
        const out = await env.AI.ask({
          summary: `poker:` + String(prompt || "").slice(0, 24),
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

      // ── outbound: full access, the backend fetches directly ──
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
