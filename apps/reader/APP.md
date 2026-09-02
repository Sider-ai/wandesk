# Reader (reader)

A small interactive-fiction engine, presented as an e-reader. The user picks a premise (genre +
setup), the AI plays game-master: it writes an opening page and offers 2–4 choices; the user
clicks a choice **or** types a custom action, and the AI continues. Built entirely on the generic
`db` + `agent` capabilities — no per-app backend.

## Data (`data.db`)

- `books(title, premise, conversation_id, status, …)` — one row per book. `conversation_id`
  is the engine session used to **continue the story natively** (Claude resume / Codex thread),
  so the whole tale is kept by the engine, not re-stuffed into the prompt each turn.
- `pages(book_id, idx, narrative, chosen, …)` — every beat: the prose of that page and the
  action the reader took to leave it. The last page's `chosen` is empty (it's the live frontier).

## How a turn works (src/)

1. **Open**: `agent(appId, openingPrompt, { system: GM, schema })` → the AI returns
   `{ title, narrative, choices }`. Persist a `books` row (with the returned `conversationId`)
   and page `idx 0`.
2. **Continue**: on a choice/custom action, write that action onto the current page's `chosen`,
   then call `agent(appId, actionPrompt, { conversationId, schema })` — passing the saved
   `conversation_id` so the engine keeps the story natively. Persist the new page.
3. **Resume**: reopening a book loads its `pages` from db and reuses its `conversation_id`.
   If the engine session is gone (restart / engine switch), the turn is retried by **rebuilding**
   a fresh conversation from the saved pages (a recap is folded in as `system`), and the new
   `conversationId` is captured — the story continues seamlessly.

## Structured output (works on both engines)

Each turn asks for `{ title, narrative, choices: string[] }`. We pass a JSON `schema` (honored by
Codex via `outputSchema`) **and** parse the object out of `result` text ourselves (Claude returns
free text and does not populate `json`). So the app is engine-agnostic; Claude is the default.

## Notes

- Wipe everything by deleting `data.db`.
- `status='ended'` marks a finished book (the AI may return zero choices to end it).

## Layout and editing

- `app.json` manifest · `APP.md` this file · `server.js` backend (a Worker, with the table-creation script inline) · `public/` frontend build output · `src/` frontend source (React)
- **Editing the frontend**: edit `src/`, then in this directory run `npm install && npm run build`; the output lands back in `public/`, and a window refresh picks it up. Requires Node.js locally; not needed if you're not changing the frontend.
- **Editing the backend**: edit `server.js` directly — it takes effect on the next request, no restart needed.
- **Data**: `data.db` is this app's SQLite database; `sqlite3 data.db` can query it directly. See the SCHEMA at the top of `server.js` for the table structure.
