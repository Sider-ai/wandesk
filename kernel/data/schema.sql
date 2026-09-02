-- The kernel's own database. Holds only the runtime state of the "product itself" — no app domain data lives here.
-- App data lives in workerd's AppStore (.wandesk/store/, apps/<id>/data.db is a symlink into it); the kernel never touches it.

-- ── Conversations ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL DEFAULT 'New conversation',
  pinned      INTEGER NOT NULL DEFAULT 0,
  -- Snapshot of the previous turn's context — just a fast cache for the next run, not the source of truth
  context_json TEXT,
  last_usage_json TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Append-only, immutable Responses items (message / reasoning / function_call / function_call_output)
CREATE TABLE IF NOT EXISTS messages (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  seq             INTEGER NOT NULL,
  role            TEXT NOT NULL DEFAULT '',
  item_json       TEXT NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_messages_conv_seq ON messages (conversation_id, seq);

-- Append-only compaction log: which range got replaced by a summary, and how many tokens it cost
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

-- ── Memory: injected by the kernel on every env.AI call; apps never see the raw text ──
CREATE TABLE IF NOT EXISTS memory (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  kind       TEXT NOT NULL DEFAULT 'fact',    -- fact | preference | project
  text       TEXT NOT NULL,
  source     TEXT NOT NULL DEFAULT '',        -- which app/conversation wrote this in
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Settings: model connection, system prompt, shell preferences (desktop layout / wallpaper) ──
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

-- ── Activity log: who's calling the AI. Any app calling env.AI must include a summary, logged here so the user can see it ──
CREATE TABLE IF NOT EXISTS activity (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  app_id     TEXT NOT NULL,
  summary    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'running', -- running | done | error
  detail     TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity (created_at DESC);
