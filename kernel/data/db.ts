// 内核库的句柄。一个进程一个连接,WAL 打开(桌面壳会有多个读者)。
import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "url";
import { kernelDbFile } from "../paths.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let handle: DatabaseSync | null = null;

export const db = (): DatabaseSync => {
  if (handle) return handle;
  const file = kernelDbFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const conn = new DatabaseSync(file);
  conn.exec("PRAGMA journal_mode = WAL");
  conn.exec("PRAGMA busy_timeout = 5000");
  conn.exec(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
  handle = conn;
  return conn;
};

export const all = <T = any>(sql: string, ...params: unknown[]): T[] =>
  db().prepare(sql).all(...(params as never[])) as T[];

export const one = <T = any>(sql: string, ...params: unknown[]): T | null =>
  (db().prepare(sql).get(...(params as never[])) as T) ?? null;

export const run = (sql: string, ...params: unknown[]) => db().prepare(sql).run(...(params as never[]));
