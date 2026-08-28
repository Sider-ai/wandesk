-- 笔记本 · 数据模型
-- 每一条记录就是本子里的一页：标题 + 正文 + 纸张样式 + 时间戳。

CREATE TABLE IF NOT EXISTS app_notes_pages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL DEFAULT '',
  body       TEXT NOT NULL DEFAULT '',
  paper      INTEGER NOT NULL DEFAULT 0,        -- 纸张样式索引（横线/方格/点阵/牛皮…）
  pinned     INTEGER NOT NULL DEFAULT 0,        -- 1 = 用丝带书签置顶
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS app_notes_idx_pages_pinned_updated ON app_notes_pages (pinned DESC, updated_at DESC);
