import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "fs";
import { dirname, resolve } from "path";
const dbPath = resolve(process.cwd(), "database", "aios.db");
mkdirSync(dirname(dbPath), { recursive: true });
const db: any = new DatabaseSync(dbPath);
// aios.db is also opened (read-only) by the apps service for api-token lookups, so the
// main writer and that reader race at startup. Without WAL + a busy timeout this surfaces
// as "database is locked" (SQLITE_BUSY) and crashes both services. WAL lets a writer and
// readers coexist; busy_timeout waits instead of failing instantly.
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA busy_timeout = 5000");
export {
  db
};
