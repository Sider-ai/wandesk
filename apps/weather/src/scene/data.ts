// Deterministic layout data for WeatherScene (no Math.random — a seeded PRNG keeps renders stable).
export const W = 1000;
export const H = 640;

// a tiny seeded PRNG so layouts are varied yet stable across renders
function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── star field (clear / partly-cloudy nights) ──
export const STARS = (() => {
  const rnd = mulberry(7);
  return Array.from({ length: 90 }, () => {
    const big = rnd() > 0.86;
    return {
      x: +(rnd() * W).toFixed(1),
      y: +(rnd() * H * 0.62).toFixed(1),
      r: +((big ? 1.6 : 0.7) + rnd() * 0.9).toFixed(2),
      o: +(0.35 + rnd() * 0.6).toFixed(2),
      dur: +(2.4 + rnd() * 4).toFixed(2),
      delay: +(rnd() * 5).toFixed(2),
      big,
    };
  });
})();

// two shooting stars, gently looping
export const SHOOTERS = [
  { x: 760, y: 70, len: 150, dur: 7, delay: 1.5 },
  { x: 420, y: 130, len: 110, dur: 9, delay: 5.5 },
];

// ── layered clouds. each layer drifts at its own pace/opacity ──
export interface Puff { cx: number; cy: number; r: number }
export interface CloudDef {
  puffs: Puff[];
  w: number; // bounding width (for seamless wrap)
  y: number;
  scale: number;
  dur: number;
  delay: number;
  op: number;
  blur: number;
}

// build one fluffy cloud from overlapping circles
function makeCloud(rnd: () => number): { puffs: Puff[]; w: number } {
  const n = 4 + Math.floor(rnd() * 3);
  const puffs: Puff[] = [];
  let x = 0;
  const baseR = 26 + rnd() * 16;
  for (let i = 0; i < n; i++) {
    const r = baseR * (0.55 + rnd() * 0.7);
    x += r * (0.7 + rnd() * 0.4);
    puffs.push({ cx: +x.toFixed(1), cy: +(-(rnd() * r * 0.5)).toFixed(1), r: +r.toFixed(1) });
  }
  puffs.unshift({ cx: +(x * 0.5).toFixed(1), cy: 4, r: +(baseR * 1.15).toFixed(1) }); // fat belly puff for body
  return { puffs, w: x + baseR };
}

function buildClouds(count: number, seed: number, opMul: number): CloudDef[] {
  const rnd = mulberry(seed);
  return Array.from({ length: count }, () => {
    const { puffs, w } = makeCloud(rnd);
    const scale = 0.7 + rnd() * 1.0;
    return {
      puffs, w,
      y: +(40 + rnd() * (H * 0.5)).toFixed(1),
      scale: +scale.toFixed(2),
      dur: +(46 + rnd() * 60).toFixed(1),
      delay: +(-rnd() * 70).toFixed(1),
      op: +((0.5 + rnd() * 0.5) * opMul).toFixed(2),
      blur: +(1 + rnd() * 3).toFixed(1),
    };
  });
}

export const CLOUDS_FEW = buildClouds(4, 21, 1);
export const CLOUDS_MANY = buildClouds(7, 33, 1);

// ── rain streaks + ripples ──
export const RAIN = (() => {
  const rnd = mulberry(91);
  return Array.from({ length: 90 }, () => ({
    x: +(rnd() * W).toFixed(1),
    len: +(16 + rnd() * 26).toFixed(1),
    dur: +(0.5 + rnd() * 0.5).toFixed(2),
    delay: +(-rnd() * 1.2).toFixed(2),
    o: +(0.18 + rnd() * 0.4).toFixed(2),
    w: rnd() > 0.7 ? 2 : 1.3,
  }));
})();
export const RIPPLES = (() => {
  const rnd = mulberry(53);
  return Array.from({ length: 14 }, () => ({
    x: +(rnd() * W).toFixed(1),
    y: +(H - 40 - rnd() * 60).toFixed(1),
    dur: +(2.2 + rnd() * 1.8).toFixed(2),
    delay: +(-rnd() * 4).toFixed(2),
  }));
})();

// ── snow ──
export const SNOW = (() => {
  const rnd = mulberry(67);
  return Array.from({ length: 70 }, () => {
    const r = +(1.6 + rnd() * 3.4).toFixed(2);
    return {
      x: +(rnd() * W).toFixed(1),
      r,
      dur: +(7 + rnd() * 8).toFixed(2),
      delay: +(-rnd() * 12).toFixed(2),
      drift: +((rnd() - 0.5) * 80).toFixed(1),
      o: +(0.45 + rnd() * 0.5).toFixed(2),
      sway: +(2.4 + rnd() * 3).toFixed(2),
    };
  });
})();

export const RAYS = Array.from({ length: 12 }, (_, i) => i * 30); // sun rays (rotating halo)

// lightning bolt paths (two alternating strikes)
export const BOLTS = [
  'M520 70 L470 250 L520 250 L450 470 L560 240 L512 240 Z',
  'M650 50 L610 210 L656 210 L590 430 L700 200 L656 200 Z',
];
