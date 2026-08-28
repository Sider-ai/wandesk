CREATE TABLE IF NOT EXISTS app_aircraft_scores (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  score      INTEGER NOT NULL,
  wave       INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
