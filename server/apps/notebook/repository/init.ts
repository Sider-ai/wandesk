import { db } from "./client.js";

const NOTEBOOK_SEEDS = [
  "__T_NOTEBOOK_SEED_1__",
  "__T_NOTEBOOK_SEED_2__",
  "__T_NOTEBOOK_SEED_3__"
];

const initNotebookTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL DEFAULT '',
      style INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
};

const seedNotebookIfEmpty = () => {
  const count = db.prepare("SELECT COUNT(*) as c FROM notes").get().c;
  if (count !== 0) return;
  const insert = db.prepare(`
    INSERT INTO notes (content, style, created_at, updated_at)
    VALUES (?, ?, datetime('now'), datetime('now'))
  `);
  for (const content of NOTEBOOK_SEEDS) {
    insert.run(content, Math.floor(Math.random() * 8));
  }
};

const initNotebookDatabase = () => {
  initNotebookTables();
  seedNotebookIfEmpty();
};

export {
  initNotebookDatabase
};
