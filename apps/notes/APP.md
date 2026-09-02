# Notebook (notes)

A skeuomorphic leather notebook. Stitched spine, ruled/grid paper, ribbon bookmark, embossed cover, with a fountain pen tucked in at an angle.
The left side is the "Index," which lets you jump to any page; the right side is the open sheet — write on it and it saves automatically.
An optional ✦ AI button lets Claude help you **continue / summarize / polish** the current page.

This is the same app (id is still `notes`), just with a skeuomorphic look.

## Data

Private database `data.db`. The main table is `pages`, where each row is one page in the notebook:

```sql
pages(
  id INTEGER PK,
  title TEXT,          -- page title
  body  TEXT,          -- body text
  paper INTEGER,       -- paper style index (ruled/grid/dot/kraft...)
  pinned INTEGER,      -- 1 = pinned to top with the ribbon bookmark
  created_at TEXT,
  updated_at TEXT
)
```

The frontend reads and writes through the shared `db` capability; there is no per-app backend:

```ts
import { db } from './wandesk/db';

await db('notes', 'SELECT id, title, body, paper, pinned, updated_at FROM pages ORDER BY pinned DESC, updated_at DESC');
await db('notes', 'INSERT INTO pages (title, body, paper) VALUES (?, ?, ?)', [title, body, paper]);
await db('notes', 'UPDATE pages SET title=?, body=?, updated_at=datetime(\'now\') WHERE id=?', [title, body, id]);
await db('notes', 'DELETE FROM pages WHERE id = ?', [id]);
```

`db(appId, sql, params)` POSTs to `/api/db`. The app id is passed in from the entry point main.tsx and is never hardcoded in queries.

## AI (optional)

Calls the kernel's agent through the shared `agent` capability (using the model configured in settings):

```ts
import { agent } from './wandesk/agent';

const r = await agent('notes', prompt, { data: currentPageBody, system: 'You are a writing assistant…' });
// r.ok / r.result
```

The ✦ button in the UI supports three actions: **continue**, **summarize**, and **polish**. The result goes into a preview drawer first,
and is written back to the current page only after confirmation. A Claude turn takes about 3–10 seconds.

## Directory & making changes

- `app.json` manifest · `APP.md` this file · `server.js` backend (a Worker, table creation script is in there) · `public/` frontend build output · `src/` frontend source (React)
- **Frontend changes**: edit `src/`, then run `npm install && npm run build` in this directory; the output lands back in `public/`, and refreshing the window picks it up. Requires Node.js locally; not needed if you're not making changes.
- **Backend changes**: edit `server.js` directly, effective on the next request, no restart needed.
- **Data**: `data.db` is this app's SQLite database, queryable directly with `sqlite3 data.db`; the schema is at the top of `server.js` under SCHEMA.
