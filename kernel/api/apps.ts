// The app registry's outward-facing interface: the shell uses it to draw desktop icons, and overseer uses it to resolve a token to an appId.
import type { IncomingMessage, ServerResponse } from "http";
import { json, readJson } from "./http.js";
import { listApps, getApp } from "../apps/scan.js";
import { appToken, appIdForToken } from "../apps/token.js";
import { sdkSource } from "../apps/sdk.js";
import { execAppSql, batchAppSql, appStoreFile } from "../syscall/db.js";
import { runtimeOrigin, runtimePort } from "../../runtime/supervisor.js";

/** Each app gets a real origin of its own: `http://<token>.localhost:<port>`.
 *  That means the app stands at the root of its own site, so absolute paths (/style.css, /api/…) all just work. */
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

  // The shell wants to open a particular mount point of an app → resolve it to a usable iframe URL
  if (rest === "/url") {
    const id = url.searchParams.get("id") || "";
    const mount = (url.searchParams.get("mount") || "window") as "window" | "panel";
    const app = getApp(id);
    if (!app) return json(res, 404, { error: "App does not exist" });
    const route = app.mounts[mount] || app.mounts.window || app.mounts.panel || "/";
    const href = withUrl(app.id, route);
    return href ? json(res, 200, { url: href }) : json(res, 503, { error: "App runtime is not ready" });
  }

  // overseer: token → appId
  if (rest === "/resolve-token") {
    const appId = appIdForToken(url.searchParams.get("token") || "", listApps().map((a) => a.id));
    return appId ? json(res, 200, { appId }) : json(res, 404, { error: "Unknown token" });
  }

  // The app frontend's SDK —— built with the current language baked in on the fly, must never be cached or it would serve a stale language
  if (rest === "/sdk.js") {
    res.writeHead(200, { "content-type": "text/javascript; charset=utf-8", "cache-control": "no-store" });
    res.end(sdkSource());
    return true;
  }

  // The kernel / AI touching app data goes through here —— it's the same execution endpoint as the
  // app's own env.DB (the AppStore inside workerd).
  // Prying open apps/<id>/data.db directly with sqlite3 also works (it's a symlink), but writes should
  // go through this path instead, to avoid fighting the live database for locks.
  //   POST { id, sql, params? }  or  POST { id, statements: [{ sql, params }] } (one transaction)
  if (rest === "/db" && req.method === "POST") {
    const body = await readJson(req);
    const id = String(body.id || "");
    if (!getApp(id)) return json(res, 404, { error: "App does not exist" });
    try {
      const out = Array.isArray(body.statements)
        ? await batchAppSql(id, body.statements as { sql: string; params?: unknown[] }[])
        : await execAppSql(id, String(body.sql || ""), Array.isArray(body.params) ? body.params : []);
      return json(res, 200, { ok: true, ...out });
    } catch (e: any) {
      return json(res, 200, { ok: false, error: String(e?.message || e) });
    }
  }
  // Which file an app's database lives in (for troubleshooting)
  if (rest === "/db/file") {
    const id = url.searchParams.get("id") || "";
    if (!getApp(id)) return json(res, 404, { error: "App does not exist" });
    try { return json(res, 200, { file: await appStoreFile(id) }); }
    catch (e: any) { return json(res, 503, { error: String(e?.message || e) }); }
  }

  return false;
};
