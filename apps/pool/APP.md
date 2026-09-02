# Pool (pool)

A 2D physics game of green-felt pool. Pure frontend canvas, no database, no AI.

## Gameplay

Once all balls have come to rest, drag out from the cue ball to aim — pull further for more
power — and release to shoot. Sinking a colored ball scores a point; sinking the cue ball is a
foul and it's automatically respotted. Clearing all the colored balls wins the game.

## Implementation

A single-file canvas + requestAnimationFrame loop. Physics: each ball has position/velocity;
every frame applies friction deceleration, cushion bounces, equal-mass ball-ball elastic
collisions, and capture at six pocket mouths. Layout is responsive to the container size.

## Layout & how to modify

- `app.json` manifest · `APP.md` this file · `server.js` backend (a Worker; the table-creation
  script lives inside it) · `public/` frontend build output · `src/` frontend source (React)
- **Editing the frontend**: edit `src/`, then run `npm install && npm run build` in this
  directory; the output lands back in `public/`, and refreshing the window picks it up.
  Requires Node.js locally; not needed if you're not changing the frontend.
- **Editing the backend**: edit `server.js` directly; it takes effect on the next request, no
  restart needed.
- **Data**: `data.db` is this app's SQLite database — `sqlite3 data.db` can query it directly;
  see the SCHEMA at the top of `server.js` for the table structure.
