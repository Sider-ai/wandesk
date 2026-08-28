// 天气 —— 这个应用同时压两件事:
//
//   1. **应用后端直接 fetch() 出网**:Open-Meteo 由 server.js 去取,不是前端跨域拿。
//      能力全开,没有白名单、没有宿主代发(见 APP.md「当前取舍」)。
//   2. **富交互 UI 跑在 public/ 里**:一整套动画天空 + 城市管理,纯原生 JS,无构建步骤。
//
// 顺带:出网走后端而不是前端,上云后这份代码在 Cloudflare 上照样跑 —— 前端跨域拿反而会被 CORS 卡。
const SCHEMA = `
CREATE TABLE IF NOT EXISTS cities (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL DEFAULT '',
  lat        REAL NOT NULL,
  lon        REAL NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0,
  sort       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_cities_sort ON cities (sort ASC, id ASC);
`;

const DEFAULT_CITY = { name: "北京", lat: 39.9042, lon: 116.4074 };

let ready = false;
const ensure = async (env) => {
  if (ready) return;
  await env.DB.exec(SCHEMA);
  // 第一次打开给个默认城市,免得进来是空的
  const row = await env.DB.prepare("SELECT COUNT(*) AS c FROM cities").first();
  if (!row || !row.c) {
    await env.DB.prepare("INSERT INTO cities (name, lat, lon, is_default, sort) VALUES (?, ?, ?, 1, 0)")
      .bind(DEFAULT_CITY.name, DEFAULT_CITY.lat, DEFAULT_CITY.lon).run();
  }
  ready = true;
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

const FORECAST_URL = (lat, lon) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
  `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day` +
  `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;

const GEO_URL = (q) =>
  `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=zh&format=json`;

const geoLabel = (g) => {
  const parts = [];
  if (g.name) parts.push(g.name);
  const region = g.admin1 && g.admin1 !== g.name ? g.admin1 : "";
  if (region) parts.push(region);
  if (g.country && g.country !== g.name && g.country !== region) parts.push(g.country);
  return parts.join(" · ") || g.name || "未知地点";
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;

    if (!p.startsWith("/api/")) return env.ASSETS.fetch(req);

    try {
      await ensure(env);

      if (p === "/api/cities") {
        const { results } = await env.DB
          .prepare("SELECT id, name, lat, lon, is_default, sort FROM cities ORDER BY sort ASC, id ASC").all();
        return json({ cities: results });
      }

      if (p === "/api/add" && req.method === "POST") {
        const { name, lat, lon } = await req.json();
        const row = await env.DB.prepare("SELECT COALESCE(MAX(sort), -1) + 1 AS n FROM cities").first();
        const r = await env.DB.prepare("INSERT INTO cities (name, lat, lon, sort) VALUES (?, ?, ?, ?)")
          .bind(String(name || ""), Number(lat), Number(lon), row?.n ?? 0).run();
        return json({ id: r.meta.last_row_id });
      }

      if (p === "/api/default" && req.method === "POST") {
        const { id } = await req.json();
        // batch = 一个事务:清旧默认与设新默认必须一起成或一起败
        await env.DB.batch([
          { sql: "UPDATE cities SET is_default = 0", params: [] },
          { sql: "UPDATE cities SET is_default = 1 WHERE id = ?", params: [Number(id)] },
        ]);
        return json({ ok: true });
      }

      if (p === "/api/remove" && req.method === "POST") {
        const { id } = await req.json();
        await env.DB.prepare("DELETE FROM cities WHERE id = ?").bind(Number(id)).run();
        return json({ ok: true });
      }

      // ── 出网:两个都由后端去取 ──
      if (p === "/api/forecast") {
        const lat = Number(url.searchParams.get("lat"));
        const lon = Number(url.searchParams.get("lon"));
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return json({ error: "经纬度不合法" }, 400);
        const res = await fetch(FORECAST_URL(lat, lon));
        if (!res.ok) return json({ error: `天气服务 ${res.status}` }, 200);
        const data = await res.json();
        if (data?.error) return json({ error: data.reason || "天气服务返回了错误" }, 200);
        return json(data);
      }

      if (p === "/api/geo") {
        const q = (url.searchParams.get("q") || "").trim();
        if (!q) return json({ results: [] });
        const res = await fetch(GEO_URL(q));
        if (!res.ok) return json({ error: `地名服务 ${res.status}` }, 200);
        const data = await res.json();
        const results = (data?.results || [])
          .filter((g) => typeof g.latitude === "number" && typeof g.longitude === "number")
          .map((g) => ({ name: geoLabel(g), lat: g.latitude, lon: g.longitude }));
        return json({ results });
      }

      return json({ error: "not found" }, 404);
    } catch (e) {
      return json({ error: String(e?.message || e) }, 200);
    }
  },
};
