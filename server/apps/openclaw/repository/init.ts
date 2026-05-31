import { db } from "./client.js";

const initOpenClawDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS openclaw_chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_key TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_openclaw_chat_messages_session
      ON openclaw_chat_messages(session_key, id);
  `);
};

export { initOpenClawDatabase };
