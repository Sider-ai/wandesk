import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "fs";
import { dirname } from "path";
import { MAIN_DB_PATH, DB_DIR } from "../../shared/paths.js";
mkdirSync(DB_DIR, { recursive: true });
const db: any = new DatabaseSync(MAIN_DB_PATH);
export {
  db
};
