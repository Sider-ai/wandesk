// 应用注册表的对外接口:壳靠它画桌面图标,overseer 靠它把 token 换成 appId。
import type { IncomingMessage, ServerResponse } from "http";
import { json, readJson } from "./http.js";
import { listApps, getApp } from "../apps/scan.js";
import { appToken, appIdForToken } from "../apps/token.js";
import { sdkSource } from "../apps/sdk.js";
import { execAppSql, batchAppSql, appStoreFile } from "../syscall/db.js";
import { runtimeOrigin, runtimePort } from "../../runtime/supervisor.js";

/** 每个应用一个真正的 origin:`http://<token>.localhost:<port>`。
 *  应用因此是站在自己网站根上的,绝对路径(/style.css、/api/…)全部成立。 */
const withUrl = (id: string, route: string) => {
  const port = runtimePort();
  return port ? `http://${appToken(id)}.localhost:${port}${route === "/" ? "/" : route}` : null;
};

export const handleAppsApi = async (req: IncomingMessage, res: ServerResponse, rest: string): Promise<boolean> => {
  const url = new URL(req.url || "/", "http://x");

  if (rest === "" || rest === "/") {
    const apps = listApps().map((a) => ({
      id: a.id, name: a.name, icon: a.icon, description: a.description, mounts: a.mounts,
    }));
    return json(res, 200, { apps, runtime: runtimeOrigin() });
  }

  // 壳要打开某个应用的某个挂载点 → 换一个可用的 iframe URL
  if (rest === "/url") {
    const id = url.searchParams.get("id") || "";
    const mount = (url.searchParams.get("mount") || "window") as "window" | "panel";
    const app = getApp(id);
    if (!app) return json(res, 404, { error: "应用不存在" });
    const route = app.mounts[mount] || app.mounts.window || app.mounts.panel || "/";
    const href = withUrl(app.id, route);
    return href ? json(res, 200, { url: href }) : json(res, 503, { error: "应用运行时未就绪" });
  }

  // overseer:token → appId
  if (rest === "/resolve-token") {
    const appId = appIdForToken(url.searchParams.get("token") || "", listApps().map((a) => a.id));
    return appId ? json(res, 200, { appId }) : json(res, 404, { error: "未知 token" });
  }

  // 应用前端的 SDK —— 带当前语言,现拼现发,不能被缓存成旧语言
  if (rest === "/sdk.js") {
    res.writeHead(200, { "content-type": "text/javascript; charset=utf-8", "cache-control": "no-store" });
    res.end(sdkSource());
    return true;
  }

  // 内核 / AI 动应用的数据走这里 —— 与应用自己的 env.DB 是同一个执行端(workerd 里的 AppStore)。
  // 直接 sqlite3 撬 apps/<id>/data.db 也行(那是个链接),但写入请走这条,别和运行中的库抢锁。
  //   POST { id, sql, params? }  或  POST { id, statements: [{ sql, params }] }(一个事务)
  if (rest === "/db" && req.method === "POST") {
    const body = await readJson(req);
    const id = String(body.id || "");
    if (!getApp(id)) return json(res, 404, { error: "应用不存在" });
    try {
      const out = Array.isArray(body.statements)
        ? await batchAppSql(id, body.statements as { sql: string; params?: unknown[] }[])
        : await execAppSql(id, String(body.sql || ""), Array.isArray(body.params) ? body.params : []);
      return json(res, 200, { ok: true, ...out });
    } catch (e: any) {
      return json(res, 200, { ok: false, error: String(e?.message || e) });
    }
  }
  // 某个应用的库落在哪个文件(排查用)
  if (rest === "/db/file") {
    const id = url.searchParams.get("id") || "";
    if (!getApp(id)) return json(res, 404, { error: "应用不存在" });
    try { return json(res, 200, { file: await appStoreFile(id) }); }
    catch (e: any) { return json(res, 503, { error: String(e?.message || e) }); }
  }

  return false;
};
