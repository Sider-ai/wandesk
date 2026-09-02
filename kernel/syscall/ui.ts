// env.UI —— the shell's capabilities.
//
// This is the one and only "app → shell" channel: an app's backend says the word, the kernel
// broadcasts it, the shell carries it out. The shell therefore stays domain-agnostic — it only
// knows "someone asked me to show a toast," never who or why.
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
  if (!/^https?:\/\//i.test(clean)) throw new Error("Only http(s) links are accepted");
  broadcast(EV.UI_OPEN_EXTERNAL, { appId, url: clean });
  return { ok: true };
};
