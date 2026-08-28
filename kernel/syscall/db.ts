// env.DB 的执行端 —— 应用侧看到的是 D1 接口,这里是它落到 SQLite 的地方。
//
// 库放在 apps/<id>/data.db,和代码做邻居:`sqlite3 apps/notes/data.db` 一句话能查、能改、能修迁移。
// 不放系统数据目录,也不用 workerd 的 DO 存储(那个按 DO id 哈希命名文件,AI 和用户都摸不到)。
import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import { appDbPath } from "../apps/scan.js";

const MAX_DB_BYTES = 200 * 1024 * 1024; // 单库上限:失控膨胀的保险丝
const opened = new Map<string, DatabaseSync>();

const dbFor = (appId: string): DatabaseSync => {
  const existing = opened.get(appId);
  if (existing) return existing;
  const file = appDbPath(appId);
  if (!file) throw new Error(`应用不存在:${appId}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const conn = new DatabaseSync(file);
  conn.exec("PRAGMA journal_mode = WAL");
  conn.exec("PRAGMA busy_timeout = 5000");
  opened.set(appId, conn);
  return conn;
};

/** 应用目录被删或改名后句柄要作废,否则还写向已删除的 inode。 */
export const closeAppDb = (appId: string) => {
  const conn = opened.get(appId);
  if (!conn) return;
  try { conn.close(); } catch { /* 已关 */ }
  opened.delete(appId);
};

// ATTACH 能打开任意路径的库,load_extension 能加载任意原生代码 —— 这两个不是能力问题,
// 是「应用只该碰自己的库」这条数据产权约定,所以即便能力全开也拦。
const FORBIDDEN = /\b(attach|load_extension)\b/i;
const isRead = (sql: string) => /^\s*(select|with|pragma|explain)\b/i.test(sql);

export type SqlResult = { rows?: unknown[]; changes?: number; lastInsertRowid?: number };

const toValues = (params: unknown[]) =>
  (Array.isArray(params) ? params : []).map((v) =>
    v === null || v === undefined ? null : typeof v === "number" || typeof v === "bigint" ? v : String(v),
  );

const runOne = (conn: DatabaseSync, sql: string, params: unknown[]): SqlResult => {
  const text = String(sql || "").trim();
  if (!text) throw new Error("sql 不能为空");
  if (FORBIDDEN.test(text)) throw new Error("不允许的语句:ATTACH / load_extension");
  const values = toValues(params);
  if (isRead(text)) return { rows: conn.prepare(text).all(...(values as never[])) };
  // 无参多语句(建表脚本)整体执行
  if (!values.length && /;\s*\S/.test(text)) { conn.exec(text); return {}; }
  const r = conn.prepare(text).run(...(values as never[]));
  return { changes: Number(r.changes), lastInsertRowid: Number(r.lastInsertRowid) };
};

const assertQuota = (appId: string, sql: string) => {
  if (isRead(sql)) return;
  const file = appDbPath(appId);
  if (!file) return;
  try {
    if (fs.statSync(file).size > MAX_DB_BYTES) {
      throw new Error(`应用数据库已超上限(${Math.round(MAX_DB_BYTES / 1024 / 1024)}MB),仅允许读取`);
    }
  } catch (e: any) {
    if (e?.code !== "ENOENT") throw e;
  }
};

export const execAppSql = (appId: string, sql: string, params: unknown[] = []): SqlResult => {
  assertQuota(appId, sql);
  return runOne(dbFor(appId), sql, params);
};

/** D1 的 batch:一个事务里跑完,任一失败整体回滚。 */
export const batchAppSql = (appId: string, statements: { sql: string; params?: unknown[] }[]) => {
  const conn = dbFor(appId);
  const list = Array.isArray(statements) ? statements.slice(0, 200) : [];
  for (const s of list) assertQuota(appId, String(s?.sql || ""));
  conn.exec("BEGIN");
  try {
    const results = list.map((s) => runOne(conn, String(s?.sql || ""), s?.params || []));
    conn.exec("COMMIT");
    return { results };
  } catch (e) {
    try { conn.exec("ROLLBACK"); } catch { /* 已回滚 */ }
    throw e;
  }
};
