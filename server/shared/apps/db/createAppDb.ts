import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "fs";
import { join } from "path";
import { APPS_DB_DIR } from "../../paths.js";
mkdirSync(APPS_DB_DIR, { recursive: true });
const createAppDb = (filename): any => {
  const db: any = new DatabaseSync(join(APPS_DB_DIR, filename));
  db.exec("PRAGMA journal_mode = WAL");
  return db;
};
export {
  createAppDb
};
