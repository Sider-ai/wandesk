-- Player's chip stack — single row, persisted across sessions. Start at 1000.
CREATE TABLE IF NOT EXISTS app_poker_wallet (
  id    INTEGER PRIMARY KEY CHECK (id = 1),
  chips INTEGER NOT NULL DEFAULT 1000
);
INSERT OR IGNORE INTO app_poker_wallet (id, chips) VALUES (1, 1000);

-- Lifetime tally — one row per finished hand, for the win/loss header.
CREATE TABLE IF NOT EXISTS app_poker_stats (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  result     TEXT NOT NULL,                       -- 'win' | 'lose'
  delta      INTEGER NOT NULL DEFAULT 0,          -- chips won (+) or lost (-) this hand
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
