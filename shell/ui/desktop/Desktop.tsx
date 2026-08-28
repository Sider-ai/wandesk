import {
  useCallback, useEffect, useRef, useState,
  type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent,
} from "react";
import { fetchApps, post, type AppMeta } from "../lib/http";
import { startRealtime, on, EV } from "../lib/realtime";
import {
  DEFAULT_WALLPAPER_ID, normalizeWallpaperId, wallpaperCss, cssToStyle,
} from "../lib/wallpapers";
import { Window, TASKBAR_H, type Geo, type WinMeta } from "../window/Window";
import { AppFrame } from "../appframe/AppFrame";
import { ContextMenu } from "../panels/ContextMenu";
import { Wallpaper } from "../panels/Wallpaper";
import { Settings } from "../panels/Settings";
import "./Desktop.css";
import "../appframe/AppFrame.css";

// 桌面:壁纸 + 图标网格 + 窗口管理器 + 任务栏。
//
// 壳只管画。窗口里装的一律是 AppFrame(一个 iframe),壳不知道里面是什么应用、
// 更不知道那个应用是干嘛的。桌面布局落在内核的 settings 表(键 desktop),
// localStorage 只是首屏同步渲染用的缓存。
const CW = 88, CH = 104, IW = 68, EDGE = 12;
const LS_KEY = "wandesk.desktop";
const clampN = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Cell = { c: number; r: number };
type Cells = Record<string, Cell>;
type Win = WinMeta & { z: number; init: Geo; min: boolean; kind: "app" | "shell"; route: string };

/** 壳自己的面板 —— 它们配置的是框架本身(壁纸、模型连接),不是应用。
 *  这条线不含糊:凡是「配置框架」的界面属于壳,凡是「做事」的一律是应用。 */
const SHELL_PANELS: Record<string, { name: string; icon: string }> = {
  "__wallpaper": { name: "个性化", icon: "🎨" },
  "__settings": { name: "设置", icon: "⚙️" },
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
  const [busy, setBusy] = useState(0); // 有几个应用正在调 AI
  const [toast, setToast] = useState<{ icon: string; text: string } | null>(null);
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });

  const zTop = useRef(10);
  const uid = useRef(1);
  const layerRef = useRef<HTMLDivElement>(null);
  const dragXYRef = useRef({ x: 0, y: 0 });

  // ── 网格计算 ──
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

  // 只保留仍存在的应用的格子。删掉的应用会留下隐形残格,让那个看着空的位置拖不进东西。
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

  // 布局落库:本地缓存即时写,库端防抖写(拖拽中别刷请求)
  const persistTimer = useRef(0);
  const persist = (cs: Cells, wp: string) => {
    const payload = JSON.stringify({ cells: cs, wallpaper: wp });
    try { localStorage.setItem(LS_KEY, payload); } catch { /* 隐私模式 */ }
    window.clearTimeout(persistTimer.current);
    persistTimer.current = window.setTimeout(() => {
      void post("/api/settings", { desktop: payload }).catch(() => { /* 缓存已写,下次再同步 */ });
    }, 500);
  };

  const reload = useCallback(async () => {
    const list = await fetchApps().catch(() => [] as AppMeta[]);
    setApps(list);
    setCells((prev) => placeMissing(list, prev));
    return list;
  }, [vp.w, vp.h]);

  // ── 启动 ──
  useEffect(() => {
    let saved: { cells?: Cells; wallpaper?: string } = {};
    try { saved = JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { /* 无缓存 */ }
    if (saved.wallpaper) setWallpaper(normalizeWallpaperId(saved.wallpaper));

    let cancelled = false;
    (async () => {
      // 内核可能还在起(要先拉 workerd),多试几次别一上来就画个空桌面
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
          } catch { /* 库读不到就用缓存 */ }
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

  // ── 内核事件 ──
  useEffect(() => {
    startRealtime();
    const offs = [
      // 「安装 = 目录存在」:AI 造完应用,桌面立刻长出图标,不用刷新
      on(EV.APPS_CHANGED, () => { void reload(); }),
      on(EV.ACTIVITY_START, () => setBusy((n) => n + 1)),
      on(EV.ACTIVITY_END, () => setBusy((n) => Math.max(0, n - 1))),
      on(EV.UI_TOAST, (p) => showToast("✦", String(p?.text || ""))),
      on(EV.UI_OPEN_APP, (p) => openById(String(p?.appId || ""), String(p?.route || "/"))),
      on(EV.UI_OPEN_EXTERNAL, (p) => window.open(String(p?.url || ""), "_blank", "noopener")),
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

  // ── 窗口管理 ──
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
      const deskH = vp.h - TASKBAR_H;
      const w = clampN(880, 320, vp.w - 40), h = clampN(600, 240, deskH - 40);
      const n = prev.length;
      const baseX = Math.round((vp.w - w) / 2), baseY = Math.round((deskH - h) * 0.42);
      return [...prev, {
        id: uid.current++, appId: id, emoji: icon, name, kind, route,
        z: ++zTop.current, min: false,
        init: {
          x: clampN(baseX + n * 28, EDGE, Math.max(EDGE, vp.w - w - EDGE)),
          y: clampN(baseY + n * 28, EDGE, Math.max(EDGE, deskH - h - EDGE)),
          w, h,
        },
      }];
    });
  }

  const openApp = (a: AppMeta) => openWindow(a.id, a.name, a.icon || "📦", "app");
  const openById = (id: string, route = "/") => {
    const panel = SHELL_PANELS[id];
    if (panel) return openWindow(id, panel.name, panel.icon, "shell");
    const a = apps.find((x) => x.id === id);
    if (a) openWindow(a.id, a.name, a.icon || "📦", "app", route);
  };

  // ── 图标拖拽 ──
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
    else if (key === "create") openById("workshop");
    else if (key === "refresh") void reload();
    else if (key === "wallpaper") openById("__wallpaper");
    else if (key === "about") openById("__settings");
    setCtx({ open: false, x: 0, y: 0 });
  }

  function pickWallpaper(id: string) {
    const next = normalizeWallpaperId(id);
    setWallpaper(next);
    setCells((prev) => { persist(prev, next); return prev; });
  }

  const layerH = EDGE + (maxRow(cells) + 1) * CH + EDGE;
  const topZ = Math.max(...wins.filter((w) => !w.min).map((w) => w.z), 0);

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
                : <Settings />)
            : (
              <AppFrame
                appId={w.appId}
                mount="window"
                onOpenApp={(id, route) => openById(id, route)}
                onTitle={(t) => setTitle(w.id, t || w.name)}
                onClose={() => close(w.id)}
                onToast={(text) => showToast("✦", text)}
              />
            )}
        </Window>
      ))}

      {/* ── 任务栏:开始 + 打开的窗口 + 忙碌指示 + 助理 ── */}
      <div className="taskbar" onClick={(e) => { e.stopPropagation(); setCtx({ open: false, x: 0, y: 0 }); }}>
        <button className={`tb-start${startOpen ? " on" : ""}`} onClick={() => setStartOpen((v) => !v)} title="应用">
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
        {/* 谁在调 AI —— 壳的状态指示,不是应用。应用调 env.AI 必须带 summary,就是为了这里看得见 */}
        {busy > 0 && <span className="tb-busy" title={`${busy} 个应用正在调用 AI`}>✦ {busy}</span>}
        <button className="tb-assistant" onClick={() => openById("chat")} title="助理">✦</button>
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
                  <span className="sm-name">{p.name}</span>
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
