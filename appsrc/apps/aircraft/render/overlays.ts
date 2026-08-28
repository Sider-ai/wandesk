// 飞机大战 — HUD、横幅与各状态面板(菜单 / 暂停 / 结算)。
import { cl, MAX_WAVE } from '../lib/constants';
import { T } from '../lib/text';
import type { Banner, GS } from '../lib/types';

export function drawHud(ctx: CanvasRenderingContext2D, g: GS, W: number, H: number) {
  ctx.save();
  ctx.textBaseline = 'alphabetic';
  const scrim = ctx.createLinearGradient(0, 0, 0, 64);
  scrim.addColorStop(0, 'rgba(2,2,10,0.55)'); scrim.addColorStop(1, 'transparent');
  ctx.fillStyle = scrim; ctx.fillRect(0, 0, W, 64);

  // SCORE
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(150,225,255,0.6)'; ctx.font = '10px ui-monospace, monospace';
  ctx.fillText(T.hudScore, 16, 22);
  ctx.fillStyle = '#eaffff'; ctx.font = 'bold 24px ui-monospace, monospace';
  ctx.shadowColor = '#3fd0ff'; ctx.shadowBlur = 8;
  ctx.fillText(`${g.sc}`, 16, 46); ctx.shadowBlur = 0;

  // COMBO
  if (g.cmb > 1) {
    const ci = cl(g.cmb / 16, 0, 1);
    const cr = 255, cg = (225 - ci * 150) | 0, cb = (70 + ci * 30) | 0;
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(${cr},${cg},${cb},0.85)`; ctx.font = '10px ui-monospace, monospace';
    ctx.fillText(T.hudCombo, W / 2, 22);
    const sz = 22 + Math.min(g.cmb, 12) * 1.4;
    ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
    ctx.font = `bold ${sz}px ui-monospace, monospace`;
    ctx.shadowColor = `rgb(${cr},${cg},${cb})`; ctx.shadowBlur = 8 + g.cmb;
    ctx.fillText(`×${g.cmb}`, W / 2, 48); ctx.shadowBlur = 0;
    const bw = 70, bx = W / 2 - bw / 2;
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(bx, 54, bw, 3);
    ctx.fillStyle = `rgb(${cr},${cg},${cb})`; ctx.fillRect(bx, 54, bw * cl(g.cmbt / 2.6, 0, 1), 3);
  }

  // WAVE
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(150,225,255,0.6)'; ctx.font = '10px ui-monospace, monospace';
  ctx.fillText(T.hudWave, W - 16, 22);
  ctx.fillStyle = '#cfeeff'; ctx.font = 'bold 18px ui-monospace, monospace';
  ctx.fillText(`${g.wav} / ${MAX_WAVE}`, W - 16, 44);

  // LIVES — neon pips
  const pipR = 5, gap = 16, ly = H - 18;
  for (let i = 0; i < g.p.mhp; i++) {
    const lx = 18 + i * gap, on = i < g.p.hp;
    ctx.beginPath();
    ctx.moveTo(lx, ly - pipR); ctx.lineTo(lx + pipR, ly); ctx.lineTo(lx, ly + pipR); ctx.lineTo(lx - pipR, ly); ctx.closePath();
    if (on) { ctx.fillStyle = '#ff4d7a'; ctx.shadowColor = '#ff4d7a'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0; }
    else { ctx.strokeStyle = 'rgba(255,77,122,0.3)'; ctx.lineWidth = 1; ctx.stroke(); }
  }

  // power-up tags
  const p = g.p;
  if (p.fm !== 'normal' || p.sh) {
    let tagY = H - 16;
    const drawTag = (label: string, frac: number, col: string) => {
      ctx.textAlign = 'right';
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 6;
      ctx.fillText(label, W - 16, tagY); ctx.shadowBlur = 0;
      const bw = 56, bx = W - 16 - bw;
      ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(bx, tagY + 4, bw, 3);
      ctx.fillStyle = col; ctx.fillRect(bx, tagY + 4, bw * cl(frac, 0, 1), 3);
      tagY -= 22;
    };
    if (p.fm === 'spread') drawTag(T.tagSpread, p.fmt / 9, '#5aa6ff');
    if (p.fm === 'rapid') drawTag(T.tagRapid, p.fmt / 8, '#ffd24a');
    if (p.sh) drawTag(T.tagShield, p.sht / 12, '#5effaa');
  }
  ctx.restore();
}

export function drawBanner(ctx: CanvasRenderingContext2D, b: Banner, W: number, H: number) {
  const a = cl(b.life / (b.ml * 0.4), 0, 1) * cl((b.ml - b.life) / 0.2, 0, 1);
  ctx.save(); ctx.textAlign = 'center';
  ctx.globalAlpha = a;
  if (b.big) {
    ctx.fillStyle = b.c; ctx.shadowColor = b.c; ctx.shadowBlur = 24;
    ctx.font = 'bold 40px ui-monospace, monospace';
    const yy = H * 0.34;
    ctx.fillText(b.big, W / 2, yy);
    ctx.shadowBlur = 0; ctx.globalAlpha = a * 0.5;
    ctx.fillRect(W / 2 - 70, yy + 12, 140, 2);
    ctx.globalAlpha = a;
  }
  if (b.sub) {
    ctx.fillStyle = b.c; ctx.shadowColor = b.c; ctx.shadowBlur = 14;
    ctx.font = 'bold 18px ui-monospace, monospace';
    ctx.fillText(b.sub, W / 2, H * 0.34 + (b.big ? 36 : 0));
  }
  ctx.restore();
}

function panelScrim(ctx: CanvasRenderingContext2D, W: number, H: number, alpha: number) {
  ctx.fillStyle = `rgba(3,3,12,${alpha})`;
  ctx.fillRect(0, 0, W, H);
}

export function drawMenu(ctx: CanvasRenderingContext2D, g: GS, W: number, H: number, hi: number) {
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  panelScrim(ctx, W, H, 0.55);
  const fy = Math.sin(g.t * 1.4) * 4;
  const tx = W / 2, ty = H * 0.28 + fy;
  ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 44;
  ctx.fillStyle = '#eafcff'; ctx.font = `bold ${Math.min(52, W * 0.12)}px ui-monospace, monospace`;
  ctx.fillText(T.title, tx, ty);
  ctx.shadowColor = '#ff3a8c'; ctx.shadowBlur = 18; ctx.globalAlpha = 0.35;
  ctx.fillText(T.title, tx + 2, ty + 2);
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(120,225,255,0.5)'; ctx.font = '12px ui-monospace, monospace';
  ctx.fillText(T.subtitle, tx, ty + 30);
  const cardY = H * 0.46, lh = 22;
  ctx.fillStyle = 'rgba(120,225,255,0.85)'; ctx.font = 'bold 12px ui-monospace, monospace';
  ctx.fillText(T.howtoTitle, tx, cardY - 8);
  ctx.fillStyle = 'rgba(220,240,255,0.7)'; ctx.font = '13px ui-monospace, monospace';
  ctx.fillText(T.howtoMove, tx, cardY + lh);
  ctx.fillText(T.howtoFire, tx, cardY + lh * 2);
  ctx.fillStyle = 'rgba(180,210,235,0.5)'; ctx.font = '12px ui-monospace, monospace';
  ctx.fillText(T.howtoAuto, tx, cardY + lh * 3);
  ctx.fillText(T.howtoPause, tx, cardY + lh * 4);
  const blink = 0.4 + (Math.sin(g.t * 4) + 1) * 0.3;
  ctx.fillStyle = `rgba(0,212,255,${blink})`; ctx.font = 'bold 17px ui-monospace, monospace';
  ctx.shadowColor = '#00d4ff'; ctx.shadowBlur = 12 * blink;
  ctx.fillText(T.startHint, tx, H * 0.82);
  ctx.shadowBlur = 0;
  if (hi > 0) {
    ctx.fillStyle = 'rgba(255,220,70,0.7)'; ctx.font = '13px ui-monospace, monospace';
    ctx.fillText(`${T.hiscore}  ${hi}`, tx, H * 0.9);
  }
  ctx.restore();
}

export function drawPause(ctx: CanvasRenderingContext2D, g: GS, W: number, H: number) {
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  panelScrim(ctx, W, H, 0.6);
  ctx.shadowColor = '#7fe0ff'; ctx.shadowBlur = 22;
  ctx.fillStyle = '#eafcff'; ctx.font = 'bold 34px ui-monospace, monospace';
  ctx.fillText(T.paused, W / 2, H * 0.42);
  ctx.shadowBlur = 0;
  const blink = 0.4 + (Math.sin(g.t * 4) + 1) * 0.3;
  ctx.fillStyle = `rgba(127,224,255,${blink})`; ctx.font = '15px ui-monospace, monospace';
  ctx.fillText(T.resumeHint, W / 2, H * 0.54);
  ctx.fillStyle = 'rgba(200,225,245,0.4)'; ctx.font = '12px ui-monospace, monospace';
  ctx.fillText(T.howtoMove, W / 2, H * 0.62);
  ctx.restore();
}

export function drawOver(ctx: CanvasRenderingContext2D, g: GS, W: number, H: number, hi: number, win: boolean) {
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  panelScrim(ctx, W, H, win ? 0.55 : 0.6);
  const tx = W / 2;
  const accent = win ? '#5effc8' : '#ff5577';
  ctx.shadowColor = accent; ctx.shadowBlur = 28;
  ctx.fillStyle = accent; ctx.font = `bold ${Math.min(40, W * 0.1)}px ui-monospace, monospace`;
  ctx.fillText(win ? T.victory : T.gameover, tx, H * 0.26);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(180,210,235,0.6)'; ctx.font = '11px ui-monospace, monospace';
  ctx.fillText(T.finalScore, tx, H * 0.37);
  ctx.fillStyle = '#eafcff'; ctx.font = 'bold 32px ui-monospace, monospace';
  ctx.shadowColor = '#3fd0ff'; ctx.shadowBlur = 10;
  ctx.fillText(`${g.sc}`, tx, H * 0.44); ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(200,225,245,0.45)'; ctx.font = '12px ui-monospace, monospace';
  ctx.fillText(`${T.reachedWave} ${g.wav}    ·    ${T.maxCombo} ×${g.maxCmb || 1}`, tx, H * 0.52);
  if (win && !g.tookHit) {
    ctx.fillStyle = '#ffe24a'; ctx.shadowColor = '#ffe24a'; ctx.shadowBlur = 12;
    ctx.font = 'bold 15px ui-monospace, monospace';
    ctx.fillText(T.perfect, tx, H * 0.585); ctx.shadowBlur = 0;
  } else if (g.sc > 0 && g.sc >= hi) {
    ctx.fillStyle = '#ffe24a'; ctx.shadowColor = '#ffe24a'; ctx.shadowBlur = 12;
    ctx.font = 'bold 15px ui-monospace, monospace';
    ctx.fillText(T.newRecord, tx, H * 0.585); ctx.shadowBlur = 0;
  }
  const blink = 0.35 + (Math.sin(g.t * 4) + 1) * 0.3;
  ctx.fillStyle = `rgba(255,255,255,${blink})`; ctx.font = 'bold 15px ui-monospace, monospace';
  ctx.fillText(T.againHint, tx, H * 0.72);
  ctx.restore();
}
