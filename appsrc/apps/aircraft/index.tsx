import { useEffect, useRef, useState } from 'react';
import { cl, PH, PW } from './lib/constants';
import { init } from './lib/state';
import { upd } from './lib/update';
import { draw } from './render/draw';
import { T } from './lib/text';
import * as data from './db';
import type { GS } from './lib/types';
import './style.css';

// ═══════════════════════════════════════════════════════════════════════
//  飞机大战 / SKY STRIKE — 霓虹街机弹幕射击。视差星野、粒子、震屏、慢镜、
//  敌机与首领、增益掉落。本文件只做:画布 + 游戏循环 + 输入 + 存档;
//  游戏逻辑在 lib/(update/state/fx),渲染在 render/,文案在 lib/text。
// ═══════════════════════════════════════════════════════════════════════

export default function Aircraft({ appId }: { appId: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLCanvasElement>(null);
  const gsRef = useRef<GS | null>(null);
  const keysRef = useRef(new Set<string>());
  const hiRef = useRef(0);
  const dimRef = useRef<[number, number]>([0, 0]);
  const [, kick] = useState(0);

  useEffect(() => {
    data.loadHiScore(appId).then((best) => { hiRef.current = best; kick((n) => n + 1); });
  }, [appId]);

  const beginRun = (g: GS) => {
    g.st = 'play'; g.wcd = 0.6; g.wav = 0; g.tookHit = false;
    g.banner = { big: T.ready, sub: '', life: 1.0, ml: 1.0, c: '#7fe0ff' };
  };

  const persist = (g: GS) => {
    data.saveScore(appId, g.sc, g.wav);
    if (g.sc > hiRef.current) hiRef.current = g.sc;
  };

  // ── game loop ──
  useEffect(() => {
    const box = boxRef.current!, can = canRef.current!, ctx = can.getContext('2d')!;
    let raf = 0, last = performance.now();
    function resize() {
      const rc = box.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      can.width = Math.max(1, rc.width * dpr); can.height = Math.max(1, rc.height * dpr);
      can.style.width = rc.width + 'px'; can.style.height = rc.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimRef.current = [rc.width, rc.height];
      return [rc.width, rc.height] as const;
    }
    let [W, H] = resize();
    gsRef.current = init(W, H);
    const ro = new ResizeObserver(() => {
      const [nw, nh] = resize();
      W = nw; H = nh;
      const g = gsRef.current;
      if (g) { g.p.x = cl(g.p.x, PW / 2, W - PW / 2); g.p.y = cl(g.p.y, PH / 2, H - PH / 2); }
    });
    ro.observe(box);
    function loop(now: number) {
      const dt = Math.min(0.04, (now - last) / 1000); last = now;
      const g = gsRef.current!;
      if (g.st === 'play') upd(g, dt, W, H, keysRef.current);
      else g.t += dt; // keep menus/overlays animating
      draw(ctx, g, W, H, hiRef.current);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  // ── input ──
  useEffect(() => {
    const box = boxRef.current!;
    const restart = () => {
      const g = gsRef.current; if (!g) return;
      if (g.st === 'menu') { beginRun(g); return; }
      if (g.st === 'over' || g.st === 'win') {
        persist(g);
        const [w, h] = dimRef.current;
        const fresh = init(w, h, g.sta);
        gsRef.current = fresh;
        beginRun(fresh);
      }
    };
    const dn = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      keysRef.current.add(e.key);
      const g = gsRef.current; if (!g) return;
      const k = e.key.toLowerCase();
      if (e.key === 'Enter' || e.key === ' ') restart();
      if (k === 'p' || e.key === 'Escape') {
        if (g.st === 'play') g.st = 'pause';
        else if (g.st === 'pause') g.st = 'play';
      }
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    const click = () => { box.focus(); restart(); };
    box.addEventListener('keydown', dn);
    box.addEventListener('keyup', up);
    box.addEventListener('click', click);
    box.focus();
    return () => {
      box.removeEventListener('keydown', dn);
      box.removeEventListener('keyup', up);
      box.removeEventListener('click', click);
    };
  }, [appId]);

  return (
    <div ref={boxRef} className="aircraft-root" tabIndex={0}>
      <canvas ref={canRef} className="aircraft-canvas" />
      <div className="aircraft-focushint">{T.clickFocus}</div>
    </div>
  );
}
