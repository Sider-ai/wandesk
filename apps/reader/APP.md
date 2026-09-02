# 阅读 (reader)

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

## 目录与修改

- `app.json` 清单 · `APP.md` 本文件 · `server.js` 后端(Worker,建表脚本在里面)· `public/` 前端产物 · `src/` 前端源码(React)
- **改前端**:改 `src/`,然后在本目录 `npm install && npm run build`,产物落回 `public/`,窗口刷新即生效。需要本机装有 Node.js;不改就不需要。
- **改后端**:直接改 `server.js`,下一次请求即生效,不用重启。
- **数据**:`data.db` 是本应用的 SQLite,`sqlite3 data.db` 可直接查;表结构见 `server.js` 顶部的 SCHEMA。
