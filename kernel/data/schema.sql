-- 内核自己的库。只装「产品本体」的运行时状态,不装任何应用的领域数据。
-- 应用的数据在 workerd 的 AppStore 里(.wandesk/store/,apps/<id>/data.db 是链接),内核不碰。

-- ── 会话 ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL DEFAULT '新对话',
  pinned      INTEGER NOT NULL DEFAULT 0,
  -- 上一轮的上下文快照,只是下一轮运行的快速缓存,不是真相
  context_json TEXT,
  last_usage_json TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 逐条、不可变的 Responses item(message / reasoning / function_call / function_call_output)
CREATE TABLE IF NOT EXISTS messages (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  seq             INTEGER NOT NULL,
  role            TEXT NOT NULL DEFAULT '',
  item_json       TEXT NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_messages_conv_seq ON messages (conversation_id, seq);

-- 只追加的压缩记录:哪一段被摘要覆盖了,花了多少 token
CREATE TABLE IF NOT EXISTS compactions (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  kind            TEXT NOT NULL,              -- summary | mechanical
  start_seq       INTEGER NOT NULL,
  end_seq         INTEGER NOT NULL,
  summary         TEXT NOT NULL DEFAULT '',
  tokens          INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── 记忆:env.AI 每次调用时由内核注入,应用读不到原文 ──
CREATE TABLE IF NOT EXISTS memory (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  kind       TEXT NOT NULL DEFAULT 'fact',    -- fact | preference | project
  text       TEXT NOT NULL,
  source     TEXT NOT NULL DEFAULT '',        -- 哪个应用/会话写进来的
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── 设置:模型连接、系统提示词、壳的偏好(桌面布局/壁纸) ──
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

-- ── 活动流水:谁在调 AI。应用调 env.AI 必须带 summary,落这里,用户看得见 ──
CREATE TABLE IF NOT EXISTS activity (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  app_id     TEXT NOT NULL,
  summary    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'running', -- running | done | error
  detail     TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity (created_at DESC);
