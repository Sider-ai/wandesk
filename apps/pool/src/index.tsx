import { useEffect, useRef, useState } from 'react';
import './style.css';

// Pool — detailed edition: wood frame + rubber cushions + diamond sights, solid/stripe ball gloss rendering + drop shadows,
// real cue pull-back aiming + power bar, sub-stepped anti-tunneling physics (friction / cushion bounce / ball-ball elastic / six pockets).

type Ball = { x: number; y: number; vx: number; vy: number; num: number; color: string; stripe: boolean; alive: boolean };

const COLORS: Record<number, string> = {
  1: '#e6b422', 2: '#1b4fa0', 3: '#c0392b', 4: '#6c3fa0', 5: '#d97a1e',
  6: '#1e8a54', 7: '#7a2b2b', 8: '#161616',
  9: '#e6b422', 10: '#1b4fa0', 11: '#c0392b', 12: '#6c3fa0', 13: '#d97a1e', 14: '#1e8a54', 15: '#7a2b2b',
};
const R = 11;
const FRICTION = 0.991;
const STOP = 0.045;
const REST = 0.9;          // cushion restitution
const MAX_POWER = 17;
const POCKET_R = 16;    // pocket capture radius
const MOUTH = 20;       // pocket mouth half-width (this stretch of cushion doesn't bounce, so the ball rolls into the pocket)

export default function Pool() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const balls = useRef<Ball[]>([]);
  const size = useRef({ w: 680, h: 380 });
  const aim = useRef<{ active: boolean; x: number; y: number }>({ active: false, x: 0, y: 0 });
  const [potted, setPotted] = useState(0);
  const [toast, setToast] = useState('');
  const [won, setWon] = useState(false);
  const [power, setPower] = useState(0);

  // auto-dismiss the toast
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2200); return () => clearTimeout(t); }, [toast]);

  const geom = () => {
    const { w, h } = size.current;
    const frame = 30, cush = 14;          // wood frame width / cushion thickness
    const L = frame + cush, T = frame + cush, Rr = w - frame - cush, B = h - frame - cush;
    return { frame, cush, L, T, Rr, B, w, h };
  };
  const pockets = () => {
    const g = geom(); const midX = (g.L + g.Rr) / 2; const o = 7; // nudge pocket mouths slightly outward at the corners
    return [
      { x: g.L - o, y: g.T - o }, { x: midX, y: g.T - o }, { x: g.Rr + o, y: g.T - o },
      { x: g.L - o, y: g.B + o }, { x: midX, y: g.B + o }, { x: g.Rr + o, y: g.B + o },
    ];
  };

  function rack() {
    const g = geom();
    const cueX = g.L + (g.Rr - g.L) * 0.26, cueY = (g.T + g.B) / 2;
    const list: Ball[] = [{ x: cueX, y: cueY, vx: 0, vy: 0, num: 0, color: '#f4f2ea', stripe: false, alive: true }];
    const apexX = g.L + (g.Rr - g.L) * 0.66, apexY = cueY;
    const order = [1, 9, 14, 8, 11, 2, 13, 7, 3, 10, 4, 5, 12, 15, 6]; // 8-ball centered, solids/stripes interleaved
    let k = 0; const dx = R * 2 * 0.87, dy = R * 2 * 1.01;
    for (let col = 0; col < 5; col++) for (let row = 0; row <= col; row++) {
      const n = order[k++];
      list.push({ x: apexX + col * dx, y: apexY + (row - col / 2) * dy, vx: 0, vy: 0, num: n, color: COLORS[n], stripe: n >= 9, alive: true });
    }
    balls.current = list; setPotted(0); setWon(false);
  }

  const moving = () => balls.current.some((b) => b.alive && (Math.abs(b.vx) > STOP || Math.abs(b.vy) > STOP));

  function collideWalls(b: Ball, g: ReturnType<typeof geom>) {
    const midX = (g.L + g.Rr) / 2;
    const nearX = Math.abs(b.x - g.L) < MOUTH || Math.abs(b.x - midX) < MOUTH || Math.abs(b.x - g.Rr) < MOUTH; // pocket mouths on the top/bottom cushions
    const nearY = Math.abs(b.y - g.T) < MOUTH || Math.abs(b.y - g.B) < MOUTH;                                   // pocket mouths on the left/right cushions (corners)
    if (b.y < g.T + R && !nearX) { b.y = g.T + R; b.vy = Math.abs(b.vy) * REST; }
    if (b.y > g.B - R && !nearX) { b.y = g.B - R; b.vy = -Math.abs(b.vy) * REST; }
    if (b.x < g.L + R && !nearY) { b.x = g.L + R; b.vx = Math.abs(b.vx) * REST; }
    if (b.x > g.Rr - R && !nearY) { b.x = g.Rr - R; b.vx = -Math.abs(b.vx) * REST; }
  }

  function step() {
    const g = geom(); const bs = balls.current;
    // sub-stepping: slice by top speed to avoid tunneling through cushions/balls
    let maxSp = 0; for (const b of bs) if (b.alive) maxSp = Math.max(maxSp, Math.hypot(b.vx, b.vy));
    const sub = Math.max(1, Math.min(8, Math.ceil(maxSp / (R * 0.7))));
    for (let s = 0; s < sub; s++) {
      for (const b of bs) {
        if (!b.alive) continue;
        b.x += b.vx / sub; b.y += b.vy / sub;
        // pocketed: ball center crosses the table boundary (only possible through a pocket mouth), or enters a pocket's capture radius
        let sunk = b.x < g.L || b.x > g.Rr || b.y < g.T || b.y > g.B;
        if (!sunk) for (const p of pockets()) if (Math.hypot(b.x - p.x, b.y - p.y) < POCKET_R) { sunk = true; break; }
        if (sunk) { b.alive = false; if (b.num === 0) setToast('🎱 Cue ball scratch — respotted'); else setPotted((n) => n + 1); continue; }
        collideWalls(b, g);
      }
      // ball-ball elastic collision (equal mass)
      for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
        const a = bs[i], b = bs[j]; if (!a.alive || !b.alive) continue;
        const dx = b.x - a.x, dy = b.y - a.y; const d = Math.hypot(dx, dy);
        if (d > 0 && d < R * 2) {
          const nx = dx / d, ny = dy / d, overlap = R * 2 - d;
          a.x -= nx * overlap / 2; a.y -= ny * overlap / 2; b.x += nx * overlap / 2; b.y += ny * overlap / 2;
          const av = a.vx * nx + a.vy * ny, bv = b.vx * nx + b.vy * ny, diff = bv - av;
          a.vx += diff * nx; a.vy += diff * ny; b.vx -= diff * nx; b.vy -= diff * ny;
        }
      }
    }
    for (const b of bs) {
      if (!b.alive) continue;
      b.vx *= FRICTION; b.vy *= FRICTION;
      if (Math.abs(b.vx) < STOP) b.vx = 0; if (Math.abs(b.vy) < STOP) b.vy = 0;
    }
    const cue = bs[0];
    if (!cue.alive && !moving()) { const g2 = geom(); cue.x = g2.L + (g2.Rr - g2.L) * 0.26; cue.y = (g2.T + g2.B) / 2; cue.vx = 0; cue.vy = 0; cue.alive = true; }
    if (bs.slice(1).every((b) => !b.alive) && !won) setWon(true);
  }

  function draw(ctx: CanvasRenderingContext2D) {
    const g = geom(); const { w, h } = g;
    ctx.clearRect(0, 0, w, h);
    // wood frame
    const wood = ctx.createLinearGradient(0, 0, 0, h);
    wood.addColorStop(0, '#5a3820'); wood.addColorStop(.5, '#7a4e2c'); wood.addColorStop(1, '#4a2c18');
    ctx.fillStyle = wood; roundRect(ctx, 6, 6, w - 12, h - 12, 18); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 2; ctx.stroke();
    // rubber cushions (a full dark-green ring inside the wood frame)
    ctx.fillStyle = '#14663b';
    roundRect(ctx, g.L - g.cush, g.T - g.cush, g.Rr - g.L + g.cush * 2, g.B - g.T + g.cush * 2, 8); ctx.fill();
    // felt: only covers the playing surface, meets the cushions cleanly, flat gradient (no more lighter-green ring in the middle)
    const felt = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w / 1.05);
    felt.addColorStop(0, '#2ea360'); felt.addColorStop(1, '#249a56');
    ctx.fillStyle = felt; roundRect(ctx, g.L, g.T, g.Rr - g.L, g.B - g.T, 3); ctx.fill();
    // pockets
    for (const p of pockets()) {
      const pg = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, POCKET_R + 3);
      pg.addColorStop(0, '#000'); pg.addColorStop(.7, '#0b120d'); pg.addColorStop(1, 'rgba(11,18,13,0)');
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(p.x, p.y, POCKET_R + 3, 0, 7); ctx.fill();
    }
    // drop shadows
    for (const b of balls.current) { if (!b.alive) continue; ctx.beginPath(); ctx.ellipse(b.x + 2.5, b.y + 3.5, R, R * .9, 0, 0, 7); ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fill(); }
    // cue + aiming line
    const cue = balls.current[0];
    if (aim.current.active && cue?.alive) {
      const dx = cue.x - aim.current.x, dy = cue.y - aim.current.y, len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len; const pull = Math.min(len, 120);
      // aiming dashed line (forward)
      ctx.save(); ctx.setLineDash([5, 7]); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cue.x + ux * R, cue.y + uy * R); ctx.lineTo(cue.x + ux * 300, cue.y + uy * 300); ctx.stroke(); ctx.restore();
      // cue stick (pulled back): tapered shaft + white ferrule + blue tip + highlight
      const gap = R + 8 + pull * 0.6;
      const tipX = cue.x - ux * gap, tipY = cue.y - uy * gap;         // tip (end nearest the ball)
      const fx = tipX - ux * 12, fy = tipY - uy * 12;                 // ferrule/shaft junction
      const buttX = fx - ux * 168, buttY = fy - uy * 168;             // butt end
      const perpX = -uy, perpY = ux; const wt = 2.4, wb = 6.8;
      const quad = (x1: number, y1: number, w1: number, x2: number, y2: number, w2: number) => {
        ctx.beginPath();
        ctx.moveTo(x1 + perpX * w1, y1 + perpY * w1); ctx.lineTo(x2 + perpX * w2, y2 + perpY * w2);
        ctx.lineTo(x2 - perpX * w2, y2 - perpY * w2); ctx.lineTo(x1 - perpX * w1, y1 - perpY * w1); ctx.closePath();
      };
      const shaftG = ctx.createLinearGradient(fx + perpX * wt, fy + perpY * wt, fx - perpX * wt, fy - perpY * wt);
      shaftG.addColorStop(0, '#7a4e24'); shaftG.addColorStop(.4, '#e8c98f'); shaftG.addColorStop(.55, '#f4e2ba'); shaftG.addColorStop(.7, '#c99a52'); shaftG.addColorStop(1, '#6b4020');
      ctx.fillStyle = shaftG; quad(fx, fy, wt + 0.4, buttX, buttY, wb); ctx.fill();       // shaft (cylindrical highlight via cross gradient)
      ctx.fillStyle = '#f3ecd8'; quad(tipX, tipY, wt, fx, fy, wt + 0.4); ctx.fill();       // white ferrule
      ctx.fillStyle = '#2f6fb0'; ctx.beginPath(); ctx.arc(tipX, tipY, wt, 0, 7); ctx.fill(); // blue tip
      ctx.fillStyle = 'rgba(60,35,12,.5)'; ctx.beginPath();                                 // butt sleeve
      ctx.arc(buttX, buttY, wb, 0, 7); ctx.fill();
    }
    // balls
    for (const b of balls.current) {
      if (!b.alive) continue;
      ctx.save(); ctx.beginPath(); ctx.arc(b.x, b.y, R, 0, 7); ctx.clip();
      // base color
      ctx.fillStyle = b.stripe ? '#f4f2ea' : b.color; ctx.fillRect(b.x - R, b.y - R, R * 2, R * 2);
      // stripe band
      if (b.stripe) { ctx.fillStyle = b.color; ctx.fillRect(b.x - R, b.y - R * .5, R * 2, R); }
      // ball surface gloss
      const sh = ctx.createRadialGradient(b.x - 4, b.y - 5, 1, b.x, b.y, R * 1.15);
      sh.addColorStop(0, 'rgba(255,255,255,.5)'); sh.addColorStop(.25, 'rgba(255,255,255,.08)'); sh.addColorStop(.7, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.35)');
      ctx.fillStyle = sh; ctx.fillRect(b.x - R, b.y - R, R * 2, R * 2);
      ctx.restore();
      // number disc
      if (b.num > 0) {
        ctx.beginPath(); ctx.arc(b.x, b.y, 5.4, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
        ctx.fillStyle = '#1a1a1a'; ctx.font = 'bold 8px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(String(b.num), b.x, b.y + 0.5);
      }
      // highlight dot
      ctx.beginPath(); ctx.arc(b.x - 3.6, b.y - 4, 2.4, 0, 7); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill();
    }
  }

  useEffect(() => {
    const wrap = wrapRef.current!, cv = canvasRef.current!; const ctx = cv.getContext('2d')!;
    let raf = 0;
    const resize = () => {
      const r = wrap.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
      size.current = { w: r.width, h: r.height };
      cv.width = r.width * dpr; cv.height = r.height * dpr; cv.style.width = r.width + 'px'; cv.style.height = r.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (balls.current.length === 0) rack();
    };
    const ro = new ResizeObserver(resize); ro.observe(wrap); resize();
    const loop = () => { step(); draw(ctx); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const relPos = (e: React.PointerEvent) => { const r = canvasRef.current!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function onDown(e: React.PointerEvent) {
    if (moving()) return; const cue = balls.current[0]; if (!cue?.alive) return;
    const p = relPos(e);
    aim.current = { active: true, x: p.x, y: p.y }; (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setPower(0);
  }
  function onMove(e: React.PointerEvent) {
    if (!aim.current.active) return; const p = relPos(e); aim.current.x = p.x; aim.current.y = p.y;
    const cue = balls.current[0]; const d = Math.hypot(cue.x - p.x, cue.y - p.y);
    setPower(Math.min(100, Math.round(Math.min(MAX_POWER, d / 8) / MAX_POWER * 100)));
  }
  function onUp() {
    if (!aim.current.active) return; aim.current.active = false;
    const cue = balls.current[0]; const dx = cue.x - aim.current.x, dy = cue.y - aim.current.y;
    const p = Math.min(MAX_POWER, Math.hypot(dx, dy) / 8), len = Math.hypot(dx, dy) || 1;
    if (p > 0.6) { cue.vx = (dx / len) * p; cue.vy = (dy / len) * p; }
    setPower(0);
  }

  return (
    <div className="pool-root">
      <div className="pool-hud">
        <div className="pool-score"><span className="pool-score-lbl">POTTED</span><b>{potted}</b><span className="pool-score-sep">/</span><span className="pool-score-tot">15</span></div>
        <div className="pool-power"><i style={{ width: `${power}%` }} /></div>
        <button className="pool-reset" onClick={rack}>Reset</button>
      </div>
      <div className="pool-table" ref={wrapRef}>
        <canvas ref={canvasRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} />
        <div className={`pool-toast${toast ? ' show' : ''}`}>{toast}</div>
        {won && <div className="pool-win"><div>🏆 Table cleared!</div><button onClick={rack}>Play again</button></div>}
      </div>
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
