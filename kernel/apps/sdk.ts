// 应用前端的 SDK:<script src="/_wd/sdk.js">。
//
// 只有要碰**壳本身**时才需要它 —— 应用与自己的后端同源,`fetch("/api/…")` 直接就通,
// 不需要任何 SDK。这里提供的是应用够不到的东西:弹提示、开另一个应用、拿实例信息。
// 走 postMessage 到父窗口(iframe 是不透明源,拿不到父窗口的对象)。
export const SDK_SOURCE = `(() => {
  const pending = new Map();
  let seq = 0;

  const call = (method, params) => new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    parent.postMessage({ __wandesk: true, id, method, params }, "*");
    setTimeout(() => {
      if (pending.has(id)) { pending.delete(id); reject(new Error("壳没有响应:" + method)); }
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
    /** 本实例的上下文:appId、挂载点、当前路由。 */
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
    /** 同一应用的多个实例之间发消息(窗口 ↔ 侧栏面板)。 */
    on: (event, fn) => {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(fn);
      return () => listeners.get(event).delete(fn);
    },
    emit: (event, payload) => call("emit", { event, payload }),
  };
})();
`;
