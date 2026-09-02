# Three-Card Poker (Zhajinhua)

Three-card Chinese poker, **heads-up (1v1)** vs. a real AI rival, on a green felt
table. Left half is the table; right half is a live message feed of the rival's
thinking, table-talk, and actions.

## Anatomy

A Wandesk app is **two folders linked by a shared id** (`poker`):

- `apps/poker/` — definition (no backend code):
  - `app.json` — manifest (id, name, icon, version, description)
  - the SCHEMA at the top of `server.js` — its tables, provisioned once into `data.db`
  - `APP.md` — this file
- src/ — the React frontend, mounted by the desktop shell

## Game

Standard Zhajinhua. Each player is dealt 3 cards. Hand ranking, high → low:

1. **Three of a Kind**
2. **Straight Flush**
3. **Flush**
4. **Straight** (A-2-3 is the lowest straight; Q-K-A is the highest)
5. **Pair**
6. **High Card**

Cards stay **face-down (blind)** until you **peek**. Actions: peek / call /
raise / fold / compare (showdown — compare with the rival). A peeked
player ("open hand") pays double the table stake. Last player standing, or the best hand at
showdown, takes the pot.

Deck, deal, hand-evaluation, compare and chip math are plain TypeScript in
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

## Layout and editing

- `app.json` manifest · `APP.md` this file · `server.js` backend (Worker, table-creation script inside) · `public/` frontend build output · `src/` frontend source (React)
- **Editing the frontend**: edit `src/`, then in this directory run `npm install && npm run build`; the output lands back in `public/`, and the window refreshes to pick it up. Requires Node.js installed locally; not needed if you're not changing the frontend.
- **Editing the backend**: edit `server.js` directly — it takes effect on the next request, no restart needed.
- **Data**: `data.db` is this app's SQLite database; `sqlite3 data.db` queries it directly. Table structure is in the SCHEMA at the top of `server.js`.
