# Dusk Racer

A native Wandesk Three.js arcade racing game. React handles the HUD, menus, and window
lifecycle; the TypeScript game engine handles rendering, physics, AI, audio, and the frame loop.

## Controls

- `W` / `↑`: throttle
- `S` / `↓`: brake, reverse
- `A` / `D`: steer
- `Space`: handbrake drift
- `Shift`: nitro
- `Esc`: pause
- `R`: restart

## Layout & making changes

- `app.json` manifest · `APP.md` this file · `server.js` backend (Worker, table-creation script is in there) · `public/` frontend build output · `src/` frontend source (React)
- **Frontend changes**: edit `src/`, then run `npm install && npm run build` in this directory; the build lands back in `public/`, and refreshing the window picks it up. Requires Node.js installed locally; not needed if you're not changing the frontend.
- **Backend changes**: edit `server.js` directly; it takes effect on the next request, no restart needed.
- **Data**: `data.db` is this app's SQLite database, queryable directly with `sqlite3 data.db`; see the SCHEMA at the top of `server.js` for the table structure.
