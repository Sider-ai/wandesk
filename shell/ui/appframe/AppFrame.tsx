import { useEffect, useRef, useState } from "react";
import { appUrl } from "../lib/http";
import { t } from "../lib/i18n";
import { publish, subscribe } from "./bus";

// 应用的宿主。壳对应用的全部认识就到这里为止:
// 一个 iframe、一条 postMessage 通道。壳不知道里面是笔记还是记账。
//
// 每个应用有自己的 origin(`<token>.localhost:<port>`),所以给 allow-same-origin ——
// 应用因此拿得到 localStorage / IndexedDB,且彼此天然隔开,不会串数据。
// token 由装机密钥推导、跨重启稳定,应用存在浏览器里的东西不会因为重启就没了。
// 壳在另一个 origin 上,iframe 碰不到壳的 DOM;两边只能 postMessage。

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
      if (!cancelled) setError(t("appframe.notReady"));
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
          default: reply(null, `未知方法:${msg.method}`); // 协议内部错误,不是用户可见文案
        }
      } catch (err: any) {
        reply(null, String(err?.message || err));
      }
    };
    window.addEventListener("message", onMessage);
    return () => { window.removeEventListener("message", onMessage); unsubscribe(); };
  }, [appId, mount, onOpenApp, onTitle, onClose, onToast]);

  if (error) return <div className="appframe-msg">{error}<br /><span>{t("appframe.checkRuntime")}</span></div>;
  if (!url) return <div className="appframe-msg">{t("appframe.starting")}</div>;

  return (
    <iframe
      ref={frame}
      className="appframe"
      src={url}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      title={appId}
    />
  );
}
