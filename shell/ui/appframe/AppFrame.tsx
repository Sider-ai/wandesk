import { useEffect, useRef, useState } from "react";
import { appUrl } from "../lib/http";
import { t } from "../lib/i18n";
import { publish, subscribe } from "./bus";

// The host for an app. This is the full extent of what the shell knows about an app:
// one iframe, one postMessage channel. The shell doesn't know whether it's notes or a ledger inside.
//
// Each app has its own origin (`<token>.localhost:<port>`), hence allow-same-origin —
// so an app gets localStorage / IndexedDB, naturally isolated from every other app, no data crosses over.
// The token is derived from the install key and stays stable across restarts, so what an app has stored in the browser doesn't vanish on restart.
// The shell is on a different origin, so the iframe can't touch the shell's DOM; the two sides can only postMessage.

type Props = {
  appId: string;
  mount?: "window" | "panel";
  /** The shell hands its own actions back: an app requesting to open another app, change its title, close itself. */
  onOpenApp?: (appId: string, route: string) => void;
  onTitle?: (title: string) => void;
  onClose?: () => void;
  onToast?: (text: string, kind: string) => void;
  /** Is this the focused, visible window? Background windows are told to pause animation (SDK gates requestAnimationFrame). */
  active?: boolean;
};

export function AppFrame({ appId, mount = "window", onOpenApp, onTitle, onClose, onToast, active = true }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let cancelled = false;
    setUrl(null); setError("");
    (async () => {
      // The runtime might not be up yet (workerd takes a moment to start), retry a few times before reporting an error
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

  // ── postMessage bridge: the app frontend's window.wandesk.* lands here ──
  useEffect(() => {
    const post = (msg: unknown) => frame.current?.contentWindow?.postMessage(msg, "*");

    // Events from other instances of the same app, forwarded into this iframe
    const listener = (event: string, payload: unknown) => post({ __wandesk: true, event, payload });
    const unsubscribe = subscribe(appId, listener);

    const onMessage = (e: MessageEvent) => {
      const msg = e.data;
      if (!msg || msg.__wandesk !== true || !msg.method) return;
      if (e.source !== frame.current?.contentWindow) return; // only accept messages from this exact iframe
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
          default: reply(null, `Unknown method: ${msg.method}`); // an internal protocol error, not user-facing copy
        }
      } catch (err: any) {
        reply(null, String(err?.message || err));
      }
    };
    window.addEventListener("message", onMessage);
    return () => { window.removeEventListener("message", onMessage); unsubscribe(); };
  }, [appId, mount, onOpenApp, onTitle, onClose, onToast]);

  // Push focus state into the iframe: on every change, and again once the page has loaded (the SDK may not
  // have been listening when the first message went out).
  useEffect(() => {
    const post = () => frame.current?.contentWindow?.postMessage({ __wandesk: true, event: "__active", payload: { active } }, "*");
    post();
    const el = frame.current;
    el?.addEventListener("load", post);
    return () => el?.removeEventListener("load", post);
  }, [active, url]);

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
