# App frontends — layout convention

Each app's UI lives in `ui/src/apps/<id>/`. `index.tsx` is the entry (default-export the component; the
desktop mounts it via a glob). Structure **grows with the app** — start small, split only when it helps.

This is a **recommended** convention, not a hard rule — it keeps apps tidy and consistent (including
agent-built ones); deviate when an app genuinely needs to.

## Three tiers

**① Simple** — one component file + its own stylesheet. Most apps. Even here, keep styles in
`style.css` rather than a big inline `<style>` block — it reads much cleaner.
```
ui/src/apps/<id>/
├─ index.tsx
└─ style.css
```

**② Moderate** — flat sibling files, no folders yet.
```
ui/src/apps/<id>/
├─ index.tsx      entry: assembles + holds state
├─ Account.tsx    sibling components, flat
├─ Ticket.tsx
└─ style.css
```

**③ Complex** — folders + a data layer.
```
ui/src/apps/<id>/
├─ index.tsx
├─ style.css
├─ db.ts          the app's SQL, collected (client-side data layer)
├─ components/    UI pieces, once there are several
├─ views/         distinct screens of a multi-screen app
└─ lib/           utils / types / constants
```

## Graduate when
- **①→②** : `index.tsx` passes ~250–300 lines, or a piece is clearly separable.
- **②→③** : ~5+ flat files, multiple screens, or you want a real data layer.

## Guidelines (recommended, not enforced)
- Entry is `index.tsx`, default export `function ({ appId }) { … }`.
- **Keep styles in `style.css`** (`import './style.css'` from `index.tsx`), even for the simplest app;
  prefix class names by the app id (e.g. `.fortune-…`) so they don't collide. Prefer this over inline `<style>`.
- **SQL**: inline `db(appId, …)` is fine when small; collect into `db.ts` when there are many queries.
  A `db.ts` function takes `appId` (passed from the component) — don't hardcode the id.
  ```ts
  // ui/src/apps/<id>/db.ts — client-side data layer (still no server repository)
  import { db } from '../../system/lib/db';
  export const listItems = (appId: string) => db(appId, 'SELECT * FROM items ORDER BY id DESC');
  export const addItem   = (appId: string, text: string) => db(appId, 'INSERT INTO items (text) VALUES (?)', [text]);
  ```
- Lean against routing/state-management libraries and folders you don't need yet — but it's your call.

Shared building blocks (data / AI / fetch) come from `ui/src/system/lib/`:
`db`, `agent`, `http` (proxy). See the root `SKILL.md` for the full picture.
