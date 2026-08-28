-- 对话历史(唯一真相,渲染气泡 + 每轮重建上下文都从这里来)
CREATE TABLE IF NOT EXISTS app_lovehouse_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  role       TEXT NOT NULL,            -- 'user' | 'bot'
  content    TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 长期记忆(高等级、去重、限量;每轮回注给她)
CREATE TABLE IF NOT EXISTS app_lovehouse_memories (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  content    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 关系状态(键值:好感度 affection、当前心情 mood)。每轮更新、回注给她。
CREATE TABLE IF NOT EXISTS app_lovehouse_state (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

-- 她的动态(右侧空间栏):AI 以苏晚的身份发的"空间说说",可赞可评。
-- comments 是 JSON 数组 [{who:'我'|'苏晚', text}];likes 为基础赞数,liked 记录你是否点过。
CREATE TABLE IF NOT EXISTS app_lovehouse_moments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  emoji      TEXT NOT NULL DEFAULT '',
  content    TEXT NOT NULL,
  likes      INTEGER NOT NULL DEFAULT 1,
  liked      INTEGER NOT NULL DEFAULT 0,
  comments   TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
