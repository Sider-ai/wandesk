-- Hacker News — AI 解读缓存(按 story id 去重)+ 收藏。
CREATE TABLE IF NOT EXISTS app_hackernews_analyses (
  story_id   TEXT PRIMARY KEY,
  title      TEXT NOT NULL DEFAULT '',
  analysis   TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS app_hackernews_favorites (
  item_id    TEXT PRIMARY KEY,   -- story objectID
  data       TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
