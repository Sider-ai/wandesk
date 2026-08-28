-- 天气 · 数据模型
-- 没有每个应用单独的后端：前端用共享的 db 能力读写这张表，
-- 用 IF NOT EXISTS 幂等地落进 database/apps/weather.db。
--
-- 用户收藏的城市清单。每行一个城市（来自 Open-Meteo geocoding）。
-- is_default = 1 标记打开时默认展示的城市（最多一行）。
-- sort 决定切换器里的排列顺序；越小越靠前。
CREATE TABLE IF NOT EXISTS app_weather_cities (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL DEFAULT '',          -- 展示名（含省/国，便于区分同名城市）
  lat        REAL NOT NULL,                      -- 纬度
  lon        REAL NOT NULL,                      -- 经度
  is_default INTEGER NOT NULL DEFAULT 0,         -- 1 = 默认城市（最多一个）
  sort       INTEGER NOT NULL DEFAULT 0,         -- 列表排序，越小越靠前
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS app_weather_idx_cities_sort ON app_weather_cities (sort ASC, id ASC);
