// Generated once from a template; now plain source — edit freely.
// next build.
// Frontend source lives in src/; after editing, run `npm install && npm run build` in this directory.
//
// The app is its own website: it answers both static assets and API requests itself. The
// three APIs are host capabilities ported over from wandesk-skill, now wired to this app's
// own bindings — the app frontend was left untouched.
const SCHEMA = "-- Conversation history (the single source of truth: rendering bubbles and rebuilding context each turn both come from here)\nCREATE TABLE IF NOT EXISTS app_lovehouse_messages (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,\n  role       TEXT NOT NULL,            -- 'user' | 'bot'\n  content    TEXT NOT NULL DEFAULT '',\n  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n);\n\n-- Long-term memory (high-signal, deduplicated, capped; fed back to her every turn)\nCREATE TABLE IF NOT EXISTS app_lovehouse_memories (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,\n  content    TEXT NOT NULL,\n  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n);\n\n-- Relationship state (key-value: affection level, current mood). Updated and fed back to her every turn.\nCREATE TABLE IF NOT EXISTS app_lovehouse_state (\n  key   TEXT PRIMARY KEY,\n  value TEXT NOT NULL DEFAULT ''\n);\n\n-- Her moments (the right-hand feed panel): 'posts' the AI shares as Su Wan, likeable and commentable.\n-- comments is a JSON array [{who:'me'|'Su Wan', text}]; likes is the base like count, liked records whether you've liked it.\nCREATE TABLE IF NOT EXISTS app_lovehouse_moments (\n  id         INTEGER PRIMARY KEY AUTOINCREMENT,\n  emoji      TEXT NOT NULL DEFAULT '',\n  content    TEXT NOT NULL,\n  likes      INTEGER NOT NULL DEFAULT 1,\n  liked      INTEGER NOT NULL DEFAULT 0,\n  comments   TEXT NOT NULL DEFAULT '[]',\n  created_at TEXT NOT NULL DEFAULT (datetime('now'))\n);\n";

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

      // ── the single AI surface ──
      if (url.pathname === "/api/agent") {
        const { prompt, data, system, schema } = await req.json();
        const want = schema
          ? "\n\nOutput only JSON matching the JSON Schema below, no code fences, no explanation:\n" + JSON.stringify(schema)
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
          try { parsed = JSON.parse(String(out.text).trim().replace(/^\`\`\`[a-z]*\n?|\`\`\`$/g, "")); } catch { /* model didn't return valid JSON */ }
        }
        return json({ ok: true, result: out.text, json: parsed, engine: "wandesk" });
      }

      // ── outbound: unrestricted, backend fetches directly ──
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
