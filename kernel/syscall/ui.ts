// env.UI —— 壳的能力。
//
// 这是唯一一条「应用 → 壳」的通道:应用后端说一句,内核广播,壳去执行。
// 壳因此保持了不认识领域的状态:它只知道「有人请我弹个 toast」,不知道是谁为什么。
import { EV } from "../shared/events.js";
import { broadcast } from "../realtime.js";

export const uiToast = (appId: string, text: string, kind = "info") => {
  broadcast(EV.UI_TOAST, { appId, text: String(text || "").slice(0, 300), kind });
  return { ok: true };
};

export const uiOpenApp = (appId: string, target: string, route = "/") => {
  broadcast(EV.UI_OPEN_APP, { from: appId, appId: String(target || ""), route: String(route || "/") });
  return { ok: true };
};

export const uiOpenExternal = (appId: string, url: string) => {
  const clean = String(url || "");
  if (!/^https?:\/\//i.test(clean)) throw new Error("只接受 http(s) 链接");
  broadcast(EV.UI_OPEN_EXTERNAL, { appId, url: clean });
  return { ok: true };
};
