# Hacker News (hackernews)

HN headline reader. Fetches one page at a time via the Algolia HN API, switching between
Top (front_page), New (sorted by date), and Ask HN. Network-only, no database.

## Data

No local tables. `proxy(appId, url)` fetches `https://hn.algolia.com/api/v1/search…` and parses the `hits` field of the response body JSON.

## UI

Top segmented control (Top/New/Ask) + list: rank, title, score, author, comment count, source domain.
Clicking the title does `window.open` to the original article; clicking comments does `window.open` to
`news.ycombinator.com/item?id=…`.

## Layout & editing

- `app.json` manifest · `APP.md` this file · `server.js` backend (Worker, table-creation script is inside) · `public/` frontend build output · `src/` frontend source (React)
- **Frontend changes**: edit `src/`, then run `npm install && npm run build` in this directory; the build output lands back in `public/`, and refreshing the window picks it up. Requires Node.js locally; skip this if you're not changing the frontend.
- **Backend changes**: edit `server.js` directly; it takes effect on the next request, no restart needed.
- **Data**: `data.db` is this app's SQLite database — query it directly with `sqlite3 data.db`; see the SCHEMA at the top of `server.js` for the table structure.
