import type { ReactNode } from 'react';

// 极简 markdown → React:# 标题 / **粗** / `码` / - · 1. 列表 / 段落。AI 解读文本用。
export function Md({ src }: { src: string }) {
  const lines = String(src || '').replace(/\r\n/g, '\n').split('\n');
  const out: ReactNode[] = []; let i = 0, k = 0;
  const inline = (t: string): ReactNode[] => {
    const parts: ReactNode[] = []; let rest = t, key = 0;
    const RE = /(\*\*[^*]+\*\*)|(`[^`]+`)/;
    while (rest) {
      const m = rest.match(RE);
      if (!m || m.index === undefined) { parts.push(rest); break; }
      if (m.index > 0) parts.push(rest.slice(0, m.index));
      const s = m[0];
      if (s.startsWith('**')) parts.push(<strong key={key++}>{s.slice(2, -2)}</strong>);
      else parts.push(<code key={key++}>{s.slice(1, -1)}</code>);
      rest = rest.slice(m.index + s.length);
    }
    return parts;
  };
  while (i < lines.length) {
    const line = lines[i];
    const h = line.match(/^(#{1,4})\s+(.*)/);
    if (h) { const L = h[1].length; const el = inline(h[2]); out.push(L <= 1 ? <h3 key={k++}>{el}</h3> : L === 2 ? <h4 key={k++}>{el}</h4> : <h5 key={k++}>{el}</h5>); i++; continue; }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line); const items: ReactNode[] = [];
      while (i < lines.length && (ordered ? /^\s*\d+[.)]\s+/.test(lines[i]) : /^\s*[-*]\s+/.test(lines[i]))) {
        items.push(<li key={k++}>{inline(lines[i].replace(ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*]\s+/, ''))}</li>); i++;
      }
      out.push(ordered ? <ol key={k++}>{items}</ol> : <ul key={k++}>{items}</ul>); continue;
    }
    if (!line.trim()) { i++; continue; }
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|\s*[-*]\s+|\s*\d+[.)]\s+)/.test(lines[i])) { buf.push(lines[i]); i++; }
    out.push(<p key={k++}>{buf.map((l, j) => <span key={j}>{j > 0 && <br />}{inline(l)}</span>)}</p>);
  }
  return <div className="md">{out}</div>;
}
