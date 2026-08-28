# 手机 · Phone

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
  - `schema.sql` — one table (`screens`) provisioned into `database/apps/phone.db`
  - `APP.md` — this file
- `ui/src/apps/phone/index.tsx` + `style.css` — the whole app: the cream candybar / green-LCD
  shell plus the generate-loop. The LCD renders the AI's HTML via `dangerouslySetInnerHTML`
  (sanitized; the prompt forbids `<script>` and external resources).

## Backend used (only the shared capabilities)

```ts
import { db }    from '../../system/lib/db';
import { agent } from '../../system/lib/agent';
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

## To change this app

Edit `ui/src/apps/phone/index.tsx`, then `POST /api/reload` so the platform re-scans.
