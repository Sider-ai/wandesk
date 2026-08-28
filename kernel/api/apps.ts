// 应用注册表的对外接口:壳靠它画桌面图标,overseer 靠它把 token 换成 appId。
import type { IncomingMessage, ServerResponse } from "http";
import { json, text } from "./http.js";
import { listApps, getApp } from "../apps/scan.js";
import { appToken, appIdForToken } from "../apps/token.js";
import { SDK_SOURCE } from "../apps/sdk.js";
import { runtimeOrigin } from "../../runtime/supervisor.js";

/** 壳拿到的每个应用,都自带一个可以直接塞进 iframe 的 URL。 */
const withUrl = (id: string, route: string) => {
  const origin = runtimeOrigin();
  return origin ? `${origin}/app/${appToken(id)}${route === "/" ? "/" : route}` : null;
};

export const handleAppsApi = (req: IncomingMessage, res: ServerResponse, rest: string): boolean => {
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
    const appId = appIdForToken(url.searchParams.get("token") || "");
    return appId ? json(res, 200, { appId }) : json(res, 404, { error: "未知 token" });
  }

  // 应用前端的 SDK
  if (rest === "/sdk.js") return text(res, 200, SDK_SOURCE, "text/javascript; charset=utf-8");

  return false;
};
