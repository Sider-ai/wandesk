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

  // 会话面:AGENT 的 web/server 原样跑在这儿,应用经 env.AI.fetch() 打过来。
  // 前缀刻意不叫 /api/conv:应用侧的路径本来就带 /api/,套在 /api/ 下会变成
  // /api/conv/api/meta 这种双前缀。用 /conv 剥一次就正好还原成它认得的 /api/meta。
  if (path.startsWith("/conv/")) {
    const inner = new URL(req.url || "/", "http://x");
    inner.pathname = path.slice("/conv".length);
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
