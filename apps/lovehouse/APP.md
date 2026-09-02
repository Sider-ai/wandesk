# Love House (lovehouse)

A virtual dating companion app. A reference unit for **stateful conversation with real
long-term memory**, built entirely on the generic `db` + `agent` capabilities — no
per-app backend, no platform changes.

## Data (`database/wandesk.db`, tables always prefixed `app_lovehouse_*`)

- `app_lovehouse_messages(role, content, created_at)` — the full conversation, the single
  source of truth: rendering bubbles and rebuilding context each turn both come from here,
  nothing is lost on restart.
- `app_lovehouse_memories(content, created_at)` — curated long-term memories (high-signal,
  deduplicated, capped).
- `app_lovehouse_state(key, value)` — internal state such as affection level.
- `app_lovehouse_moments(...)` — the moments (posts) she shares, with likes/comments.

## How a turn happens (src/)

1. Write the user's message into `app_lovehouse_messages` (via `db`).
2. Read recent messages + all memories (via `db`), and assemble the prompt:
   `[What you remember]… [Recent conversation]… [They just said]…`.
3. Call `agent(appId, prompt, { system: PERSONA })` — the persona belongs to the app and is
   passed as `system`; no resume is used, the backend `app_lovehouse_messages` table is
   always the single source of truth.
4. Parse `<mem>…</mem>` from the reply → dedupe against existing memories → store (capped
   at 30).
5. Write the reply back into `app_lovehouse_messages`.

## Notes

- The persona (PERSONA) lives on the frontend, passed in as `system`. If you want to
  bundle it privately, it can be moved to a server-side file later.
- To clear chat + memories: just drop the `app_lovehouse_*` tables.

## Layout and editing

- `app.json` manifest · `APP.md` this file · `server.js` backend (Worker, table-creation
  script lives inside it) · `public/` built frontend output · `src/` frontend source (React)
- **Editing the frontend**: edit `src/`, then in this directory run `npm install && npm run
  build`; the output lands back in `public/`, and the window updates on refresh. Requires
  Node.js locally; not needed if you're not editing it.
- **Editing the backend**: edit `server.js` directly, effective on the next request, no
  restart needed.
- **Data**: `data.db` is this app's SQLite database; `sqlite3 data.db` can query it
  directly — schema is in the SCHEMA constant at the top of `server.js`.
