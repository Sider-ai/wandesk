// env.DB 的内核侧 —— 数据本身不在这儿。
//
// 应用侧看到的是 D1 接口,执行端是 workerd 里的 AppStore(Durable Object + 内置 SQLite,
// 见 runtime/overseer.js)。应用的每次查询在 workerd 进程内完成,不回环到内核;
// 内核这边只剩两件事:
//   1. 替 AI / 内核自己调应用的库 —— 经 overseer 的内部路由 /_wd/db,不绕过 AppStore 直接碰文件;
//   2. 挂链接:apps/<id>/data.db → .wandesk/store/…/<对象ID>.sqlite,
//      `sqlite3 apps/notes/data.db` 一句话能查 —— 「数据就在代码旁边」这条契约不变。
import fs from "fs";
import path from "path";
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

// ── 2. 挂链接 ─────────────────────────────────────────────────
/** AppStore 首次开门时调用:apps/<id>/data.db 指向真实文件。已有链接就换新,已有普通文件不动它。 */
export const linkAppDb = (appId: string, storeId: string) => {
  const file = appDbPath(appId);
  if (!file) return;
  try {
    const st = fs.lstatSync(file);
    if (!st.isSymbolicLink()) { console.warn(`[db] apps/${appId}/data.db 已存在且不是链接,没有覆盖`); return; }
    fs.unlinkSync(file);
  } catch { /* 不存在 */ }
  try {
    fs.symlinkSync(path.relative(path.dirname(file), storeFile(storeId)), file);
  } catch (e: any) {
    console.error(`[db] 挂链接失败 apps/${appId}/data.db:`, e?.message); // Windows 无权限时只是少个快捷方式
  }
};
