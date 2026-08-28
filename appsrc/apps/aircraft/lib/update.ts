// 飞机大战 — 每帧推进:移动、开火、计时、敌机 AI、碰撞、拾取、波次流转与胜负。
import { BASE_FR, BOSS_EVERY, C, cl, DROP_COL, lerp, MAX_WAVE, PH, PS, PU_TEXT, PW, RAPID_FR, rng, TAU } from './constants';
import { boom, flash, glow, popFloat, ring, showBanner, smoke, spark } from './fx';
import { spawnWave } from './state';
import { T } from './text';
import type { DKind, GS } from './types';

function hit(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax - aw / 2 < bx + bw / 2 && ax + aw / 2 > bx - bw / 2 && ay - ah / 2 < by + bh / 2 && ay + ah / 2 > by - bh / 2;
}

export function upd(g: GS, dt: number, W: number, H: number, keys: Set<string>) {
  if (g.slow > 0) { g.slow -= dt; dt *= 0.28; }
  g.t += dt; g.hue += dt * 30;
  const p = g.p;

  // ── movement (keyboard only — the mouse stays free for the desktop) ──
  let dx = 0, dy = 0;
  if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) dx--;
  if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) dx++;
  if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) dy--;
  if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) dy++;
  let moved = false;
  if (dx || dy) {
    const l = Math.hypot(dx, dy);
    p.x = cl(p.x + (dx / l) * PS * dt, PW / 2, W - PW / 2);
    p.y = cl(p.y + (dy / l) * PS * dt, PH / 2, H - PH / 2);
    moved = true;
  }
  const wantBank = cl(dx * 0.34, -0.34, 0.34); // ship tilts as it strafes
  p.bank = lerp(p.bank, moved ? wantBank : 0, dt * 10);

  // ── fire ──
  p.fcd -= dt;
  if (p.fcd <= 0 && g.st === 'play') {
    const [r, gc, b] = C.pb;
    if (p.fm === 'spread') {
      p.fcd = BASE_FR * 1.15;
      for (const a of [-0.26, -0.13, 0, 0.13, 0.26])
        g.bul.push({ x: p.x, y: p.y - PH / 2, vx: Math.sin(a) * 360, vy: -560, w: 3.5, h: 11, own: true, dmg: 1, r, g: gc, b, kind: 'rail', t: 0 });
    } else if (p.fm === 'rapid') {
      p.fcd = RAPID_FR;
      for (const ox of [-7, 7])
        g.bul.push({ x: p.x + ox, y: p.y - PH / 2, vx: 0, vy: -660, w: 3, h: 13, own: true, dmg: 1, r, g: gc, b, kind: 'rail', t: 0 });
    } else {
      p.fcd = BASE_FR;
      for (const ox of [-6, 6])
        g.bul.push({ x: p.x + ox, y: p.y - PH / 2, vx: 0, vy: -600, w: 3.5, h: 13, own: true, dmg: 1, r, g: gc, b, kind: 'rail', t: 0 });
    }
    spark(g, p.x, p.y - PH / 2, 3, 60, 200, 245, 255, 1.2); // muzzle flash
    glow(g, p.x, p.y - PH / 2, 14, 150, 235, 255, 0.12);
  }

  // ── timers ──
  if (p.inv > 0) p.inv -= dt;
  if (p.fmt > 0) { p.fmt -= dt; if (p.fmt <= 0) p.fm = 'normal'; }
  if (p.sht > 0) { p.sht -= dt; if (p.sht <= 0) p.sh = false; }
  if (g.cmbt > 0) { g.cmbt -= dt; if (g.cmbt <= 0) g.cmb = 0; }
  g.shk *= 0.86; g.fl *= 0.84;
  g.vig = lerp(g.vig, p.hp <= 1 ? 0.55 : p.hp <= 2 ? 0.28 : 0, dt * 4); // low-health red vignette
  if (g.banner) { g.banner.life -= dt; if (g.banner.life <= 0) g.banner = null; }

  // ── engine trail + wing sparks ──
  const thrust = 1 + (moved ? 0.7 : 0);
  for (let i = 0; i < 2; i++)
    g.par.push({ x: p.x + (rng() - 0.5) * 9, y: p.y + PH / 2, vx: (rng() - 0.5) * 22 - p.bank * 60, vy: (80 + rng() * 90) * thrust, life: 0.16 + rng() * 0.16, ml: 0.32, sz: (2.4 + rng() * 2.6) * thrust, r: 80, g: 200, b: 255, kind: 'glow' });
  if (rng() < 0.25) {
    const side = rng() < 0.5 ? -1 : 1;
    g.par.push({ x: p.x + side * PW * 0.42, y: p.y + PH * 0.2, vx: side * (12 + rng() * 16), vy: 26 + rng() * 18, life: 0.14, ml: 0.2, sz: 1 + rng(), r: 160, g: 240, b: 255, kind: 'spark' });
  }

  // ── parallax stars ──
  const sm = g.slow > 0 ? 1.6 : 1;
  for (const s of g.sta) { s.y += s.s * dt * sm; if (s.y > H + 2) { s.y = -2; s.x = rng() * W; } }

  // ── bullets ──
  for (const b of g.bul) { b.x += b.vx * dt; b.y += b.vy * dt; b.t += dt; }
  g.bul = g.bul.filter(b => b.y > -40 && b.y < H + 40 && b.x > -40 && b.x < W + 40);

  updEnemies(g, dt, W, H);

  // ── drops ──
  for (const d of g.drp) { d.y += d.vy * dt; d.ph += dt; }
  g.drp = g.drp.filter(d => d.y < H + 24);

  // ── particles ──
  for (const pt of g.par) {
    pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.life -= dt;
    if (pt.kind === 'spark' || pt.kind === 'glow') { pt.vx *= 0.96; pt.vy *= 0.96; }
    else if (pt.kind === 'shard') { pt.vy += (pt.grav || 0) * dt; pt.vx *= 0.99; if (pt.rot !== undefined) pt.rot += (pt.vr || 0) * dt; }
    else if (pt.kind === 'smoke') { pt.vx *= 0.94; pt.vy *= 0.94; pt.sz += 14 * dt; }
  }
  if (g.par.length > 900) g.par.splice(0, g.par.length - 900);
  g.par = g.par.filter(pt => pt.life > 0);

  // ── floats ──
  for (const f of g.flt) { f.y += f.vy * dt; f.vy *= 0.94; f.life -= dt; }
  g.flt = g.flt.filter(f => f.life > 0);

  updHits(g);
  updPlayerHits(g, dt);
  updPickups(g);
  updWaveFlow(g, dt, W, H);
}

// ── enemy movement + firing ──
function updEnemies(g: GS, dt: number, W: number, H: number) {
  const p = g.p;
  for (const e of g.ene) {
    if (e.flash > 0) e.flash -= dt;
    if (e.entering) {
      e.y += (e.ty - e.y) * dt * 2.6;
      if (Math.abs(e.y - e.ty) < 3) e.entering = false;
      continue;
    }
    e.ph += dt;
    if (e.kind === 'scout') { e.y += e.spd * dt; e.x += Math.sin(e.ph * 3 + e.seed) * 80 * dt; }
    else if (e.kind === 'boss') { e.x += Math.sin(e.ph * 0.6) * 100 * dt; e.y = e.ty + Math.sin(e.ph * 0.45) * 22; }
    else { e.y += e.spd * dt * 0.32; e.x += Math.sin(e.ph * 2 + e.seed) * 52 * dt; }
    e.x = cl(e.x, e.w / 2, W - e.w / 2);

    e.t -= dt;
    if (e.t <= 0 && e.kind !== 'scout') {
      const [r, gc, b] = e.kind === 'boss' ? C.ebBoss : C.eb;
      if (e.kind === 'boss') {
        e.t = e.fr;
        const phase = (g.t * 0.5) | 0;
        if (phase % 2 === 0) { // aimed fan
          const ba = Math.atan2(p.y - e.y, p.x - e.x);
          for (let i = -3; i <= 3; i++) {
            const a = ba + i * 0.17;
            g.bul.push({ x: e.x, y: e.y + e.h / 2, vx: Math.cos(a) * 210, vy: Math.sin(a) * 210, w: 5.5, h: 5.5, own: false, dmg: 1, r, g: gc, b, kind: 'orb', t: 0 });
          }
        } else { // spiral spray
          for (let i = 0; i < 10; i++) {
            const a = (g.t * 2.2) + i * (TAU / 10);
            g.bul.push({ x: e.x, y: e.y, vx: Math.cos(a) * 150, vy: Math.sin(a) * 150 + 60, w: 5, h: 5, own: false, dmg: 1, r, g: gc, b, kind: 'orb', t: 0 });
          }
        }
        spark(g, e.x, e.y + e.h / 2, 5, 70, r, gc, b, 1.5);
      } else if (e.kind === 'bomber') {
        e.t = e.fr;
        for (const a of [-0.32, 0, 0.32])
          g.bul.push({ x: e.x, y: e.y + e.h / 2, vx: Math.sin(a) * 90, vy: 190, w: 5.5, h: 5.5, own: false, dmg: 1, r, g: gc, b, kind: 'orb', t: 0 });
      } else {
        e.t = e.fr;
        g.bul.push({ x: e.x, y: e.y + e.h / 2, vx: 0, vy: 230, w: 4.5, h: 9, own: false, dmg: 1, r, g: gc, b, kind: 'rail', t: 0 });
      }
    }
  }
  g.ene = g.ene.filter(e => e.y < H + 80 && e.x > -80 && e.x < W + 80);
}

// ── player bullets → enemies ──
function updHits(g: GS) {
  for (const b of g.bul) {
    if (!b.own) continue;
    for (const e of g.ene) {
      if (e.entering && e.kind !== 'boss') continue;
      if (hit(b.x, b.y, b.w, b.h, e.x, e.y, e.w * 0.9, e.h * 0.9)) {
        b.dmg = 0;
        e.hp--; e.flash = 0.08;
        spark(g, b.x, b.y - 2, 4, 70, 255, 220, 130, 1.3);
        glow(g, b.x, b.y, 9, 255, 230, 160, 0.1);
        if (e.hp <= 0) {
          const pw = e.kind === 'boss' ? 5 : e.kind === 'bomber' ? 2.4 : e.kind === 'fighter' ? 1.5 : 1;
          boom(g, e.x, e.y, pw, C[e.kind]);
          g.cmb++; g.cmbt = 2.6; g.maxCmb = Math.max(g.maxCmb, g.cmb);
          const basePts = e.kind === 'boss' ? 600 : e.kind === 'bomber' ? 55 : e.kind === 'fighter' ? 30 : 10;
          const pts = (basePts * Math.max(1, g.cmb)) | 0;
          g.sc += pts;
          popFloat(g, e.x, e.y - 14, g.cmb > 1 ? `+${pts}  ×${g.cmb}` : `+${pts}`, g.cmb > 6 ? '#ffe24a' : g.cmb > 2 ? '#7fe0ff' : '#ffffff', g.cmb > 4 ? 16 : 13);
          if (e.kind === 'boss') { g.slow = 0.8; flash(g, 0.7, 255, 220, 200); g.banner = null; }
          const dropChance = e.kind === 'boss' ? 1 : e.kind === 'bomber' ? 0.4 : e.kind === 'fighter' ? 0.16 : 0.07;
          if (rng() < dropChance) {
            const pool: DKind[] = ['spread', 'rapid', 'shield', 'bomb', 'heal'];
            g.drp.push({ x: e.x, y: e.y, vy: 58, ph: 0, kind: pool[(rng() * pool.length) | 0] });
          }
          e.x = -9e3;
        }
        break;
      }
    }
  }
  g.bul = g.bul.filter(b => b.dmg > 0);
  g.ene = g.ene.filter(e => e.x > -8e3);
}

// ── enemy stuff → player ──
function updPlayerHits(g: GS, _dt: number) {
  const p = g.p;
  if (p.inv > 0 || g.st !== 'play') return;
  const hitPlayer = (knock: number) => {
    if (p.sh) {
      p.sh = false; p.sht = 0;
      ring(g, p.x, p.y, 52, 90, 255, 170); spark(g, p.x, p.y, 16, 130, 90, 255, 170, 2);
      flash(g, 0.25, 120, 255, 200); g.shk = Math.max(g.shk, 7);
      popFloat(g, p.x, p.y - 24, T.tagShield, '#5effaa', 12);
      return false; // shield absorbed it
    }
    p.hp--; p.inv = 1.6; g.tookHit = true;
    g.shk = Math.max(g.shk, knock); flash(g, 0.4, 255, 90, 90);
    spark(g, p.x, p.y, 20, 130, 255, 100, 100, 2); smoke(g, p.x, p.y, 4, 30, 70);
    if (p.hp <= 0) { boom(g, p.x, p.y, 4, C.p); g.st = 'over'; g.slow = 1.4; flash(g, 0.5, 255, 120, 120); }
    return true;
  };
  for (const b of g.bul) {
    if (b.own) continue;
    if (hit(b.x, b.y, b.w, b.h, p.x, p.y, PW * 0.5, PH * 0.5)) { b.dmg = 0; hitPlayer(11); break; }
  }
  g.bul = g.bul.filter(b => b.dmg > 0);
  if (g.st === 'play')
    for (const e of g.ene) {
      if (e.entering && e.kind !== 'boss') continue;
      if (hit(e.x, e.y, e.w * 0.8, e.h * 0.8, p.x, p.y, PW * 0.42, PH * 0.42)) {
        const wasShield = p.sh;
        hitPlayer(13);
        if (e.kind !== 'boss') { boom(g, e.x, e.y, 1.8, C[e.kind]); e.x = -9e3; }
        else if (!wasShield) { e.flash = 0.12; } // bosses don't die from ramming
        break;
      }
    }
  g.ene = g.ene.filter(e => e.x > -8e3);
}

// ── pickups ──
function updPickups(g: GS) {
  const p = g.p;
  for (const d of g.drp) {
    if (hit(d.x, d.y, 22, 22, p.x, p.y, PW + 6, PH + 6)) {
      const col = DROP_COL[d.kind];
      spark(g, d.x, d.y, 14, 80, col[0], col[1], col[2], 2);
      ring(g, d.x, d.y, 30, col[0], col[1], col[2], 0.4);
      flash(g, 0.18, col[0], col[1], col[2]);
      if (d.kind === 'spread') { p.fm = 'spread'; p.fmt = 9; }
      else if (d.kind === 'rapid') { p.fm = 'rapid'; p.fmt = 8; }
      else if (d.kind === 'shield') { p.sh = true; p.sht = 12; }
      else if (d.kind === 'bomb') {
        g.shk = Math.max(g.shk, 16); flash(g, 0.7, 255, 220, 180); g.slow = 0.18;
        for (const e of g.ene) {
          boom(g, e.x, e.y, e.kind === 'boss' ? 1.6 : 2.2, C[e.kind]);
          e.hp -= 18; e.flash = 0.15;
          if (e.hp <= 0 && e.kind !== 'boss') { g.sc += 25; e.x = -9e3; }
        }
        g.ene = g.ene.filter(e => e.x > -8e3);
      } else if (d.kind === 'heal') { p.hp = Math.min(p.mhp, p.hp + 1); }
      popFloat(g, d.x, d.y - 14, PU_TEXT[d.kind], '#ffe24a', 14);
      d.y = 9e4;
    }
  }
  g.drp = g.drp.filter(d => d.y < 9e3);
}

// ── wave flow + win ──
function updWaveFlow(g: GS, dt: number, W: number, H: number) {
  if (g.ene.length !== 0 || g.st !== 'play') return;
  g.wcd -= dt;
  if (g.wcd > 0) return;
  if (g.wav >= MAX_WAVE) {
    g.st = 'win'; g.slow = 1.2;
    if (!g.tookHit) g.sc += 5000;
    showBanner(g, T.victory, '', '#5effc8');
    flash(g, 0.5, 180, 255, 220);
    return;
  }
  spawnWave(g, W, H);
  g.wcd = 2.0;
  if (g.wav % BOSS_EVERY !== 0) showBanner(g, `${T.waveLabel} ${g.wav} ${T.waveSuffix}`.trim(), '', '#7fe0ff');
}
