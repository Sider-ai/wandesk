// 设置:模型连接、系统提示词,外加壳自己的偏好(桌面布局 / 壁纸)。
import type { IncomingMessage, ServerResponse } from "http";
import { json, readJson } from "./http.js";
import { readSettings, writeSettings } from "../data/settings.js";
import { broadcast } from "../realtime.js";
import { EV } from "../shared/events.js";

/** apiKey 只写不读:给壳的响应里抹成占位符,免得设置页把它回显出来。 */
const SECRET_KEYS = new Set(["apiKey"]);

export const handleSettingsApi = async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
  if (req.method === "POST") {
    const body = (await readJson(req)) as Record<string, string>;
    const before = readSettings().language;
    const patch: Record<string, string> = {};
    for (const [k, v] of Object.entries(body)) {
      if (typeof v !== "string") continue;
      if (SECRET_KEYS.has(k) && v === "********") continue; // 占位符原样回传 = 不改
      patch[k] = v;
    }
    writeSettings(patch);
    // 语言变了才广播 —— 壳借此重渲染、重载所有打开的应用窗口
    if (typeof patch.language === "string" && patch.language !== before) {
      broadcast(EV.LANGUAGE_CHANGED, { language: patch.language });
    }
    return json(res, 200, { ok: true });
  }
  const settings = readSettings();
  for (const k of SECRET_KEYS) if (settings[k]) settings[k] = "********";
  return json(res, 200, { settings });
};
