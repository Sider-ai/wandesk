# Weather

Live weather + 7-day forecast. One big "now" card (temperature, condition icon, feels-like,
humidity, wind speed), a 7-day forecast strip below it; a search bar at the top for cities,
favorites, and one-tap switching between saved cities.
The gradient sky in the background shifts with **condition + time of day** (clear / cloudy /
rain / snow / night), plus drifting-cloud and falling-rain animations.
All data comes from Open-Meteo (free, no key needed), with friendly retries when the proxy or
parsing fails.

## Data

A private database `data.db` with a single table `cities` — the user's saved cities:

```sql
cities(
  id INTEGER PK,
  name TEXT,          -- display name (includes state/country to disambiguate same-name cities)
  lat  REAL,          -- latitude
  lon  REAL,          -- longitude
  is_default INTEGER, -- 1 = default city (at most one)
  sort INTEGER,       -- list order, smaller sorts first
  created_at TEXT
)
```

The frontend reads/writes through the shared `db` capability; there's no per-app backend:

```ts
import { db } from './wandesk/db';

await db('weather', 'SELECT id, name, lat, lon, is_default, sort FROM cities ORDER BY sort ASC, id ASC');
await db('weather', 'INSERT INTO cities (name, lat, lon, sort) VALUES (?, ?, ?, ?)', [name, lat, lon, sort]);
await db('weather', 'UPDATE cities SET is_default = (id = ?)', [id]); // switch the default city
await db('weather', 'DELETE FROM cities WHERE id = ?', [id]);
```

`db(appId, sql, params)` POSTs to `/api/db`. The app id is passed in from the entry point
main.tsx; it's never hardcoded in a query.
On first open, if there are no saved cities yet, a sensible default city (New York) is seeded.

## Weather Data (Open-Meteo, free, no key)

There's no per-app backend endpoint; everything goes through the shared `http` proxy
(to bypass CORS):

```ts
import { proxy } from './wandesk/http';

const r = await proxy('weather', url);   // -> { ok, status?, body?, error? }
// body is a string, needs JSON.parse
```

Two upstreams:

- **Geocoding** (turns a city name into lat/lon):
  `https://geocoding-api.open-meteo.com/v1/search?name=<q>&count=5&language=en`
- **Forecast** (current + daily for 7 days):
  `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`

The `weather_code` in the response is a [WMO weather code](https://open-meteo.com/en/docs); the
frontend maps it to an English condition label + emoji/icon, and uses it (together with
`is_day`) to decide the sky gradient and animations.

## Layout & Making Changes

- `app.json` manifest · `APP.md` this file · `server.js` backend (Worker, table-creation script
  is in it) · `public/` frontend build output · `src/` frontend source (React)
- **Editing the frontend**: edit `src/`, then run `npm install && npm run build` in this
  directory; the output lands back in `public/`, and refreshing the window applies it. Needs
  Node.js installed locally; not needed if you're not making changes.
- **Editing the backend**: edit `server.js` directly; it takes effect on the next request, no
  restart needed.
- **Data**: `data.db` is this app's SQLite database; `sqlite3 data.db` can query it directly. See
  the SCHEMA at the top of `server.js` for the table structure.
