// Aircraft — canvas drawing for the player ship and enemy ships.
import { C, cl, PH, PW, TAU } from '../lib/constants';
import type { Enemy, Player } from '../lib/types';

export function drawShip(ctx: CanvasRenderingContext2D, p: Player, t: number) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.bank);
  const [r, gc, b] = C.p;
  ctx.shadowColor = `rgb(${r},${gc},${b})`; ctx.shadowBlur = 22;
  const grd = ctx.createLinearGradient(0, -PH / 2, 0, PH / 2);
  grd.addColorStop(0, `rgb(${C.pcore[0]},${C.pcore[1]},${C.pcore[2]})`);
  grd.addColorStop(0.5, `rgb(${r},${gc},${b})`);
  grd.addColorStop(1, `rgb(${(r * 0.45) | 0},${(gc * 0.5) | 0},${(b * 0.6) | 0})`);
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(0, -PH / 2);
  ctx.lineTo(PW * 0.14, -PH * 0.1);
  ctx.lineTo(PW / 2, PH * 0.34);
  ctx.lineTo(PW * 0.2, PH * 0.16);
  ctx.lineTo(PW * 0.12, PH / 2);
  ctx.lineTo(-PW * 0.12, PH / 2);
  ctx.lineTo(-PW * 0.2, PH * 0.16);
  ctx.lineTo(-PW / 2, PH * 0.34);
  ctx.lineTo(-PW * 0.14, -PH * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0; ctx.strokeStyle = `rgba(${C.pcore[0]},${C.pcore[1]},${C.pcore[2]},0.9)`; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = 'rgba(210,250,255,0.85)'; ctx.shadowColor = '#bfeeff'; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.ellipse(0, -PH * 0.06, PW * 0.09, PH * 0.13, 0, 0, TAU); ctx.fill();
  ctx.shadowBlur = 0; ctx.fillStyle = `rgba(150,235,255,${0.5 + Math.sin(t * 18) * 0.25})`;
  ctx.beginPath(); ctx.ellipse(0, PH * 0.42, PW * 0.12, PH * 0.08, 0, 0, TAU); ctx.fill();
  if (p.sh) {
    const pulse = 0.32 + Math.sin(t * 6) * 0.12;
    ctx.strokeStyle = `rgba(90,255,180,${pulse})`; ctx.lineWidth = 2;
    ctx.shadowColor = '#4dffa0'; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.arc(0, 0, PW * 0.92, 0, TAU); ctx.stroke();
    ctx.globalAlpha = 0.08; ctx.fillStyle = '#4dffa0';
    ctx.beginPath(); ctx.arc(0, 0, PW * 0.92, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

export function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, t: number) {
  const c = C[e.kind];
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.shadowColor = `rgb(${c[0]},${c[1]},${c[2]})`; ctx.shadowBlur = e.kind === 'boss' ? 26 : 13;
  ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
  if (e.kind === 'scout') {
    ctx.beginPath();
    ctx.moveTo(0, e.h / 2); ctx.lineTo(e.w / 2, -e.h * 0.1); ctx.lineTo(0, -e.h / 2); ctx.lineTo(-e.w / 2, -e.h * 0.1);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(0, -e.h * 0.05, 2.4, 0, TAU); ctx.fill();
  } else if (e.kind === 'fighter') {
    ctx.beginPath();
    ctx.moveTo(0, e.h / 2);
    ctx.lineTo(e.w / 2, -e.h * 0.36);
    ctx.lineTo(e.w * 0.18, -e.h * 0.5);
    ctx.lineTo(0, -e.h * 0.2);
    ctx.lineTo(-e.w * 0.18, -e.h * 0.5);
    ctx.lineTo(-e.w / 2, -e.h * 0.36);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.shadowBlur = 0;
    ctx.fillRect(-1.6, -e.h * 0.1, 3.2, e.h * 0.4);
  } else if (e.kind === 'bomber') {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + 0.52; ctx.lineTo(Math.cos(a) * e.w / 2, Math.sin(a) * e.h / 2); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(0, 0, e.w * 0.18, 0, TAU); ctx.fill();
  } else {
    // ── BOSS: layered dreadnought ──
    const pulse = 0.5 + Math.sin(t * 4) * 0.5;
    ctx.fillStyle = `rgb(${(c[0] * 0.7) | 0},${(c[1] * 0.7) | 0},${(c[2] * 0.7) | 0})`;
    ctx.beginPath();
    ctx.moveTo(-e.w * 0.5, -e.h * 0.05); ctx.lineTo(-e.w * 0.32, e.h * 0.2); ctx.lineTo(-e.w * 0.1, e.h * 0.1);
    ctx.lineTo(e.w * 0.1, e.h * 0.1); ctx.lineTo(e.w * 0.32, e.h * 0.2); ctx.lineTo(e.w * 0.5, -e.h * 0.05);
    ctx.lineTo(e.w * 0.3, -e.h * 0.35); ctx.lineTo(-e.w * 0.3, -e.h * 0.35);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
    ctx.beginPath();
    ctx.moveTo(0, e.h / 2);
    ctx.lineTo(e.w * 0.26, e.h * 0.1);
    ctx.lineTo(e.w * 0.22, -e.h * 0.3);
    ctx.lineTo(0, -e.h / 2);
    ctx.lineTo(-e.w * 0.22, -e.h * 0.3);
    ctx.lineTo(-e.w * 0.26, e.h * 0.1);
    ctx.closePath(); ctx.fill();
    ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 14 + pulse * 14;
    ctx.fillStyle = `rgba(255,255,255,${0.7 + pulse * 0.3})`;
    ctx.beginPath(); ctx.arc(0, -e.h * 0.04, 5 + pulse * 2.5, 0, TAU); ctx.fill();
    ctx.fillStyle = `rgba(255,${120 + pulse * 100},${140 + pulse * 60},0.9)`;
    ctx.beginPath(); ctx.arc(0, -e.h * 0.04, 3 + pulse * 1.5, 0, TAU); ctx.fill();
    ctx.shadowBlur = 0;
    const bw = e.w * 0.9, bx = -bw / 2, by = -e.h / 2 - 14, frac = cl(e.hp / e.mhp, 0, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(bx - 1, by - 1, bw + 2, 7);
    ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(bx, by, bw, 5);
    const hg = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    hg.addColorStop(0, '#ff3355'); hg.addColorStop(1, '#ff88aa');
    ctx.fillStyle = hg; ctx.fillRect(bx, by, bw * frac, 5);
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(bx, by, bw * frac, 2);
  }
  if (e.flash > 0) {
    ctx.globalAlpha = cl(e.flash / 0.08, 0, 1) * 0.85; ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, Math.max(e.w, e.h) * 0.55, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
