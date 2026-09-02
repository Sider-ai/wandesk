// env.DB 的内核侧 —— 数据本身不在这儿。
//
// 应用侧看到的是 D1 接口,执行端是 workerd 里的 AppStore(Durable Object + 内置 SQLite,
// 见 runtime/overseer.js)。应用的每次查询在 workerd 进程内完成,不再回环到内核;
// 内核这边只剩三件事:
//   1. 替 AI / 内核自己调应用的库 —— 经 overseer 的内部路由 /_wd/db,不绕过 AppStore 直接碰文件;
//   2. 认领旧库:AppStore 首次开门时把 apps/<id>/data.db(老的 Node 管的 SQLite)整库导过去;
//   3. 挂链接:apps/<id>/data.db → .wandesk/store/…/<对象ID>.sqlite,
//      `sqlite3 apps/notes/data.db` 照样能查 —— 「数据就在代码旁边」这条契约不变。
import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import { appDbPath } from "../apps/scan.js";
import { runtimeOrigin, runtimeToken, storeFile } from "../../runtime/supervisor.js";

export type SqlResult = { rows?: Record<string, unknown>[]; changes?: number; lastInsertRowid?: number };
type Statement = { sql: string; params?: unknown[] };

// ── 1. 内核 → workerd ──────────────────────────────────────────
const call = async (route: string, body?: unknown) => {
  const origin = runtimeOrigin();
  if (!origin) throw new Error("应用运行时未就绪");
  const res = await fetch(origin + route, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", "x-wd-internal": runtimeToken() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data: any = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok === false) throw new Error(String(data?.error || `运行时错误 ${res.status}`));
  return data;
};

/** 替内核 / AI 执行一条应用 SQL。语义与应用侧 env.DB 完全一致(同一个执行端)。 */
export const execAppSql = async (appId: string, sql: string, params: unknown[] = []): Promise<SqlResult> => {
  if (!appDbPath(appId)) throw new Error(`应用不存在:${appId}`);
  const { rows, changes, lastInsertRowid } = await call("/_wd/db", { appId, sql, params });
  return { rows, changes, lastInsertRowid };
};

/** D1 的 batch:一个事务里跑完,任一失败整体回滚。 */
export const batchAppSql = async (appId: string, statements: Statement[]) => {
  if (!appDbPath(appId)) throw new Error(`应用不存在:${appId}`);
  const { results } = await call("/_wd/db", { appId, statements });
  return { results: results as SqlResult[] };
};

/** 应用的库落在哪个文件(AppStore 对象 ID 由 overseer 推导)。 */
export const appStoreFile = async (appId: string) => {
  const { storeId } = await call(`/_wd/db/id?app=${encodeURIComponent(appId)}`);
  return storeFile(String(storeId));
};

// ── 2. 认领旧库 ───────────────────────────────────────────────
const legacyFile = (appId: string) => {
  const file = appDbPath(appId);
  if (!file) return null;
  try { return fs.lstatSync(file).isFile() ? file : null; } catch { return null; } // 已是链接 = 已认领过
};

const q = (name: string) => `"${String(name).replace(/"/g, '""')}"`;
const wrap = (v: unknown) =>
  v instanceof Uint8Array ? { __wd_b64: Buffer.from(v).toString("base64") } : typeof v === "bigint" ? Number(v) : v ?? null;

/** 把老库整个摊成语句:先建表、再灌数据、最后索引 / 视图 / 触发器。没有老库就是空数组。 */
export const dumpLegacyDb = (appId: string): Statement[] => {
  const file = legacyFile(appId);
  if (!file) return [];
  const conn = new DatabaseSync(file);
  try {
    const objects = conn.prepare(
      "SELECT type, name, sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' " +
      "ORDER BY CASE type WHEN 'table' THEN 0 WHEN 'index' THEN 1 WHEN 'view' THEN 2 ELSE 3 END, rowid",
    ).all() as { type: string; name: string; sql: string }[];
    const out: Statement[] = [];
    for (const o of objects.filter((x) => x.type === "table")) {
      out.push({ sql: o.sql });
      const rows = conn.prepare(`SELECT * FROM ${q(o.name)}`).all() as Record<string, unknown>[];
      if (!rows.length) continue;
      const cols = Object.keys(rows[0]);
      const sql = `INSERT INTO ${q(o.name)} (${cols.map(q).join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`;
      for (const row of rows) out.push({ sql, params: cols.map((c) => wrap(row[c])) });
    }
    for (const o of objects.filter((x) => x.type !== "table")) out.push({ sql: o.sql });
    return out;
  } finally {
    conn.close();
  }
};

// ── 3. 留档 + 挂链接 ───────────────────────────────────────────
/** AppStore 认领完成:老库改名留档(data.legacy.db),data.db 变成指向真实文件的链接。 */
export const finishAdoption = (appId: string, storeId: string) => {
  const file = appDbPath(appId);
  if (!file) return;
  const dir = path.dirname(file);
  if (legacyFile(appId)) {
    for (const suffix of ["", "-wal", "-shm"]) {
      try { fs.renameSync(file + suffix, path.join(dir, "data.legacy.db" + suffix)); } catch { /* 没有这个伴随文件 */ }
    }
    console.log(`[db] 旧库已留档:apps/${appId}/data.legacy.db`);
  }
  try {
    try { fs.unlinkSync(file); } catch { /* 不存在 */ }
    fs.symlinkSync(path.relative(dir, storeFile(storeId)), file);
  } catch (e: any) {
    console.error(`[db] 挂链接失败 apps/${appId}/data.db:`, e?.message); // Windows 无权限时只是少个快捷方式
  }
};
