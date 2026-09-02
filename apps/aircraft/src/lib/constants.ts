// 飞机大战 — 常量、配色、掉落表与数学小工具。
import type { DKind } from './types';
import { T } from './text';

export const PW = 30, PH = 38, BASE_FR = 0.14, RAPID_FR = 0.06, PS = 340;
export const MAX_WAVE = 12;   // beat this many waves to WIN
export const BOSS_EVERY = 4;

export const C: Record<string, number[]> = {
  p: [70, 226, 255], pcore: [200, 250, 255], pb: [120, 235, 255],
  scout: [120, 255, 180], fighter: [255, 196, 60], bomber: [255, 90, 150],
  boss: [255, 60, 90], eb: [255, 110, 150], ebBoss: [255, 90, 160],
};
export const DROP_COL: Record<DKind, [number, number, number]> = {
  spread: [90, 170, 255], rapid: [255, 210, 70], shield: [80, 255, 170],
  bomb: [255, 90, 90], heal: [255, 120, 180],
};
export const DROP_GLYPH: Record<DKind, string> = { spread: 'W', rapid: 'R', shield: '◇', bomb: '✺', heal: '＋' };
export const PU_TEXT: Record<DKind, string> = {
  spread: T.puSpread, rapid: T.puRapid, shield: T.puShield, bomb: T.puBomb, heal: T.puHeal,
};

// ── math helpers ──
export const rng = Math.random;
export const cl = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const TAU = Math.PI * 2;
export function hit(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
  return ax - aw / 2 < bx + bw / 2 && ax + aw / 2 > bx - bw / 2 && ay - ah / 2 < by + bh / 2 && ay + ah / 2 > by - bh / 2;
}
