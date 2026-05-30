import { db } from "./client.js";

const daysAgo = (days, hour, minute) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString().slice(0, 19).replace("T", " ");
};

const FINANCE_SEEDS: any[] = [
  ["income",  88e4, "__T_FINANCE_SEED_NOTE_1__", () => daysAgo(30, 9, 15)],
  ["income",  52e3, "__T_FINANCE_SEED_NOTE_2__", () => daysAgo(20, 11, 0)],
  ["income",  15e3, "__T_FINANCE_SEED_NOTE_3__", () => daysAgo(12, 8, 30)],
  ["expense", 14e4, "__T_FINANCE_SEED_NOTE_4__", () => daysAgo(5, 14, 30)],
  ["expense", 299,  "__T_FINANCE_SEED_NOTE_5__", () => daysAgo(1, 15, 30)]
];

const initFinanceTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS finance_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      amount REAL NOT NULL,
      note TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const seedFinanceIfEmpty = () => {
  const count = db.prepare("SELECT COUNT(*) as c FROM finance_transactions").get().c;
  if (count !== 0) return;
  const insert = db.prepare(`
    INSERT INTO finance_transactions (type, amount, note, date)
    VALUES (?, ?, ?, ?)
  `);
  for (const [type, amount, note, dateFn] of FINANCE_SEEDS) {
    insert.run(type, amount, note, dateFn());
  }
};

const initFinanceDatabase = () => {
  initFinanceTables();
  seedFinanceIfEmpty();
};

export {
  initFinanceDatabase
};
