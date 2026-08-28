-- 手机 · the AI-generated screen log. Every screen the AI improvises is appended here,
-- so reopening the phone resumes the latest screen. "重新开机" wipes the table for a fresh
-- phone (and a fresh owner/world). Continuity within a session is native to the agent
-- conversation (conversationId), so we don't need to store history for the model — just
-- enough to put the last screen back on the LCD.
CREATE TABLE IF NOT EXISTS app_phone_screens (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  content    TEXT NOT NULL,                       -- inline-styled HTML for the screen body
  options    TEXT NOT NULL DEFAULT '[]',          -- JSON array of {text} follow-up choices
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 整部手机 = 一个持久对话:conversationId 存在这里,跨窗口/跨重启接着聊,
-- 机主和他的生活不会因为关掉窗口而断片。
CREATE TABLE IF NOT EXISTS app_phone_state (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
