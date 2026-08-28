// 路由分发。只认前缀,具体处理在各资源文件里 —— index 不写业务。
import type { IncomingMessage, ServerResponse } from "http";
import { json } from "./http.js";
import { handleAppsApi } from "./apps.js";
import { handleAppApi } from "./app.js";
import { handleChatApi } from "./chat.js";
import { handleSettingsApi } from "./settings.js";
import { handleWallpaperApi } from "./wallpaper.js";
import { convApi } from "../conv/index.js";
import { runtimeOrigin } from "../../runtime/supervisor.js";

export const handleApi = async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
  const path = new URL(req.url || "/", "http://x").pathname;

  if (path === "/api/health") return json(res, 200, { ok: true, runtime: runtimeOrigin() });

  // 会话面:AGENT 的 web/server 原样跑在这儿。应用经 env.AI.fetch() 打过来,
  // 前缀剥掉后它看到的就是自己熟悉的 /api/… —— 它的代码因此一行没改。
  if (path.startsWith("/api/conv/")) {
    const inner = new URL(req.url || "/", "http://x");
    inner.pathname = path.slice("/api/conv".length);
    return convApi()(req, res, inner);
  }

  // 应用 syscall 的执行端(只由 workerd 里的 HostGate 回环调用)
  if (path.startsWith("/api/app/")) return handleAppApi(req, res, path.slice("/api/app/".length));

  if (path.startsWith("/api/apps")) return handleAppsApi(req, res, path.slice("/api/apps".length));
  if (path.startsWith("/api/chat")) return handleChatApi(req, res, path.slice("/api/chat".length));
  if (path === "/api/settings") return handleSettingsApi(req, res);
  if (path.startsWith("/api/wallpaper")) return handleWallpaperApi(req, res, path.slice("/api/wallpaper".length));

  return false;
};
