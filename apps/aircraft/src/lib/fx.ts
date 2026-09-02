// Aircraft — effects authoring layer: sparks, debris, smoke, halos, flashes, explosions, floating text, banners.
import { rng, TAU } from './constants';
import type { GS } from './types';

export function spark(g: GS, x: number, y: number, n: number, sp: number, r: number, gc: number, b: number, sz = 2) {
  for (let i = 0; i < n; i++) {
    const a = rng() * TAU, v = (0.4 + rng()) * sp;
    g.par.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.3 + rng() * 0.45, ml: 0.75, sz: sz * (0.5 + rng()), r, g: gc, b, kind: 'spark' });
  }
}
export function shards(g: GS, x: number, y: number, n: number, sp: number, r: number, gc: number, b: number) {
  for (let i = 0; i < n; i++) {
    const a = rng() * TAU, v = (0.5 + rng()) * sp;
    g.par.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.5 + rng() * 0.6, ml: 1.1, sz: 2 + rng() * 3, r, g: gc, b, kind: 'shard', rot: rng() * TAU, vr: (rng() - 0.5) * 14, grav: 120 });
  }
}
export function smoke(g: GS, x: number, y: number, n: number, sp: number, tint: number) {
  for (let i = 0; i < n; i++) {
    const a = rng() * TAU, v = rng() * sp;
    g.par.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 10, life: 0.6 + rng() * 0.6, ml: 1.2, sz: 6 + rng() * 10, r: tint, g: tint, b: tint + 10, kind: 'smoke' });
  }
}
export function ring(g: GS, x: number, y: number, sz: number, r: number, gc: number, b: number, ml = 0.45) {
  g.par.push({ x, y, vx: 0, vy: 0, life: ml, ml, sz, r, g: gc, b, kind: 'ring' });
}
export function glow(g: GS, x: number, y: number, sz: number, r: number, gc: number, b: number, ml = 0.5) {
  g.par.push({ x, y, vx: 0, vy: 0, life: ml, ml, sz, r, g: gc, b, kind: 'glow' });
}
export function flash(g: GS, amt: number, r = 255, gc = 240, b = 200) {
  if (amt <= g.fl) return;
  g.fl = amt; g.flr = r; g.flg = gc; g.flb = b;
}
// the signature explosion — used everywhere a thing dies
export function boom(g: GS, x: number, y: number, pw: number, col: number[]) {
  g.shk = Math.max(g.shk, pw * 3.2);
  flash(g, pw * 0.16, 255, 230, 190);
  smoke(g, x, y, (pw * 5) | 0, pw * 28, 60);
  spark(g, x, y, (pw * 16) | 0, pw * 150, 255, 210, 60);
  spark(g, x, y, (pw * 8) | 0, pw * 90, col[0], col[1], col[2], 3);
  shards(g, x, y, (pw * 5) | 0, pw * 70, col[0], col[1], col[2]);
  glow(g, x, y, pw * 32, 255, 210, 130, 0.35);
  ring(g, x, y, pw * 46, 255, 200, 120, 0.42);
  ring(g, x, y, pw * 30, col[0], col[1], col[2], 0.34);
}
export function popFloat(g: GS, x: number, y: number, t: string, c: string, sz = 13) {
  g.flt.push({ x, y, t, life: 0.95, ml: 0.95, c, sz, vy: -46 });
}
export function showBanner(g: GS, big: string, sub: string, c: string) {
  g.banner = { big, sub, life: 1.7, ml: 1.7, c };
}
