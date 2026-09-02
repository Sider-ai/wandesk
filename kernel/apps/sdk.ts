// SDK for app frontends: <script src="/_wd/sdk.js">.
//
// Only needed when you have to touch the **shell itself** — an app talks to its own backend over the same origin,
// so `fetch("/api/…")` just works with no SDK required. What's provided here is what an app can't reach on its own:
// showing a toast, opening another app, getting instance info.
// It goes through postMessage to the parent window (an iframe is an opaque origin and can't reach the parent window's objects).
//
// Assembled fresh on every request: the current UI language (see currentLanguage() in data/settings.ts) is stuffed into
// window.wandesk.lang, and document.documentElement.lang is set to zh-CN / en.
// Callers (kernel/api/apps.ts, runtime/overseer.js) must send cache-control: no-store,
// otherwise after a language switch the app page can still get a stale cached SDK.
import { currentLanguage } from "../data/settings.js";

export const sdkSource = (): string => {
  const lang = currentLanguage();
  const htmlLang = lang === "en" ? "en" : "zh-CN";
  return `(() => {
  try { document.documentElement.lang = ${JSON.stringify(htmlLang)}; } catch {}
  const pending = new Map();
  let seq = 0;

  const call = (method, params) => new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    parent.postMessage({ __wandesk: true, id, method, params }, "*");
    setTimeout(() => {
      if (pending.has(id)) { pending.delete(id); reject(new Error("Shell did not respond: " + method)); }
    }, 15000);
  });

  window.addEventListener("message", (e) => {
    const msg = e.data;
    if (!msg || msg.__wandesk !== true) return;
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error)) : resolve(msg.result);
      return;
    }
    if (msg.event) for (const fn of (listeners.get(msg.event) || [])) { try { fn(msg.payload); } catch {} }
  });

  const listeners = new Map();

  window.wandesk = {
    /** Current UI language ("zh" | "en") — assembled fresh by the kernel on every request, never a stale cached value. */
    lang: ${JSON.stringify(lang)},
    /** This instance's context: appId, mount point, current route. */
    context: () => call("context", {}),
    ui: {
      toast: (text, kind) => call("toast", { text, kind }),
      confirm: (text) => call("confirm", { text }),
      title: (text) => call("title", { text }),
      openApp: (appId, route) => call("openApp", { appId, route }),
      openExternal: (url) => call("openExternal", { url }),
      copyText: (text) => call("copyText", { text }),
      close: () => call("close", {}),
    },
    /** Send messages between multiple instances of the same app (window ↔ sidebar panel). */
    on: (event, fn) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(fn);
      return () => listeners.get(event).delete(fn);
    },
    emit: (event, payload) => call("emit", { event, payload }),
  };
})();
`;
};
