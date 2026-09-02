// The kernel side of env.DB —— the data itself doesn't live here.
//
// The app side sees a D1 interface; the execution endpoint is the AppStore inside workerd
// (Durable Object + built-in SQLite, see runtime/overseer.js). Every app query completes inside
// the workerd process and never loops back to the kernel; the kernel only has two jobs left here:
//   1. Calling an app's database on behalf of the AI / the kernel itself —— via overseer's internal
//      route /_wd/db, never bypassing AppStore to touch files directly;
//   2. Mounting the link: apps/<id>/data.db → .wandesk/store/…/<objectId>.sqlite, so
//      `sqlite3 apps/notes/data.db` just works —— keeping the "data lives right next to the code"
//      contract intact.
import fs from "fs";
import path from "path";
import { appDbPath } from "../apps/scan.js";
import { runtimeOrigin, runtimeToken, storeFile } from "../../runtime/supervisor.js";

export type SqlResult = { rows?: Record<string, unknown>[]; changes?: number; lastInsertRowid?: number };
type Statement = { sql: string; params?: unknown[] };

// ── 1. Kernel → workerd ──────────────────────────────────────────
const call = async (route: string, body?: unknown) => {
  const origin = runtimeOrigin();
  if (!origin) throw new Error("App runtime is not ready");
  const res = await fetch(origin + route, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", "x-wd-internal": runtimeToken() },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data: any = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok === false) throw new Error(String(data?.error || `Runtime error ${res.status}`));
  return data;
};

/** Executes one app SQL statement on behalf of the kernel / AI. Semantics are identical to the app side's env.DB (the same execution endpoint). */
export const execAppSql = async (appId: string, sql: string, params: unknown[] = []): Promise<SqlResult> => {
  if (!appDbPath(appId)) throw new Error(`App does not exist: ${appId}`);
  const { rows, changes, lastInsertRowid } = await call("/_wd/db", { appId, sql, params });
  return { rows, changes, lastInsertRowid };
};

/** D1's batch: runs inside one transaction, any failure rolls the whole thing back. */
export const batchAppSql = async (appId: string, statements: Statement[]) => {
  if (!appDbPath(appId)) throw new Error(`App does not exist: ${appId}`);
  const { results } = await call("/_wd/db", { appId, statements });
  return { results: results as SqlResult[] };
};

/** Which file an app's database lives in (the AppStore object ID is derived by overseer). */
export const appStoreFile = async (appId: string) => {
  const { storeId } = await call(`/_wd/db/id?app=${encodeURIComponent(appId)}`);
  return storeFile(String(storeId));
};

// ── 2. Mounting the link ─────────────────────────────────────────────────
/** Called on AppStore's first open: apps/<id>/data.db points at the real file. An existing link gets replaced; an existing regular file is left untouched. */
export const linkAppDb = (appId: string, storeId: string) => {
  const file = appDbPath(appId);
  if (!file) return;
  try {
    const st = fs.lstatSync(file);
    if (!st.isSymbolicLink()) { console.warn(`[db] apps/${appId}/data.db already exists and is not a symlink, leaving it as is`); return; }
    fs.unlinkSync(file);
  } catch { /* doesn't exist */ }
  try {
    fs.symlinkSync(path.relative(path.dirname(file), storeFile(storeId)), file);
  } catch (e: any) {
    console.error(`[db] Failed to mount link apps/${appId}/data.db:`, e?.message); // On Windows without permission, this just means one fewer shortcut
  }
};
