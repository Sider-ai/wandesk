import {
  useCallback, useEffect, useRef, useState,
  type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent,
} from "react";
import { fetchApps, post, type AppMeta } from "../lib/http";
import { startRealtime, on, EV } from "../lib/realtime";
import { initI18n, useLang, t } from "../lib/i18n";
import {
  DEFAULT_WALLPAPER_ID, normalizeWallpaperId, wallpaperCss, cssToStyle,
} from "../lib/wallpapers";
import { Window, TASKBAR_H, type Geo, type WinMeta } from "../window/Window";
import { AppFrame } from "../appframe/AppFrame";
import { ContextMenu } from "../panels/ContextMenu";
import { Wallpaper } from "../panels/Wallpaper";
import { Settings } from "../panels/Settings";
import { About } from "../panels/About";
import { Setup } from "./Setup";
import "./Desktop.css";
import "../appframe/AppFrame.css";

// Desktop: wallpaper + icon grid + window manager + taskbar.
//
// The shell only draws. Every window holds an AppFrame (an iframe) — the shell doesn't
// know which app is inside, let alone what that app does. Desktop layout lives in the
// kernel's settings table (key `desktop`); localStorage is only a cache for the
// synchronous first-paint render.
const CW = 88, CH = 104, IW = 68, EDGE = 12;
const LS_KEY = "wandesk.desktop";
const clampN = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Cell = { c: number; r: number };
type Cells = Record<string, Cell>;
type Win = WinMeta & { z: number; init: Geo; min: boolean; kind: "app" | "shell"; route: string };

/** The shell's own panels — they configure the framework itself (wallpaper, model
 *  connection), not an app. This line stays firm: whatever configures the framework
 *  belongs to the shell, whatever does work is always an app. */
const SHELL_PANELS: Record<string, { nameKey: string; icon: string }> = {
  "__wallpaper": { nameKey: "panel.wallpaper", icon: "🎨" },
  "__settings": { nameKey: "panel.settings", icon: "⚙️" },
  "__about": { nameKey: "panel.about", icon: "ℹ️" },
};

export function Desktop() {
  const [apps, setApps] = useState<AppMeta[]>([]);
  const [cells, setCells] = useState<Cells>({});
  const [wins, setWins] = useState<Win[]>([]);
  const [wallpaper, setWallpaper] = useState(DEFAULT_WALLPAPER_ID);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragXY, setDragXY] = useState({ x: 0, y: 0 });
  const [sel, setSel] = useState<string | null>(null);
  const [ctx, setCtx] = useState({ open: false, x: 0, y: 0 });
  const [startOpen, setStartOpen] = useState(false);
  const [busy, setBusy] = useState(0); // how many apps are currently calling AI
  const [toast, setToast] = useState<{ icon: string; text: string } | null>(null);
  const [setupNeeded, setSetupNeeded] = useState<boolean | null>(null); // null = not known yet
  const [langTick, setLangTick] = useState(0); // bumped +1 on each language switch, forcing every AppFrame to remount (reload its iframe)
  useLang(); // subscribe to language changes — re-renders this whole tree so the shell's own copy switches language immediately
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });

  const zTop = useRef(10);
  const uid = useRef(1);
  const layerRef = useRef<HTMLDivElement>(null);
  const dragXYRef = useRef({ x: 0, y: 0 });

  // ── grid math ──
  const gridCols = () => Math.max(1, Math.floor((vp.w - 2 * EDGE - IW) / CW) + 1);
  const cellXY = (c: number, r: number) => ({ x: EDGE + c * CW, y: EDGE + r * CH });
  const occSet = (cs: Cells, except?: string) => {
    const s = new Set<string>();
    for (const k in cs) if (k !== except && cs[k]) s.add(cs[k].c + "," + cs[k].r);
    return s;
  };
  const maxRow = (cs: Cells) => { let m = 0; for (const k in cs) if (cs[k]) m = Math.max(m, cs[k].r); return m; };

  const nextFree = (cs: Cells): Cell => {
    const cols = gridCols(), s = occSet(cs);
    const rows = Math.max(1, Math.floor((vp.h - 2 * EDGE) / CH));
    for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) if (!s.has(c + "," + r)) return { c, r };
    for (let r = rows; ; r++) if (!s.has("0," + r)) return { c: 0, r };
  };
  const nearestFree = (cs: Cells, tc: number, tr: number, appId: string): Cell => {
    const cols = gridCols(), s = occSet(cs, appId);
    tc = clampN(tc, 0, cols - 1); tr = Math.max(0, tr);
    if (!s.has(tc + "," + tr)) return { c: tc, r: tr };
    let best: Cell | null = null, bd = Infinity;
    const R = maxRow(cs) + 1;
    for (let r = 0; r <= R; r++) for (let c = 0; c < cols; c++) {
      if (s.has(c + "," + r)) continue;
      const d = (c - tc) ** 2 + (r - tr) ** 2;
      if (d < bd) { bd = d; best = { c, r }; }
    }
    return best || { c: tc, r: tr };
  };

  // Keep only the cells of apps that still exist. A deleted app leaves an invisible leftover cell, so that spot — which looks empty — refuses to accept a drop.
  const placeMissing = (list: AppMeta[], cs: Cells): Cells => {
    const cols = gridCols();
    const live = new Set(list.map((a) => a.id));
    const next: Cells = {};
    for (const id in cs) if (live.has(id) && cs[id]) next[id] = cs[id];
    for (const a of list) {
      const cell = next[a.id];
      if (!cell || cell.c < 0 || cell.c >= cols || cell.r < 0) next[a.id] = nextFree(next);
    }
    return next;
  };

  // Persisting the layout: local cache writes immediately, the kernel write is debounced (no request spam while dragging)
  const persistTimer = useRef(0);
  const persist = (cs: Cells, wp: string) => {
    const payload = JSON.stringify({ cells: cs, wallpaper: wp });
    try { localStorage.setItem(LS_KEY, payload); } catch { /* private browsing mode */ }
    window.clearTimeout(persistTimer.current);
    persistTimer.current = window.setTimeout(() => {
      void post("/api/settings", { desktop: payload }).catch(() => { /* cache already written, will sync again next time */ });
    }, 500);
  };

  const reload = useCallback(async () => {
    const list = await fetchApps().catch(() => [] as AppMeta[]);
    setApps(list);
    setCells((prev) => placeMissing(list, prev));
    return list;
  }, [vp.w, vp.h]);

  // ── startup ──
  useEffect(() => {
    let saved: { cells?: Cells; wallpaper?: string } = {};
    try { saved = JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { /* no cache */ }
    if (saved.wallpaper) setWallpaper(normalizeWallpaperId(saved.wallpaper));

    let cancelled = false;
    (async () => {
      // The kernel might still be starting up (workerd has to come up first) — retry a few times instead of painting an empty desktop right away
      for (let attempt = 0; attempt < 24 && !cancelled; attempt++) {
        const list = await fetchApps().catch(() => [] as AppMeta[]);
        if (cancelled) return;
        if (list.length) {
          try {
            const j = await fetch("/api/settings").then((r) => r.json());
            const s: Record<string, string> = j?.settings || {};
            if (s.desktop) {
              const d = JSON.parse(s.desktop) as { cells?: Cells; wallpaper?: string };
              saved = d;
              if (d.wallpaper) setWallpaper(normalizeWallpaperId(d.wallpaper));
            }
            // No model connection yet → the out-of-box setup screen, and no desktop until a model answers
            setSetupNeeded(!(s.apiUrl && s.model && s.apiKey));
          } catch { /* fall back to the cache if the kernel read fails */ }
          if (cancelled) return;
          setApps(list);
          setCells((prev) => placeMissing(list, saved.cells || prev));
          return;
        }
        await new Promise((r) => setTimeout(r, 500));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── kernel events ──
  useEffect(() => {
    startRealtime();
    void initI18n(); // pull the current language once; after that, updates come from LANGUAGE_CHANGED below
    const offs = [
      // "Install = the directory exists": once the AI finishes building an app, the desktop grows an icon immediately, no refresh needed
      on(EV.APPS_CHANGED, () => { void reload(); }),
      on(EV.ACTIVITY_START, () => setBusy((n) => n + 1)),
      on(EV.ACTIVITY_END, () => setBusy((n) => Math.max(0, n - 1))),
      on(EV.UI_TOAST, (p) => showToast("✦", String(p?.text || ""))),
      on(EV.UI_OPEN_APP, (p) => openById(String(p?.appId || ""), String(p?.route || "/"))),
      on(EV.UI_OPEN_EXTERNAL, (p) => window.open(String(p?.url || ""), "_blank", "noopener")),
      // Language switch: the shell re-renders itself via useLang(); every app window's iframe must reload to re-read wandesk.lang
      on(EV.LANGUAGE_CHANGED, () => setLangTick((n) => n + 1)),
    ];
    return () => { for (const off of offs) off(); };
  }, [reload, apps]);

  useEffect(() => {
    const onResize = () => {
      setVp({ w: window.innerWidth, h: window.innerHeight });
      setCells((prev) => placeMissing(apps, prev));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [apps]);

  const showToast = (icon: string, text: string) => {
    setToast({ icon, text });
    window.setTimeout(() => setToast(null), 5000);
  };

  // ── window management ──
  const focus = (id: number) => setWins((p) => p.map((w) => (w.id === id ? { ...w, z: ++zTop.current } : w)));
  const close = (id: number) => setWins((p) => p.filter((w) => w.id !== id));
  const minimize = (id: number) => setWins((p) => p.map((w) => (w.id === id ? { ...w, min: true } : w)));
  const setTitle = (id: number, name: string) => setWins((p) => p.map((w) => (w.id === id ? { ...w, name } : w)));

  function toggleTask(id: number) {
    setWins((prev) => {
      const w = prev.find((x) => x.id === id);
      if (!w) return prev;
      if (w.min) return prev.map((x) => (x.id === id ? { ...x, min: false, z: ++zTop.current } : x));
      const topZ = Math.max(...prev.filter((x) => !x.min).map((x) => x.z), 0);
      if (w.z === topZ) return prev.map((x) => (x.id === id ? { ...x, min: true } : x));
      return prev.map((x) => (x.id === id ? { ...x, z: ++zTop.current } : x));
    });
  }

  function openWindow(id: string, name: string, icon: string, kind: "app" | "shell", route = "/") {
    setWins((prev) => {
      const ex = prev.find((w) => w.appId === id);
      if (ex) return prev.map((w) => (w.appId === id ? { ...w, min: false, z: ++zTop.current } : w));
      // Size from the live window, not the vp state: openWindow can run from a stale closure (the startup effect)
      const vw = window.innerWidth, vh = window.innerHeight;
      const deskH = vh - TASKBAR_H;
      const w = clampN(880, 320, vw - 40), h = clampN(600, 240, deskH - 40);
      const n = prev.length;
      const baseX = Math.round((vw - w) / 2), baseY = Math.round((deskH - h) * 0.42);
      return [...prev, {
        id: uid.current++, appId: id, emoji: icon, name, kind, route,
        z: ++zTop.current, min: false,
        init: {
          x: clampN(baseX + n * 28, EDGE, Math.max(EDGE, vw - w - EDGE)),
          y: clampN(baseY + n * 28, EDGE, Math.max(EDGE, deskH - h - EDGE)),
          w, h,
        },
      }];
    });
  }

  const openApp = (a: AppMeta) => openWindow(a.id, a.name, a.icon || "📦", "app");
  const openById = (id: string, route = "/") => {
    const panel = SHELL_PANELS[id];
    if (panel) return openWindow(id, t(panel.nameKey), panel.icon, "shell");
    const a = apps.find((x) => x.id === id);
    if (a) openWindow(a.id, a.name, a.icon || "📦", "app", route);
  };

  // ── icon dragging ──
  function onDown(appId: string, e: ReactPointerEvent) {
    if (e.button) return;
    setSel(appId);
    const layer = layerRef.current!;
    const rect = layer.getBoundingClientRect();
    const cell = cells[appId] || { c: 0, r: 0 };
    const cur = cellXY(cell.c, cell.r);
    const sx = e.clientX, sy = e.clientY;
    const gdx = e.clientX - rect.left - cur.x;
    const gdy = e.clientY - rect.top + layer.scrollTop - cur.y;
    let moved = false;
    const mv = (ev: globalThis.PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return;
      if (!moved) { moved = true; setDragId(appId); }
      const x = ev.clientX - rect.left - gdx;
      const y = ev.clientY - rect.top + layer.scrollTop - gdy;
      dragXYRef.current = { x, y };
      setDragXY({ x, y });
    };
    const up = () => {
      window.removeEventListener("pointermove", mv);
      window.removeEventListener("pointerup", up);
      if (!moved) return;
      const cols = gridCols();
      const tc = clampN(Math.round((dragXYRef.current.x - EDGE) / CW), 0, cols - 1);
      const tr = Math.max(0, Math.round((dragXYRef.current.y - EDGE) / CH));
      setDragId(null);
      setCells((prev) => {
        const next = { ...prev, [appId]: nearestFree(prev, tc, tr, appId) };
        persist(next, wallpaper);
        return next;
      });
    };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
  }

  function iconStyle(appId: string): CSSProperties {
    if (dragId === appId) return { left: dragXY.x, top: dragXY.y, transition: "none", zIndex: 1000 };
    const cell = cells[appId] || { c: 0, r: 0 };
    const { x, y } = cellXY(cell.c, cell.r);
    return { left: x, top: y };
  }

  function openMenu(e: ReactMouseEvent) {
    e.preventDefault();
    setSel(null);
    setCtx({ open: true, x: clampN(e.clientX, EDGE, window.innerWidth - 196), y: clampN(e.clientY, EDGE, window.innerHeight - 194) });
  }

  function onMenu(key: string) {
    if (key === "assistant") openById("chat");
    else if (key === "refresh") void reload();
    else if (key === "wallpaper") openById("__wallpaper");
    else if (key === "settings") openById("__settings");
    else if (key === "about") openById("__about");
    setCtx({ open: false, x: 0, y: 0 });
  }

  function pickWallpaper(id: string) {
    const next = normalizeWallpaperId(id);
    setWallpaper(next);
    setCells((prev) => { persist(prev, next); return prev; });
  }

  const layerH = EDGE + (maxRow(cells) + 1) * CH + EDGE;
  const topZ = Math.max(...wins.filter((w) => !w.min).map((w) => w.z), 0);

  // First boot: the setup wizard is the whole screen — no desktop, no taskbar, until a model answers.
  if (setupNeeded) return <Setup onDone={() => setSetupNeeded(false)} />;

  return (
    <div
      className="desktop"
      style={cssToStyle(wallpaperCss(wallpaper))}
      onClick={() => { setCtx({ open: false, x: 0, y: 0 }); setStartOpen(false); }}
    >
      <div
        ref={layerRef}
        className="iconlayer"
        style={{ minHeight: layerH }}
        onPointerDown={(e) => { if (e.target === e.currentTarget) setSel(null); }}
        onContextMenu={(e) => { if (e.target === e.currentTarget) openMenu(e); }}
      >
        {apps.map((a) => (
          <div
            key={a.id}
            className={`icon${sel === a.id ? " sel" : ""}${dragId === a.id ? " dragging" : ""}`}
            style={iconStyle(a.id)}
            onPointerDown={(e) => onDown(a.id, e)}
            onDoubleClick={() => openApp(a)}
            title={a.description || a.name}
            tabIndex={0}
          >
            <div className="tile">{a.icon}</div>
            <div className="lb">{a.name}</div>
          </div>
        ))}
      </div>

      {ctx.open && <ContextMenu x={ctx.x} y={ctx.y} onSelect={onMenu} />}

      {wins.map((w) => (
        <Window
          key={w.id}
          win={w}
          init={w.init}
          z={w.z}
          hidden={w.min}
          onFocus={() => focus(w.id)}
          onMin={() => minimize(w.id)}
          onClose={() => close(w.id)}
        >
          {w.kind === "shell"
            ? (w.appId === "__wallpaper"
                ? <Wallpaper current={wallpaper} onPick={pickWallpaper} />
                : w.appId === "__about" ? <About />
                : <Settings />)
            : (
              <AppFrame
                key={langTick}
                appId={w.appId}
                mount="window"
                onOpenApp={(id, route) => openById(id, route)}
                onTitle={(title) => setTitle(w.id, title || w.name)}
                onClose={() => close(w.id)}
                onToast={(text) => showToast("✦", text)}
              />
            )}
        </Window>
      ))}

      {/* ── taskbar: start + open windows + busy indicator + assistant ── */}
      <div className="taskbar" onClick={(e) => { e.stopPropagation(); setCtx({ open: false, x: 0, y: 0 }); }}>
        <button className={`tb-start${startOpen ? " on" : ""}`} onClick={() => setStartOpen((v) => !v)} title={t("taskbar.apps")}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.6" />
            <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.6" />
            <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.6" />
            <rect x="13" y="13" width="7.5" height="7.5" rx="1.6" />
          </svg>
        </button>
        <div className="tb-items">
          {wins.map((w) => (
            <button
              key={w.id}
              className={`tb-item${!w.min && w.z === topZ ? " on" : ""}${w.min ? " is-min" : ""}`}
              onClick={() => toggleTask(w.id)}
              title={w.name}
            >
              <span className="tb-emoji">{w.emoji}</span>
              <span className="tb-name">{w.name}</span>
            </button>
          ))}
        </div>
        {/* Who's calling AI — a status indicator owned by the shell, not an app. Apps calling env.AI must include a summary, exactly so this is visible */}
        {busy > 0 && <span className="tb-busy" title={t("taskbar.busy", { n: busy })}>✦ {busy}</span>}
        <button className="tb-assistant" onClick={() => openById("chat")} title={t("taskbar.assistant")}>✦</button>
      </div>

      {startOpen && (
        <div className="startmenu" onClick={(e) => e.stopPropagation()}>
          <div className="sm-inner">
            <div className="sm-grid">
              {apps.map((a) => (
                <button key={a.id} className="sm-app" onClick={() => { openApp(a); setStartOpen(false); }}>
                  <span className="sm-icon">{a.icon}</span>
                  <span className="sm-name">{a.name}</span>
                </button>
              ))}
              {Object.entries(SHELL_PANELS).map(([id, p]) => (
                <button key={id} className="sm-app" onClick={() => { openById(id); setStartOpen(false); }}>
                  <span className="sm-icon">{p.icon}</span>
                  <span className="sm-name">{t(p.nameKey)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <button className="desk-toast" onClick={() => setToast(null)}>
          <span className="desk-toast-ico">{toast.icon}</span>
          <span className="desk-toast-text">{toast.text}</span>
        </button>
      )}
    </div>
  );
}
