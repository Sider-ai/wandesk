import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "fs";
import { join } from "path";
const root = process.cwd();
const dir = join(root, "database", "apps");
mkdirSync(dir, { recursive: true });
const createAppDb = (filename): any => {
  const db: any = new DatabaseSync(join(dir, filename));
  db.exec("PRAGMA journal_mode = WAL");
  return db;
};
export {
  createAppDb
};
