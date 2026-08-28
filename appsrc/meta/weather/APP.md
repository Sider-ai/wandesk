# 天气（weather）

实时天气 + 7 日预报。一张大大的「现在」卡片（气温、天况图标、体感、湿度、风速），
下面一条 7 天预报条；顶部可以搜索城市、收藏、在收藏的城市之间一键切换。
背景的渐变天空会随**天况 + 昼夜**变化（晴 / 多云 / 雨 / 雪 / 夜），还有飘云、落雨等动效。
数据全部来自 Open-Meteo（免费、无需 key），代理与解析失败时有友好的重试。

## 结构

一个 Wandesk 应用 = **共享同一个 id（`weather`）的两个文件夹**：

- `apps/weather/` — 定义（没有后端代码）：
  - `app.json` — 清单（id、name「天气」、icon ⛅、version、description）
  - `schema.sql` — 表结构，首次启动时落进 `database/apps/weather.db`
  - `APP.md` — 本文件
- `ui/src/apps/weather/index.tsx` — React 前端，单文件、自带 `<style>`，由桌面外壳挂载

## 数据

私有数据库 `database/apps/weather.db`，只有一张表 `cities` —— 用户收藏的城市：

```sql
cities(
  id INTEGER PK,
  name TEXT,          -- 展示名（含省/国，便于区分同名城市）
  lat  REAL,          -- 纬度
  lon  REAL,          -- 经度
  is_default INTEGER, -- 1 = 默认城市（最多一个）
  sort INTEGER,       -- 列表排序，越小越靠前
  created_at TEXT
)
```

前端通过共享的 `db` 能力读写，没有每个应用单独的后端：

```ts
import { db } from '../../system/lib/db';

await db('weather', 'SELECT id, name, lat, lon, is_default, sort FROM cities ORDER BY sort ASC, id ASC');
await db('weather', 'INSERT INTO cities (name, lat, lon, sort) VALUES (?, ?, ?, ?)', [name, lat, lon, sort]);
await db('weather', 'UPDATE cities SET is_default = (id = ?)', [id]); // 切换默认城市
await db('weather', 'DELETE FROM cities WHERE id = ?', [id]);
```

`db(appId, sql, params)` 会 POST 到 `/apps/<appId>/db`。app id 由外壳传入，查询里从不写死。
首次打开若没有任何收藏城市，会落一个合理的默认城市（北京）。

## 天气数据（Open-Meteo，免费无 key）

没有每个应用单独的后端接口；一切走共享的 `http` 代理（绕过 CORS）：

```ts
import { proxy } from '../../system/lib/http';

const r = await proxy('weather', url);   // -> { ok, status?, body?, error? }
// body 是字符串，需要 JSON.parse
```

两个上游：

- **地理编码**（把城市名换成经纬度）：
  `https://geocoding-api.open-meteo.com/v1/search?name=<q>&count=5&language=zh`
- **预报**（当前 + 逐日 7 天）：
  `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`

返回里的 `weather_code` 是 [WMO 天气代码](https://open-meteo.com/en/docs)，前端把它映射成
中文天况标签 + emoji/图标，并据此（结合 `is_day`）决定天空渐变与动效。

## 改这个应用

改 `ui/src/apps/weather/index.tsx`（UI）和/或 `apps/weather/schema.sql`（表），
然后 `POST /api/reload` 让平台重新扫描。
