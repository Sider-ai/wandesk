// Generated once from a template; now plain source — edit freely.
// Frontend source lives in src/; after editing, run `npm install && npm run build` in this directory.
//
// The app is its own site: both static assets and the API are served by it. The three APIs are
// host capabilities carried over from wandesk-skill, now wired to their own bindings -- the app
// frontend was not changed at all.
const SCHEMA = "-- Ledger (finance) -- a single transactions table, one row per income/expense entry.\nCREATE TABLE IF NOT EXISTS app_finance_transactions (\n  id     INTEGER PRIMARY KEY AUTOINCREMENT,\n  type   TEXT NOT NULL CHECK (type IN ('income', 'expense')),\n  amount REAL NOT NULL,\n  note   TEXT NOT NULL DEFAULT '',\n  date   TEXT NOT NULL              -- 'YYYY-MM-DDT12:00:00', grouped by month via substr(date,1,7)\n);\nCREATE INDEX IF NOT EXISTS idx_app_finance_date ON app_finance_transactions (date);\n";

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
      // -- own database (D1) --
      if (url.pathname === "/api/db") {
        await ensure(env);
        const { sql, params } = await req.json();
        const stmt = env.DB.prepare(String(sql || ""));
        const r = await (Array.isArray(params) && params.length ? stmt.bind(...params) : stmt).all();
        return json({ ok: true, rows: r.results, changes: r.meta?.changes ?? 0, lastInsertRowid: r.meta?.last_row_id ?? 0 });
      }

      // -- the one AI surface --
      if (url.pathname === "/api/agent") {
        const { prompt, data, system, schema } = await req.json();
        const want = schema
          ? "\n\nOutput only JSON matching the JSON Schema below, no code fences, no explanation:\n" + JSON.stringify(schema)
          : "";
        const out = await env.AI.ask({
          summary: `finance:` + String(prompt || "").slice(0, 24),
          system: String(system || ""),
          prompt: String(prompt || "") + want,
          data,
        });
        if (!out.ok) return json({ ok: false, error: out.error });
        let parsed;
        if (schema) {
          try { parsed = JSON.parse(String(out.text).trim().replace(/^\`\`\`[a-z]*\n?|\`\`\`$/g, "")); } catch { /* model did not return valid JSON */ }
        }
        return json({ ok: true, result: out.text, json: parsed, engine: "wandesk" });
      }

      // -- outbound network: full capability, backend fetches directly --
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
