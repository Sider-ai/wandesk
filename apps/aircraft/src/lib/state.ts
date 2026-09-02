// Aircraft — initialization (starfield / global state) and wave generation.
import { BOSS_EVERY, cl, rng, TAU } from './constants';
import { showBanner } from './fx';
import { T } from './text';
import type { EKind, GS, StarLayer } from './types';

export function makeStars(W: number, H: number): StarLayer[] {
  const out: StarLayer[] = [];
  // three parallax layers: deep/slow → near/fast
  const defs = [
    { n: 46, smin: 8, smax: 22, bmin: 0.1, bmax: 0.32, sz: 0.8, tint: [150, 160, 210] },
    { n: 34, smin: 30, smax: 60, bmin: 0.18, bmax: 0.5, sz: 1.2, tint: [180, 200, 255] },
    { n: 18, smin: 80, smax: 150, bmin: 0.35, bmax: 0.85, sz: 1.8, tint: [220, 240, 255] },
  ];
  for (const d of defs)
    for (let i = 0; i < d.n; i++)
      out.push({
        x: rng() * W, y: rng() * H, s: d.smin + rng() * (d.smax - d.smin),
        b: d.bmin + rng() * (d.bmax - d.bmin), sz: d.sz * (rng() < 0.15 ? 1.7 : 1),
        r: d.tint[0], g: d.tint[1], b2: d.tint[2],
      });
  return out;
}

export function init(W: number, H: number, keepStars?: StarLayer[]): GS {
  return {
    st: 'menu',
    p: { x: W / 2, y: H * 0.84, tx: W / 2, ty: H * 0.84, hp: 5, mhp: 5, inv: 0, fm: 'normal', fmt: 0, fcd: 0, sh: false, sht: 0, bank: 0 },
    bul: [], ene: [], par: [], drp: [], sta: keepStars ?? makeStars(W, H), flt: [], banner: null,
    sc: 0, cmb: 0, cmbt: 0, maxCmb: 0, wav: 0, wcd: 2, tookHit: false,
    shk: 0, fl: 0, flr: 255, flg: 240, flb: 200, t: 0, slow: 0, vig: 0, hue: 0,
  };
}

export function spawnWave(g: GS, W: number, H: number) {
  g.wav++;
  const w = g.wav;
  if (w % BOSS_EVERY === 0) {
    const hp = 45 + (w / BOSS_EVERY) * 55;
    g.ene.push({ x: W / 2, y: -90, w: 92, h: 64, hp, mhp: hp, kind: 'boss', spd: 34, t: 1.2, fr: 1.3, ph: 0, flash: 0, entering: true, ty: 86, seed: rng() * 99 });
    showBanner(g, T.warning, T.bossIncoming, '#ff5577');
    g.shk = Math.max(g.shk, 6);
    return;
  }
  const n = Math.min(3 + ((w * 0.9) | 0), 12);
  const formation = (rng() * 3) | 0;
  for (let i = 0; i < n; i++) {
    const kinds: EKind[] = w < 2 ? ['scout'] : w < 4 ? ['scout', 'scout', 'fighter'] : w < 7 ? ['scout', 'fighter', 'bomber'] : ['scout', 'fighter', 'fighter', 'bomber'];
    const k = kinds[(rng() * kinds.length) | 0];
    const sp = W / (n + 1);
    const base = k === 'scout' ? { w: 20, h: 20, hp: 1, spd: 60 + rng() * 50, fr: 999 }
      : k === 'fighter' ? { w: 26, h: 26, hp: 2 + ((w / 4) | 0), spd: 38 + rng() * 26, fr: 1.05 - Math.min(0.5, w * 0.03) }
        : { w: 38, h: 32, hp: 5 + ((w / 3) | 0), spd: 24 + rng() * 14, fr: 1.7 };
    const fx = formation === 0 ? sp * (i + 1)                                  // line
      : formation === 1 ? W / 2 + Math.sin((i / n) * Math.PI) * W * 0.4 - W * 0.2 + sp // arc-ish
        : sp * (i + 1) + (i % 2 ? 1 : -1) * 18;                                 // zigzag
    g.ene.push({
      ...base, kind: k, x: cl(fx + (rng() - 0.5) * 24, 24, W - 24),
      y: -34 - i * 30, mhp: base.hp, t: rng() * (base.fr === 999 ? 1 : base.fr),
      ph: rng() * TAU, flash: 0, entering: true, ty: 40 + rng() * H * 0.3, seed: rng() * 99,
    });
  }
}
