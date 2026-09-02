# I Ching (fortune)

I Ching six-line divination + AI interpretation. One-shot: write down your question →
toss three coins six times to cast a hexagram → the diviner reads its fortune.
Uses only the generic `agent` capability — no per-app backend, and `db` is no longer used.

## Data — no history, just a cache of the last cast

- **No history, no database.** A question is a one-off; only the "last cast" is cached
  in the browser at `localStorage["wandesk.fortune.last"]`
  (`{question,hexName,yaos,changing,pair,reading}`), so reopening the app still shows
  the previous cast. Clicking "Cast Again" clears that cache and returns to the question screen.
- The old `readings` table (see the SCHEMA in `server.js`) is deprecated and no longer
  written to (kept around, but harmless).

## How a divination works (src/)

1. **Casting the hexagram (pure frontend)**: uses a deterministic pseudo-random toss of
   three coins, six times, each toss producing one line (yin/yang); the six lines are
   stacked bottom-up, and the resulting combination is looked up in an 8×8 hexagram table
   to find one of the 64 hexagrams by name. The casting animation shows the coins spinning.
2. **Reading the hexagram (AI)**: assembles a prompt from "the question + the hexagram
   drawn + the yin/yang of its six lines," and calls `agent(appId, prompt, { system: <diviner persona> })`
   — the persona has Claude play the role of a learned, classically eloquent fortune-teller,
   required to return only JSON `{signName,signPoem,good,bad,advice}`.
   The frontend parses the JSON (tolerantly: extracting `{...}` from the text) and renders
   it onto the hexagram's fortune-slip card.
3. **Caching (last cast only)**: once the reading succeeds, that cast is written to
   `localStorage` — never persisted to a database, and no history is built.

## Layout (src/)

Single column, centered, scrollable: before casting, a **centered input box** (question +
cast button); after casting, in order, the **hexagram section** (the six-line figure) and
the **reading section** (oracle verse / do's-and-don'ts / interpretation), with a
"**Cast Again**" button at the very bottom.

## Notes

- The randomness of the hexagram and coins lives on the frontend; the AI only interprets
  the hexagram drawn — it never changes it.
- For entertainment only — do what you can, and leave the rest to fate.

## Layout & making changes

- `app.json` manifest · `APP.md` this file · `server.js` backend (a Worker; the
  table-creation script lives inside it) · `public/` frontend build output · `src/` frontend
  source (React)
- **Changing the frontend**: edit `src/`, then in this directory run
  `npm install && npm run build`; the output lands back in `public/`, and refreshing the
  window picks it up. Requires Node.js locally; skip it if you're not changing the frontend.
- **Changing the backend**: edit `server.js` directly — it takes effect on the next
  request, no restart needed.
- **Data**: `data.db` is this app's SQLite database; `sqlite3 data.db` can query it
  directly. See the SCHEMA at the top of `server.js` for the table structure.
