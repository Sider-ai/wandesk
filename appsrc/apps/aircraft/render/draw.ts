// 飞机大战 — 每帧渲染:背景/星野/粒子/掉落/敌机/子弹/战机/飘字/闪白/HUD/面板。
import { cl, DROP_COL, DROP_GLYPH, rng, TAU } from '../lib/constants';
import type { GS } from '../lib/types';
import { drawEnemy, drawShip } from './ship';
import { drawBanner, drawHud, drawMenu, drawOver, drawPause } from './overlays';

export function draw(ctx: CanvasRenderingContext2D, g: GS, W: number, H: number, hi: number) {
  ctx.save();
  if (g.shk > 0.4) {
    const a = rng() * TAU, m = g.shk;
    ctx.translate(Math.cos(a) * m, Math.sin(a) * m);
  }

  // deep-space background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#04030f'); bg.addColorStop(0.55, '#070414'); bg.addColorStop(1, '#0a0418');
  ctx.fillStyle = bg;
  ctx.fillRect(-20, -20, W + 40, H + 40);

  // drifting nebulae
  const n1y = (g.t * 8) % (H + 300) - 150;
  const neb = (cx: number, cy: number, rad: number, col: string) => {
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    grd.addColorStop(0, col); grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
  };
  neb(W * 0.28, n1y, W * 0.55, 'rgba(60,30,110,0.22)');
  neb(W * 0.78, (n1y + H * 0.6) % (H + 300) - 150, W * 0.5, 'rgba(20,60,120,0.18)');

  // parallax stars
  for (const s of g.sta) {
    const tw = s.sz > 1.4 ? 0.7 + Math.sin(g.t * 3 + s.x) * 0.3 : 1;
    ctx.globalAlpha = s.b * tw;
    ctx.fillStyle = `rgb(${s.r},${s.g},${s.b2})`;
    if (s.sz > 1.4) {
      ctx.shadowColor = `rgb(${s.r},${s.g},${s.b2})`; ctx.shadowBlur = 4;
      ctx.fillRect(s.x - s.sz / 2, s.y - s.sz / 2, s.sz, s.sz);
      ctx.shadowBlur = 0;
    } else ctx.fillRect(s.x, s.y, s.sz, s.sz);
  }
  ctx.globalAlpha = 1;

  // particles
  for (const pt of g.par) {
    const a = cl(pt.life / pt.ml, 0, 1);
    if (pt.kind === 'ring') {
      const pr = 1 - a, rd = pt.sz * pr;
      ctx.strokeStyle = `rgba(${pt.r},${pt.g},${pt.b},${(a * 0.7).toFixed(3)})`;
      ctx.lineWidth = 3 * a + 0.5;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, rd, 0, TAU); ctx.stroke();
    } else if (pt.kind === 'smoke') {
      ctx.globalAlpha = a * 0.18;
      ctx.fillStyle = `rgb(${pt.r},${pt.g},${pt.b})`;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.sz, 0, TAU); ctx.fill();
    } else if (pt.kind === 'glow') {
      ctx.globalAlpha = a * 0.6;
      ctx.shadowColor = `rgb(${pt.r},${pt.g},${pt.b})`; ctx.shadowBlur = pt.sz;
      ctx.fillStyle = `rgb(${pt.r},${pt.g},${pt.b})`;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.sz * 0.5 * (0.4 + a * 0.6), 0, TAU); ctx.fill();
      ctx.shadowBlur = 0;
    } else if (pt.kind === 'shard') {
      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${pt.r},${pt.g},${pt.b})`;
      ctx.save(); ctx.translate(pt.x, pt.y); ctx.rotate(pt.rot || 0);
      ctx.fillRect(-pt.sz / 2, -pt.sz / 4, pt.sz, pt.sz / 2);
      ctx.restore();
    } else {
      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${pt.r},${pt.g},${pt.b})`;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.sz * (0.4 + a * 0.6), 0, TAU); ctx.fill();
    }
  }
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;

  // drops
  for (const d of g.drp) {
    const col = DROP_COL[d.kind], bob = Math.sin(d.ph * 4) * 2;
    ctx.save();
    ctx.translate(d.x, d.y + bob);
    ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${0.4 + Math.sin(d.ph * 5) * 0.2})`;
    ctx.lineWidth = 2; ctx.shadowColor = `rgb(${col[0]},${col[1]},${col[2]})`; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, TAU); ctx.stroke();
    ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
    ctx.beginPath(); ctx.arc(0, 0, 9, 0, TAU); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 12px ui-monospace, monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(DROP_GLYPH[d.kind], 0, 0.5);
    ctx.restore();
  }
  ctx.textBaseline = 'alphabetic';

  for (const e of g.ene) drawEnemy(ctx, e, g.t);

  // bullets
  for (const b of g.bul) {
    ctx.save();
    ctx.shadowColor = `rgb(${b.r},${b.g},${b.b})`; ctx.shadowBlur = b.own ? 12 : 9;
    ctx.fillStyle = `rgb(${b.r},${b.g},${b.b})`;
    if (b.kind === 'rail') {
      ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);
      ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.85;
      ctx.fillRect(b.x - b.w / 4, b.y - b.h / 2, b.w / 2, b.h);
      ctx.globalAlpha = 0.22; ctx.fillStyle = `rgb(${b.r},${b.g},${b.b})`;
      ctx.fillRect(b.x - b.w / 2, b.y + (b.own ? b.h / 2 : -b.h * 1.5), b.w, b.h * 1.2);
    } else {
      ctx.beginPath(); ctx.arc(b.x, b.y, b.w, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.7;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.w * 0.45, 0, TAU); ctx.fill();
      ctx.globalAlpha = 0.18; ctx.fillStyle = `rgb(${b.r},${b.g},${b.b})`;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.w * 2.4, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  // player
  if (g.st === 'play' || g.st === 'pause' || g.st === 'win') {
    const p = g.p;
    const vis = p.inv <= 0 || ((g.t * 16) | 0) % 2 === 0;
    if (vis) drawShip(ctx, p, g.t);
  }

  // floats
  for (const f of g.flt) {
    const a = cl(f.life / (f.ml * 0.6), 0, 1);
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = f.c; ctx.font = `bold ${f.sz}px ui-monospace, monospace`; ctx.textAlign = 'center';
    ctx.shadowColor = f.c; ctx.shadowBlur = 8;
    ctx.fillText(f.t, f.x, f.y); ctx.restore();
  }
  ctx.shadowBlur = 0;

  // hit / power flash
  if (g.fl > 0.01) {
    ctx.fillStyle = `rgba(${g.flr},${g.flg},${g.flb},${cl(g.fl, 0, 0.85).toFixed(3)})`;
    ctx.fillRect(-20, -20, W + 40, H + 40);
  }

  // low-health red vignette
  if (g.vig > 0.01) {
    const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
    vg.addColorStop(0, 'transparent');
    vg.addColorStop(1, `rgba(255,30,50,${(g.vig * (0.6 + Math.sin(g.t * 4) * 0.15)).toFixed(3)})`);
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }

  // scanlines + edge vignette
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
  const ev = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H * 0.85);
  ev.addColorStop(0, 'transparent'); ev.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = ev; ctx.fillRect(0, 0, W, H);

  ctx.restore(); // end shake — HUD/overlays are screen-fixed

  if (g.st === 'play' || g.st === 'pause') drawHud(ctx, g, W, H);
  if (g.banner && (g.banner.big || g.banner.sub)) drawBanner(ctx, g.banner, W, H);
  if (g.st === 'menu') drawMenu(ctx, g, W, H, hi);
  else if (g.st === 'pause') drawPause(ctx, g, W, H);
  else if (g.st === 'over') drawOver(ctx, g, W, H, hi, false);
  else if (g.st === 'win') drawOver(ctx, g, W, H, hi, true);
}
