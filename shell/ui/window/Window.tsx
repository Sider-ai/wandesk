import { useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { t } from '../lib/i18n';
import './Window.css';

// Window frame ported from the web client: title bar (emoji + name, minimize + fullscreen +
// close), draggable, resizable, click-to-front, fullscreen toggle. Geometry is local; a
// minimized window stays mounted (display:none) so app state survives.
export type WinMeta = { id: number; appId: string; emoji: string; name: string };
export type Geo = { x: number; y: number; w: number; h: number };

export const TASKBAR_H = 46; // keep in sync with .taskbar height in index.css
const MIN_W = 320, MIN_H = 240, TOP = 0, BAR = 38;
const vw = () => window.innerWidth, vh = () => window.innerHeight - TASKBAR_H;

export function Window({
  win,
  init,
  z,
  hidden,
  onFocus,
  onMin,
  onClose,
  children,
}: {
  win: WinMeta;
  init: Geo;
  z: number;
  hidden?: boolean;
  onFocus: () => void;
  onMin: () => void;
  onClose: () => void;
  children: ReactNode;
}) {
  const [geo, setGeo] = useState<Geo>(init);
  const [max, setMax] = useState(false);

  const style: CSSProperties = {
    ...(max
      ? { left: 0, top: TOP, width: vw(), height: vh() - TOP, borderRadius: 0 }
      : { left: geo.x, top: geo.y, width: geo.w, height: geo.h }),
    zIndex: z,
    ...(hidden ? { display: 'none' } : {}),
  };

  function startDrag(e: PointerEvent) {
    if (max) return;
    if ((e.target as HTMLElement).closest('.wbtn')) return;
    onFocus();
    const bar = e.currentTarget as HTMLElement;
    bar.setPointerCapture(e.pointerId);
    const sx = e.clientX - geo.x, sy = e.clientY - geo.y;
    const mv = (ev: globalThis.PointerEvent) =>
      setGeo((g) => ({
        ...g,
        x: Math.max(0, Math.min(vw() - g.w, ev.clientX - sx)),
        y: Math.max(TOP, Math.min(vh() - BAR, ev.clientY - sy)),
      }));
    const up = () => {
      bar.removeEventListener('pointermove', mv);
      bar.removeEventListener('pointerup', up);
    };
    bar.addEventListener('pointermove', mv);
    bar.addEventListener('pointerup', up);
  }

  // Resize from any of the 8 handles. Dragging the right/bottom edge grows w/h from the
  // fixed top-left corner (as before); dragging the left/top edge must instead keep the
  // OPPOSITE edge fixed, so both position and size move together.
  function startResize(e: PointerEvent, dir: string) {
    if (max) return;
    e.stopPropagation();
    onFocus();
    const h = e.currentTarget as HTMLElement;
    h.setPointerCapture(e.pointerId);
    const sx = e.clientX, sy = e.clientY;
    const ox = geo.x, oy = geo.y, ow = geo.w, oh = geo.h;
    const mv = (ev: globalThis.PointerEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      let x = ox, y = oy, w = ow, hh = oh;
      if (dir.includes('r')) w = Math.max(MIN_W, Math.min(vw() - ox, ow + dx));
      if (dir.includes('b')) hh = Math.max(MIN_H, Math.min(vh() - oy, oh + dy));
      if (dir.includes('l')) {
        w = Math.max(MIN_W, ow - dx);
        x = Math.max(0, ox + ow - w);
        w = ox + ow - x; // reclamp so the right edge stays put even after the x>=0 clamp
      }
      if (dir.includes('t')) {
        hh = Math.max(MIN_H, oh - dy);
        y = Math.max(TOP, oy + oh - hh);
        hh = oy + oh - y; // reclamp so the bottom edge stays put even after the y clamp
      }
      setGeo({ x, y, w, h: hh });
    };
    const up = () => {
      h.removeEventListener('pointermove', mv);
      h.removeEventListener('pointerup', up);
    };
    h.addEventListener('pointermove', mv);
    h.addEventListener('pointerup', up);
  }

  return (
    <div className={`win${max ? ' max' : ''}`} style={style} onPointerDown={onFocus}>
      <div className="winbar" onPointerDown={startDrag} onDoubleClick={() => setMax((m) => !m)}>
        <span className="wtitle">
          <span className="wemoji">{win.emoji}</span>
          {win.name}
        </span>
        <div className="wbtns">
          <button className="wbtn" title={t("win.minimize")} onClick={(e) => { e.stopPropagation(); onMin(); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          </button>
          <button className="wbtn" title={t("win.maximize")} onClick={() => setMax((m) => !m)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5" />
            </svg>
          </button>
          <button className="wbtn close" title={t("win.close")} onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>
      </div>
      <div className="winbody">{children}</div>
      {!max && (
        <>
          <div className="rz rz-t" onPointerDown={(e) => startResize(e, 't')} />
          <div className="rz rz-b" onPointerDown={(e) => startResize(e, 'b')} />
          <div className="rz rz-l" onPointerDown={(e) => startResize(e, 'l')} />
          <div className="rz rz-r" onPointerDown={(e) => startResize(e, 'r')} />
          <div className="rz rz-tl" onPointerDown={(e) => startResize(e, 'tl')} />
          <div className="rz rz-tr" onPointerDown={(e) => startResize(e, 'tr')} />
          <div className="rz rz-bl" onPointerDown={(e) => startResize(e, 'bl')} />
          <div className="rz rz-br" onPointerDown={(e) => startResize(e, 'br')} />
        </>
      )}
    </div>
  );
}
