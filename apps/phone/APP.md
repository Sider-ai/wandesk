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
  - `server.js` 顶部的 SCHEMA — one table (`screens`) provisioned into `data.db`
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

## 目录与修改

- `app.json` 清单 · `APP.md` 本文件 · `server.js` 后端(Worker,建表脚本在里面)· `public/` 前端产物 · `src/` 前端源码(React)
- **改前端**:改 `src/`,然后在本目录 `npm install && npm run build`,产物落回 `public/`,窗口刷新即生效。需要本机装有 Node.js;不改就不需要。
- **改后端**:直接改 `server.js`,下一次请求即生效,不用重启。
- **数据**:`data.db` 是本应用的 SQLite,`sqlite3 data.db` 可直接查;表结构见 `server.js` 顶部的 SCHEMA。
