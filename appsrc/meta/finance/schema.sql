-- 记账本 (finance) — 一张流水表,收入/支出各一行。
CREATE TABLE IF NOT EXISTS app_finance_transactions (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  type   TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount REAL NOT NULL,
  note   TEXT NOT NULL DEFAULT '',
  date   TEXT NOT NULL              -- 'YYYY-MM-DDT12:00:00',按 substr(date,1,7) 归月
);
CREATE INDEX IF NOT EXISTS idx_app_finance_date ON app_finance_transactions (date);
