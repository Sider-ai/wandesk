import { db } from "./client.js";
const initGhtrendingDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS gh_analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      repo_id INTEGER NOT NULL,
      repo_name TEXT NOT NULL,
      repo_url TEXT NOT NULL DEFAULT '',
      repo_description TEXT NOT NULL DEFAULT '',
      repo_language TEXT NOT NULL DEFAULT '',
      repo_stars INTEGER NOT NULL DEFAULT 0,
      repo_avatar TEXT NOT NULL DEFAULT '',
      analysis TEXT NOT NULL DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_gh_analyses_repo_id ON gh_analyses(repo_id)`);
};
export { initGhtrendingDatabase };
