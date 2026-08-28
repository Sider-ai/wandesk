-- 阅读 —— 每本 book 是一部可续写、可重开的交互小说
-- 续写靠引擎原生多轮:conversation_id 存活会话;失效时用 pages 兜底重建。

CREATE TABLE IF NOT EXISTS app_reader_books (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  title           TEXT NOT NULL DEFAULT '无题',     -- AI 起的书名
  premise         TEXT NOT NULL DEFAULT '',          -- 用户给的设定(类型 + 开场)
  conversation_id TEXT,                              -- 引擎会话 id,用于原生续写
  status          TEXT NOT NULL DEFAULT 'ongoing',   -- 'ongoing' | 'ended'
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 每一页:一段叙事 + 玩家在这一页做出的选择(末页 chosen 为空)
-- 末页还把"这一页给出的待选项"存进 choices(JSON),这样重开时停在抉择点能直接接着选。
CREATE TABLE IF NOT EXISTS app_reader_pages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id    INTEGER NOT NULL,
  idx        INTEGER NOT NULL,                       -- 页序号,从 0 开始
  narrative  TEXT NOT NULL DEFAULT '',               -- 这一页的正文
  chosen     TEXT NOT NULL DEFAULT '',               -- 玩家从这一页走出的行动
  choices    TEXT NOT NULL DEFAULT '[]',             -- 这一页给出的待选项(JSON 数组),用于恢复抉择点
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS app_reader_idx_pages_book ON app_reader_pages (book_id, idx);
