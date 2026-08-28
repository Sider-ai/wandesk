export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

export const damp = (from: number, to: number, lambda: number, dt: number) =>
  lerp(from, to, 1 - Math.exp(-lambda * dt));

export const moveToward = (current: number, target: number, maxDelta: number) =>
  current < target
    ? Math.min(current + maxDelta, target)
    : Math.max(current - maxDelta, target);

export const random = (min = 1, max?: number) =>
  max === undefined ? Math.random() * min : min + Math.random() * (max - min);

export function formatRaceTime(time: number): string {
  if (!Number.isFinite(time) || time < 0) return '-:--.--';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const centiseconds = Math.floor((time * 100) % 100);
  return `${minutes}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}
