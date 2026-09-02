# Aircraft (aircraft)

Neon arcade shooter with waves, bosses, power-ups and particle mayhem.

## Layout and how to modify

- `app.json` manifest · `APP.md` this file · `server.js` backend (Worker, table-creation script lives inside) · `public/` frontend build output · `src/` frontend source (React)
- **Editing the frontend**: edit `src/`, then run `npm install && npm run build` in this directory; the output lands back in `public/`, and refreshing the window picks it up. Requires Node.js installed locally; skip it if you're not changing the frontend.
- **Editing the backend**: edit `server.js` directly; the change takes effect on the next request, no restart needed.
- **Data**: `data.db` is this app's SQLite database — query it directly with `sqlite3 data.db`; the table schema is in the SCHEMA constant at the top of `server.js`.
