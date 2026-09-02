# 炸金花 (Zhajinhua)

Three-card Chinese poker, **heads-up (1v1)** vs. a real AI rival, on a green felt
table. Left half is the table; right half is a live message feed of the rival's
thinking, table-talk, and actions.

## Anatomy

A Wandesk app is **two folders linked by a shared id** (`poker`):

- `apps/poker/` — definition (no backend code):
  - `app.json` — manifest (id, name, icon, version, description)
  - `server.js` 顶部的 SCHEMA — its tables, provisioned once into `data.db`
  - `APP.md` — this file
- src/ — the React frontend, mounted by the desktop shell

## Game

Standard 炸金花. Each player is dealt 3 cards. Hand ranking, high → low:

1. **豹子** — three of a kind
2. **同花顺** — straight flush
3. **同花** — flush
4. **顺子** — straight (A-2-3 is the lowest straight; Q-K-A is the highest)
5. **对子** — one pair
6. **单张** — high card

Cards stay **face-down (闷牌)** until you **看牌 (peek)**. Actions: 看牌 / 跟注 (call) /
加注 (raise) / 弃牌 (fold) / 比牌 (showdown — compare with the rival). A peeked
player ("明牌") pays double the table stake. Last player standing, or the best hand at
showdown, takes the pot.

Deck, deal, hand-evaluation, 比牌 compare and chip math are plain TypeScript in
`index.tsx`. **The AI rival's decision each turn is a real `agent()` request**: the
model is handed the situation (its hand/blind status, the pot, the call line, the
player's last action) plus a JSON schema, and returns `{ action, amount?, say }`. We
apply that to the game and stream the `say` (and a live "thinking…" state) into the
right-hand feed. A safe local heuristic is used as a fallback if `agent()` fails or
times out, so the game never hangs.

## Data

The app has one private database, `data.db`:

```sql
wallet(id INTEGER PK CHECK(id=1), chips INTEGER)   -- the player's bankroll, starts at 1000
stats(id INTEGER PK, result TEXT, delta INTEGER, created_at TEXT)
```

Read/written through the shared `db` capability — no per-app backend:

```ts
import { db } from './wandesk/db';

await db('poker', 'SELECT chips FROM wallet WHERE id = 1');
await db('poker', 'UPDATE wallet SET chips = ? WHERE id = 1', [chips]);
await db('poker', 'UPDATE wallet SET chips = 1000 WHERE id = 1');   -- reset button
```

The AI rival's move each turn uses the `agent` capability with a JSON schema, and the
returned decision drives the game (with a safe local fallback):

```ts
import { agent } from './wandesk/agent';

const r = await agent('poker', prompt, { system, schema: DECISION_SCHEMA });
// → { action: 'call'|'raise'|'fold'|'compare', amount?, say } parsed from r.json / r.result
```

## 目录与修改

- `app.json` 清单 · `APP.md` 本文件 · `server.js` 后端(Worker,建表脚本在里面)· `public/` 前端产物 · `src/` 前端源码(React)
- **改前端**:改 `src/`,然后在本目录 `npm install && npm run build`,产物落回 `public/`,窗口刷新即生效。需要本机装有 Node.js;不改就不需要。
- **改后端**:直接改 `server.js`,下一次请求即生效,不用重启。
- **数据**:`data.db` 是本应用的 SQLite,`sqlite3 data.db` 可直接查;表结构见 `server.js` 顶部的 SCHEMA。
