// Notebook — paper styles and formatting helpers (pure data / pure functions).

export type Page = {
  id: number;
  title: string;
  body: string;
  paper: number;
  pinned: number;
  updated_at: string;
};

// ── Paper styles (each one a real paper: ruled / grid / dot / kraft / letter) ──
export type Paper = { key: string; label: string; ink: string; cls: string; tab: string };
export const PAPERS: Paper[] = [
  { key: 'ruled', label: 'Ruled', ink: '#283750', cls: 'pg-ruled', tab: '#3a5fb0' },
  { key: 'grid', label: 'Grid', ink: '#24402f', cls: 'pg-grid', tab: '#2f8060' },
  { key: 'dot', label: 'Dot', ink: '#283a52', cls: 'pg-dot', tab: '#5b7ad0' },
  { key: 'kraft', label: 'Kraft', ink: '#3c2a18', cls: 'pg-kraft', tab: '#b07a3f' },
  { key: 'cream', label: 'Letter', ink: '#5a2438', cls: 'pg-cream', tab: '#c2557a' },
];
export const paperOf = (i: number): Paper => PAPERS[((i % PAPERS.length) + PAPERS.length) % PAPERS.length];

export function fmtTime(v: string): string {
  if (!v) return '';
  const d = new Date(v.replace(' ', 'T') + (v.includes('T') || v.endsWith('Z') ? '' : 'Z'));
  if (isNaN(d.getTime())) return v;
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)} d ago`;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

export function dateStamp(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()} . ${mm} . ${dd}`;
}

// Body character count (rough count for mixed-script text, used in the footer)
export function countChars(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return t.replace(/\s+/g, ' ').length;
}
