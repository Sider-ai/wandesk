import { useEffect, useRef, useState } from "react";
import { appUrl } from "../lib/http";
import { publish, subscribe } from "./bus";

// 应用的宿主。壳对应用的全部认识就到这里为止:
// 一个 iframe、一条 postMessage 通道。壳不知道里面是笔记还是记账。
//
// iframe 是**不透明源**(sandbox 不给 allow-same-origin):所有应用同在一个 workerd 端口上,
// 给了真 origin 就会互读 localStorage 串数据。应用的数据一律走 env.DB。
// 这不是权限门 —— 能力是全开的,见 APP.md。

type Props = {
  appId: string;
  mount?: "window" | "panel";
  /** 壳把自己的动作交回来:应用请求开另一个应用、改标题、关掉自己。 */
  onOpenApp?: (appId: string, route: string) => void;
  onTitle?: (title: string) => void;
  onClose?: () => void;
  onToast?: (text: string, kind: string) => void;
};

export function AppFrame({ appId, mount = "window", onOpenApp, onTitle, onClose, onToast }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let cancelled = false;
    setUrl(null); setError("");
    (async () => {
      // 运行时可能还没起来(workerd 拉起要一会儿),重试几次再报错
      for (let i = 0; i < 20 && !cancelled; i++) {
        const href = await appUrl(appId, mount).catch(() => null);
        if (cancelled) return;
        if (href) { setUrl(href); return; }
        await new Promise((r) => setTimeout(r, 400));
      }
      if (!cancelled) setError("应用运行时未就绪");
    })();
    return () => { cancelled = true; };
  }, [appId, mount]);

  // ── postMessage 桥:应用前端的 window.wandesk.* 落在这里 ──
  useEffect(() => {
    const post = (msg: unknown) => frame.current?.contentWindow?.postMessage(msg, "*");

    // 同应用其它实例发来的事件,转进这个 iframe
    const listener = (event: string, payload: unknown) => post({ __wandesk: true, event, payload });
    const unsubscribe = subscribe(appId, listener);

    const onMessage = (e: MessageEvent) => {
      const msg = e.data;
      if (!msg || msg.__wandesk !== true || !msg.method) return;
      if (e.source !== frame.current?.contentWindow) return; // 只认自己这个 iframe
      const reply = (result: unknown, err?: string) =>
        post({ __wandesk: true, id: msg.id, result, error: err });
      const p = msg.params || {};
      try {
        switch (msg.method) {
          case "context": reply({ appId, mount }); break;
          case "toast": onToast?.(String(p.text || ""), String(p.kind || "info")); reply({ ok: true }); break;
          case "confirm": reply({ ok: window.confirm(String(p.text || "")) }); break;
          case "title": onTitle?.(String(p.text || "")); reply({ ok: true }); break;
          case "openApp": onOpenApp?.(String(p.appId || ""), String(p.route || "/")); reply({ ok: true }); break;
          case "openExternal": window.open(String(p.url || ""), "_blank", "noopener"); reply({ ok: true }); break;
          case "copyText": void navigator.clipboard?.writeText(String(p.text || "")); reply({ ok: true }); break;
          case "close": onClose?.(); reply({ ok: true }); break;
          case "emit": publish(appId, String(p.event || ""), p.payload, listener); reply({ ok: true }); break;
          default: reply(null, `未知方法:${msg.method}`);
        }
      } catch (err: any) {
        reply(null, String(err?.message || err));
      }
    };
    window.addEventListener("message", onMessage);
    return () => { window.removeEventListener("message", onMessage); unsubscribe(); };
  }, [appId, mount, onOpenApp, onTitle, onClose, onToast]);

  if (error) return <div className="appframe-msg">{error}<br /><span>先确认 workerd 已就绪(内核日志里的 [runtime])</span></div>;
  if (!url) return <div className="appframe-msg">正在启动…</div>;

  return (
    <iframe
      ref={frame}
      className="appframe"
      src={url}
      // 不给 allow-same-origin:所有应用同端口,真 origin 会互读 localStorage
      sandbox="allow-scripts allow-forms allow-popups allow-modals"
      title={appId}
    />
  );
}
