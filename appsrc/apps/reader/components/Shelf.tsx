// 书架(首屏):浅桦木书柜,三本一层;预置书就地变存档,末位是添加位 + 新书扉页。
import type { ReactNode, MouseEvent } from 'react';
import type { ReaderCtx } from '../lib/useReader';
import type { Genre } from '../lib/types';
import { PRESETS, detectGenre } from '../lib/story';
import { CoverArt } from './CoverArt';

function BookSlot({
  g, title, sub, status, n, onOpen, hint, del,
}: {
  g: Genre;
  title: string;
  sub: ReactNode;
  status: 'new' | 'ongoing' | 'ended';
  n: number;
  onOpen: () => void;
  hint: string;
  del?: (e: MouseEvent) => void;
}) {
  return (
    <div className="slot">
      <button className="book" onClick={onOpen} title={hint}>
        <span className="cover-wrap">
          <CoverArt genre={g} title={title} />
          <span className={`mark-tab ${status === 'ongoing' ? 'reading' : status === 'ended' ? 'done' : 'unread'}`}>
            {status === 'ongoing' ? (n > 0 ? n : '') : status === 'ended' ? '✓' : ''}
          </span>
          {del && <span className="bk-del" role="button" onClick={del} title="删除">✕</span>}
        </span>
        <span className="cap">
          <span className="t">{title}</span>
          <span className="s">{sub}</span>
        </span>
      </button>
    </div>
  );
}

export function Shelf({ rd }: { rd: ReaderCtx }) {
  const { books, counts } = rd;
  const items: ReactNode[] = [];

  // 预置书:没开过是"未读"新书,开过就地变成真实存档(按 premise 精确匹配去重)。
  for (const p of PRESETS) {
    const real = books.find((b) => b.premise === p.premise);
    const st = real ? (real.status === 'ended' ? 'ended' : 'ongoing') : 'new';
    const n = real ? counts[real.id] || 0 : 0;
    items.push(
      <BookSlot
        key={p.key} g={p.genre} title={real ? real.title : p.title}
        sub={real ? (st === 'ended' ? '已完结' : <>连载中{n > 0 ? ` · 第 ${n} 页` : ''}</>) : p.tagline}
        status={st} n={n} hint={p.premise}
        onOpen={real ? () => rd.openBook(real) : () => rd.startBook(p.premise, p.title)}
        del={real ? (e) => rd.deleteBook(real.id, e) : undefined}
      />,
    );
  }
  // 自定义书:按体裁套封面版式
  for (const s of books.filter((b) => !PRESETS.some((p) => p.premise === b.premise))) {
    const st = s.status === 'ended' ? 'ended' : 'ongoing';
    const n = counts[s.id] || 0;
    items.push(
      <BookSlot
        key={s.id} g={detectGenre(s.premise)} title={s.title || '无题'}
        sub={st === 'ended' ? '已完结' : <>连载中{n > 0 ? ` · 第 ${n} 页` : ''}</>}
        status={st} n={n} hint={s.premise}
        onOpen={() => rd.openBook(s)} del={(e) => rd.deleteBook(s.id, e)}
      />,
    );
  }
  // 末位:凹进去的添加位
  items.push(
    <div className="slot" key="new">
      <button className="book" onClick={() => { rd.setComposing(true); rd.setError(''); }} title="写一个属于你自己的设定">
        <span className="add-slot"><span className="plus">＋</span></span>
        <span className="cap"><span className="t t-add">新的故事</span><span className="s">{' '}</span></span>
      </button>
    </div>,
  );

  return (
    <div className="reader-app reader-shelf">
      <div className="shelf-col">
        <header className="lintel">我的书架</header>
        {rd.error && <div className="shelf-toast">{rd.error}</div>}
        <div className="shelf-case">
          <div className="shelf-grid">{items}</div>
        </div>
      </div>

      {/* 新书扉页:写一句设定,开一本书 */}
      {rd.composing && (
        <div className="rd-dlg-overlay" onClick={() => rd.setComposing(false)}>
          <div className="rd-dlg" onClick={(e) => e.stopPropagation()}>
            <button className="rd-dlg-close" onClick={() => rd.setComposing(false)} aria-label="关闭">✕</button>
            <div className="rd-dlg-title">写一个开场</div>
            <p className="rd-dlg-hint">给一句设定:题材、身份、此刻的处境——越具体,故事越对味。</p>
            <textarea
              className="rd-dlg-input"
              value={rd.premise}
              autoFocus
              rows={3}
              onChange={(e) => rd.setPremise(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) rd.startBook(rd.premise); }}
              placeholder="例如:民国上海的女记者,卷入一桩剧院凶案…"
            />
            <button className="rd-dlg-begin" onClick={() => rd.startBook(rd.premise)} disabled={!rd.premise.trim()}>
              开始这个故事
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
