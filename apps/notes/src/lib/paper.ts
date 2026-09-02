// 笔记本 — 纸张样式与格式化辅助(纯数据/纯函数)。

export type Page = {
  id: number;
  title: string;
  body: string;
  paper: number;
  pinned: number;
  updated_at: string;
};

// ── 纸张样式(每一种都是真实的纸:横线 / 方格 / 点阵 / 牛皮 / 信笺) ──
export type Paper = { key: string; label: string; ink: string; cls: string; tab: string };
export const PAPERS: Paper[] = [
  { key: 'ruled', label: '横线', ink: '#283750', cls: 'pg-ruled', tab: '#3a5fb0' },
  { key: 'grid', label: '方格', ink: '#24402f', cls: 'pg-grid', tab: '#2f8060' },
  { key: 'dot', label: '点阵', ink: '#283a52', cls: 'pg-dot', tab: '#5b7ad0' },
  { key: 'kraft', label: '牛皮', ink: '#3c2a18', cls: 'pg-kraft', tab: '#b07a3f' },
  { key: 'cream', label: '信笺', ink: '#5a2438', cls: 'pg-cream', tab: '#c2557a' },
];
export const paperOf = (i: number): Paper => PAPERS[((i % PAPERS.length) + PAPERS.length) % PAPERS.length];

export function fmtTime(v: string): string {
  if (!v) return '';
  const d = new Date(v.replace(' ', 'T') + (v.includes('T') || v.endsWith('Z') ? '' : 'Z'));
  if (isNaN(d.getTime())) return v;
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return '刚刚';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)} 天前`;
  return d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
}

export function dateStamp(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()} . ${mm} . ${dd}`;
}

// 正文字数(中英混排的粗略计数,用于页脚)
export function countChars(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return t.replace(/\s+/g, ' ').length;
}
