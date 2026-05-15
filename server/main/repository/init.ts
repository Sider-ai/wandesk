import { db } from "./client.js";

const APP_CREATION_GUIDE_SEED_KEY = "memorySeed.appCreationGuide.id";
const APP_CREATION_GUIDE_TITLE = "__T_MEMORY_SEED_APP_CREATION_GUIDE_TITLE__";
const APP_CREATION_GUIDE_DESCRIPTION = "__T_MEMORY_SEED_APP_CREATION_GUIDE_DESCRIPTION__";
const APP_CREATION_GUIDE_CONTENT = "__T_MEMORY_SEED_APP_CREATION_GUIDE_CONTENT__";

const createTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT NOT NULL,
      title TEXT,
      description TEXT DEFAULT '',
      scene TEXT NOT NULL DEFAULT 'chat',
      meta TEXT,
      state TEXT NOT NULL DEFAULT 'idle',
      pinned INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT NOT NULL,
      message TEXT NOT NULL,
      meta TEXT,
      remark TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_messages_conv_remark
      ON messages(conversation_id, id DESC) WHERE remark IS NOT NULL;

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT,
      app TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      mode TEXT NOT NULL DEFAULT 'agent',
      payload TEXT NOT NULL,
      meta TEXT,
      response TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      error TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      finished_at TEXT
    );

    CREATE TABLE IF NOT EXISTS auth (
      id            INTEGER PRIMARY KEY CHECK (id = 1),
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      api_token     TEXT NOT NULL,
      created_at    TEXT DEFAULT (datetime('now')),
      updated_at    TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id         TEXT PRIMARY KEY,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS memories (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      content     TEXT NOT NULL DEFAULT '',
      enabled     INTEGER NOT NULL DEFAULT 1,
      pinned      INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_memories_enabled_pinned_updated
      ON memories(enabled DESC, pinned DESC, updated_at DESC);
  `);
};

const seedAppCreationGuideMemory = () => {
  const title = String(APP_CREATION_GUIDE_TITLE || "").trim();
  const description = String(APP_CREATION_GUIDE_DESCRIPTION || "").trim();
  const content = String(APP_CREATION_GUIDE_CONTENT || "").trim();
  if (!title || !content) return;

  const setting = db.prepare("SELECT value FROM settings WHERE key = ?").get(APP_CREATION_GUIDE_SEED_KEY) as any;
  const existingId = Number(setting?.value || 0);
  const existing = existingId
    ? db.prepare("SELECT id FROM memories WHERE id = ?").get(existingId) as any
    : null;

  if (existing?.id) {
    db.prepare(`
      UPDATE memories
      SET title = ?, description = ?, content = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(title, description, content, existing.id);
    return;
  }

  const ret = db.prepare(`
    INSERT INTO memories (title, description, content, enabled, pinned)
    VALUES (?, ?, ?, 1, 1)
  `).run(title, description, content);
  db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(
    APP_CREATION_GUIDE_SEED_KEY,
    String(ret.lastInsertRowid)
  );
};

const initDatabase = () => {
  createTables();
  seedAppCreationGuideMemory();
};

export {
  initDatabase
};
