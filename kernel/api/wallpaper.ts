// 壁纸生成:壳自己的功能,走 env.AI 同一条路(appId 记成 __shell,活动流水里看得见)。
//
// 放在内核而不是做成应用,是因为它配置的是壳的外观 —— 属于「配置框架」那一侧。
import type { IncomingMessage, ServerResponse } from "http";
import { json, readJson } from "./http.js";
import { aiAsk } from "../syscall/ai.js";

const SYSTEM = `你为一个桌面生成壁纸。只输出一段 CSS background 属性值,不要任何解释、不要代码围栏。
要求:纯 CSS(gradient / radial-gradient 组合),不引用任何外部图片,颜色柔和适合长时间注视。
示例输出:radial-gradient(120% 90% at 20% 10%, #f7e8d8 0%, #efd9c4 45%, #d9bfa6 100%)`;

export const handleWallpaperApi = async (req: IncomingMessage, res: ServerResponse, rest: string): Promise<boolean> => {
  if (rest !== "/create" || req.method !== "POST") return false;
  const body = await readJson(req);
  const desc = String(body.prompt || "").trim();
  if (!desc) return json(res, 200, { ok: false, error: "描述不能为空" });

  const out = await aiAsk("__shell", {
    summary: `生成壁纸:${desc.slice(0, 20)}`,
    system: SYSTEM,
    prompt: `壁纸描述:${desc}`,
  });
  if (!out.ok) return json(res, 200, { ok: false, error: out.error });

  const css = String(out.text || "").trim().replace(/^```[a-z]*\n?|```$/g, "").trim();
  if (!css || css.length > 2000) return json(res, 200, { ok: false, error: "模型没给出可用的 CSS" });
  return json(res, 200, { ok: true, id: `custom-${Date.now().toString(36)}`, css });
};
