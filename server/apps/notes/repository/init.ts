import { db } from "./client.js";

const initNotesDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS apps_notes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL DEFAULT '',
      body        TEXT NOT NULL DEFAULT '',
      pinned      INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_apps_notes_pinned_updated
      ON apps_notes(pinned DESC, updated_at DESC);
  `);
};

export { initNotesDatabase };
