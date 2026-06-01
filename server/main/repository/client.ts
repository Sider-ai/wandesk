import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "fs";
import { dirname, resolve } from "path";
const dbPath = resolve(process.cwd(), "database", "aios.db");
mkdirSync(dirname(dbPath), { recursive: true });
const db: any = new DatabaseSync(dbPath);
export {
  db
};
