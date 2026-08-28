// 恋爱屋 — 时间/等级/正文渲染 与 提示词拼装(纯函数)。
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { HISTORY_TURNS, stageOf, type Msg } from './persona';

// ── 时间工具(db 存的是 UTC "YYYY-MM-DD HH:MM:SS") ──
export function toDate(v?: string): Date {
  if (!v) return new Date();
  const d = new Date(v.replace(' ', 'T') + (v.includes('T') || v.endsWith('Z') ? '' : 'Z'));
  return isNaN(d.getTime()) ? new Date() : d;
}
const p2 = (n: number) => String(n).padStart(2, '0');
export const hms = (d: Date) => `${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
export function dayLabel(d: Date): string {
  const W = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${W[d.getDay()]}`;
}
export function momentTime(v: string): string {
  const d = toDate(v);
  const now = new Date();
  const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12);
  if (sameDay(d, now)) return `今天 ${p2(d.getHours())}:${p2(d.getMinutes())}`;
  if (sameDay(d, yest)) return `昨天 ${p2(d.getHours())}:${p2(d.getMinutes())}`;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

// ── 等级:聊得越多等级越高(QQ 规则:4 星 = 1 月,4 月 = 1 日) ──
export function levelIcons(msgCount: number): string {
  const level = Math.min(96, Math.floor(msgCount / 12) + 1);
  const suns = Math.floor(level / 16);
  const moons = Math.floor((level % 16) / 4);
  const stars = level % 4;
  return '☀️'.repeat(suns) + '🌙'.repeat(moons) + '⭐'.repeat(stars) || '⭐';
}

// 括号里的动作/表情/环境描写渲染成淡色小字
export function renderContent(text: string): ReactNode[] {
  return text.split(/(（[^）]*）|\([^)]*\))/g).map((p, i) =>
    p && (/^（[^）]*）$/.test(p) || /^\([^)]*\)$/.test(p))
      ? createElement('span', { key: i, className: 'lw-action' }, p)
      : createElement('span', { key: i }, p),
  );
}

export function isDup(a: string, list: string[]): boolean {
  const x = a.trim();
  return list.some((m) => { const y = m.trim(); return y === x || y.includes(x) || x.includes(y); });
}

// ── 提示词拼装 ──
function relLine(a: number) { const s = stageOf(a); return `【当前关系】你们现在是「${s.name}」(好感 ${a}/100)。${s.note}`; }
const memLine = (memories: string[]) => (memories.length ? memories.map((m) => '· ' + m).join('\n') : '(暂时还没记下什么)');

export function buildPrompt(history: Msg[], memories: string[], userText: string, a: number): string {
  const hist = history.filter((m) => m.role !== 'sys').slice(-HISTORY_TURNS)
    .map((m) => (m.role === 'user' ? '我:' : '苏晚:') + m.content).join('\n') || '(还没聊过)';
  return [relLine(a), `【你记得的事】\n${memLine(memories)}`, `【最近对话】\n${hist}`, `【对方刚说】我:${userText}`].join('\n\n');
}
export function continuePrompt(memories: string[], userText: string, a: number): string {
  return [relLine(a), `【你记得的事】\n${memLine(memories)}`, `【对方刚说】我:${userText}`].join('\n\n');
}
