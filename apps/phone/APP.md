# Phone

A 2010-era 3G feature phone (Symbian S60 / MTK generation): glossy graphite candybar with a
color TFT screen. The shell is fixed but every **screen is improvised by the AI as live HTML**
— inbox lists, QQ chats with bubbles, a WAP2.0 browser (3g.qq.com …), a music player, Java
games. You see a screen plus three options; pick one (or type your own), and the AI dreams up
what comes next. It never runs out.

Continuity is native: the whole phone is ONE persistent agent conversation — the
`conversationId` lives in the app's db (`state` table) and is restored on boot, so the same
phone, the same owner, the same unfolding life carry across windows and restarts — without
re-stuffing history into each prompt. If the stored conversation has gone stale (engine
switched / cleaned up), the app falls back to a fresh conversation seeded with the current
screen and persists the new id.

## Anatomy

Two folders linked by the shared id (`phone`):

- `apps/phone/` — definition only, no backend code
  - `app.json` — manifest
  - `server.js` — the SCHEMA at the top provisions one table (`screens`) into `data.db`
  - `APP.md` — this file
- src/ + `style.css` — the whole app: the cream candybar / green-LCD
  shell plus the generate-loop. The LCD renders the AI's HTML via `dangerouslySetInnerHTML`
  (sanitized; the prompt forbids `<script>` and external resources).

## Backend used (only the shared capabilities)

```ts
import { db }    from './wandesk/db';
import { agent } from './wandesk/agent';
```

- `agent(appId, prompt, { system, schema })` → `{ content, options }`: `content` is the
  inline-styled HTML for the next screen, `options` is exactly three follow-up choices. The
  first call seeds the persona and returns a `conversationId`; later calls pass that id to
  continue the SAME phone natively. After a resume (fresh process) the next choice cold-starts
  with the on-screen content as context.
- `db(appId, …)` appends each screen to `screens`, so reopening puts the last screen back on
  the LCD. The power button (`⏻`) wipes the table → a brand-new phone and owner.

## Data

```sql
screens(id INTEGER PK, content TEXT, options TEXT, created_at TEXT)
```

## Layout and editing

- `app.json` manifest · `APP.md` this file · `server.js` backend (Worker, the table-creation
  script lives here) · `public/` built frontend output · `src/` frontend source (React)
- **Editing the frontend**: edit `src/`, then run `npm install && npm run build` in this
  directory; the output lands back in `public/`, and a window refresh picks it up. Requires
  Node.js locally; skip it if you're not changing the frontend.
- **Editing the backend**: edit `server.js` directly — it takes effect on the next request, no
  restart needed.
- **Data**: `data.db` is this app's SQLite database; inspect it directly with `sqlite3 data.db`.
  The table schema is in the SCHEMA constant at the top of `server.js`.
