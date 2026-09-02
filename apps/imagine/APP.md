# Imagine

A creative-branching canvas (inspired by Picker Local, lightly redone for Wandesk). One sentence produces
a **self-contained HTML** design draft; keep branching from any version into a tree, and click a node to
open it full-size in a **new window**. Frontend-only, no backend.

## Lightweight tradeoffs

- **Frontend-only**: uses `db(appId, sql)` to store the tree, `agent(appId, prompt)` to generate, and
  `window.open(blob)` to view a draft.
- **HTML only**: every artifact is a single, self-contained file — inline CSS/JS, no external links.
- **Context is passed as text** (no session/fork): when branching, the parent node's full HTML is stuffed
  into the prompt so the AI edits on top of it. Each generation is one independent `agent()` call, so
  nothing bleeds between calls and nothing touches a shared engine.
- Generation happens while the app window is open (the frontend `agent()` call is in flight); closing the
  window interrupts it and the node is left stuck at generating — acceptable for now.

## Data

`app_imagine_projects` (id/title/prompt) · `app_imagine_nodes` (id/project_id/parent_id/instruction/
title/html/status/error). `status`: generating | done | error. The tree query does not fetch html (loaded
lazily per node).

## Canvas (performance work ported from Picker)

Viewport clipping (only nodes within the viewport +700px are rendered) · edge clipping · preview gated by
zoom level (iframes don't render below k<0.3) · thumbnail iframes use `sandbox=""` so no scripts run ·
memoized node cards · subtree collapsing · CSS transform for pan/zoom · minimap.

## Layout and editing

- `app.json` manifest · `APP.md` this file · `server.js` backend (a Worker; the table-creation script
  lives inside it) · `public/` frontend build output · `src/` frontend source (React)
- **Editing the frontend**: edit `src/`, then in this directory run `npm install && npm run build`; the
  build output lands back in `public/` and takes effect on window refresh. Requires Node.js locally; skip
  this if you're not changing the frontend.
- **Editing the backend**: edit `server.js` directly — it takes effect on the next request, no restart
  needed.
- **Data**: `data.db` is this app's SQLite database; `sqlite3 data.db` can query it directly. See the
  SCHEMA at the top of `server.js` for the table structure.
