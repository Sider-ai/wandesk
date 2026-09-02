// Love House — time / level / body rendering and prompt assembly (pure functions).
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { HISTORY_TURNS, stageOf, type Msg } from './persona';

// ── time utilities (the db stores UTC "YYYY-MM-DD HH:MM:SS") ──
export function toDate(v?: string): Date {
  if (!v) return new Date();
  const d = new Date(v.replace(' ', 'T') + (v.includes('T') || v.endsWith('Z') ? '' : 'Z'));
  return isNaN(d.getTime()) ? new Date() : d;
}
const p2 = (n: number) => String(n).padStart(2, '0');
export const hms = (d: Date) => `${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
export function dayLabel(d: Date): string {
  const W = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${W[d.getDay()]}, ${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}
export function momentTime(v: string): string {
  const d = toDate(v);
  const now = new Date();
  const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12);
  if (sameDay(d, now)) return `Today ${p2(d.getHours())}:${p2(d.getMinutes())}`;
  if (sameDay(d, yest)) return `Yesterday ${p2(d.getHours())}:${p2(d.getMinutes())}`;
  return `${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}

// ── level: more chatting means a higher level (QQ-style rule: 4 stars = 1 moon, 4 moons = 1 sun) ──
export function levelIcons(msgCount: number): string {
  const level = Math.min(96, Math.floor(msgCount / 12) + 1);
  const suns = Math.floor(level / 16);
  const moons = Math.floor((level % 16) / 4);
  const stars = level % 4;
  return '☀️'.repeat(suns) + '🌙'.repeat(moons) + '⭐'.repeat(stars) || '⭐';
}

// Render bracketed action/expression/scene descriptions as small, muted text
export function renderContent(text: string): ReactNode[] {
  return text.split(/(\([^)]*\))/g).map((p, i) =>
    p && /^\([^)]*\)$/.test(p)
      ? createElement('span', { key: i, className: 'lw-action' }, p)
      : createElement('span', { key: i }, p),
  );
}

export function isDup(a: string, list: string[]): boolean {
  const x = a.trim();
  return list.some((m) => { const y = m.trim(); return y === x || y.includes(x) || x.includes(y); });
}

// ── prompt assembly ──
function relLine(a: number) { const s = stageOf(a); return `[Current relationship] You two are now "${s.name}" (affection ${a}/100). ${s.note}`; }
const memLine = (memories: string[]) => (memories.length ? memories.map((m) => '· ' + m).join('\n') : '(nothing remembered yet)');

export function buildPrompt(history: Msg[], memories: string[], userText: string, a: number): string {
  const hist = history.filter((m) => m.role !== 'sys').slice(-HISTORY_TURNS)
    .map((m) => (m.role === 'user' ? 'Me: ' : 'Su Wan: ') + m.content).join('\n') || '(no conversation yet)';
  return [relLine(a), `[What you remember]\n${memLine(memories)}`, `[Recent conversation]\n${hist}`, `[They just said] Me: ${userText}`].join('\n\n');
}
export function continuePrompt(memories: string[], userText: string, a: number): string {
  return [relLine(a), `[What you remember]\n${memLine(memories)}`, `[They just said] Me: ${userText}`].join('\n\n');
}
