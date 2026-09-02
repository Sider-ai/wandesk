// Shelf (home screen): a pale birchwood bookcase, three books per shelf; preset books turn into real saves in place, and the last slot is the add slot + new-book title page.
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
          {del && <span className="bk-del" role="button" onClick={del} title="Delete">✕</span>}
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

  // Preset books: "unread" if never opened, become a real save in place once opened (deduped by exact premise match).
  for (const p of PRESETS) {
    const real = books.find((b) => b.premise === p.premise);
    const st = real ? (real.status === 'ended' ? 'ended' : 'ongoing') : 'new';
    const n = real ? counts[real.id] || 0 : 0;
    items.push(
      <BookSlot
        key={p.key} g={p.genre} title={real ? real.title : p.title}
        sub={real ? (st === 'ended' ? 'Finished' : <>Ongoing{n > 0 ? ` · page ${n}` : ''}</>) : p.tagline}
        status={st} n={n} hint={p.premise}
        onOpen={real ? () => rd.openBook(real) : () => rd.startBook(p.premise, p.title)}
        del={real ? (e) => rd.deleteBook(real.id, e) : undefined}
      />,
    );
  }
  // Custom books: cover styled by detected genre
  for (const s of books.filter((b) => !PRESETS.some((p) => p.premise === b.premise))) {
    const st = s.status === 'ended' ? 'ended' : 'ongoing';
    const n = counts[s.id] || 0;
    items.push(
      <BookSlot
        key={s.id} g={detectGenre(s.premise)} title={s.title || 'Untitled'}
        sub={st === 'ended' ? 'Finished' : <>Ongoing{n > 0 ? ` · page ${n}` : ''}</>}
        status={st} n={n} hint={s.premise}
        onOpen={() => rd.openBook(s)} del={(e) => rd.deleteBook(s.id, e)}
      />,
    );
  }
  // Last slot: a recessed add slot
  items.push(
    <div className="slot" key="new">
      <button className="book" onClick={() => { rd.setComposing(true); rd.setError(''); }} title="Write your own setup">
        <span className="add-slot"><span className="plus">＋</span></span>
        <span className="cap"><span className="t t-add">New story</span><span className="s">{' '}</span></span>
      </button>
    </div>,
  );

  return (
    <div className="reader-app reader-shelf">
      <div className="shelf-col">
        <header className="lintel">My Shelf</header>
        {rd.error && <div className="shelf-toast">{rd.error}</div>}
        <div className="shelf-case">
          <div className="shelf-grid">{items}</div>
        </div>
      </div>

      {/* New-book title page: write a setup line, start a book */}
      {rd.composing && (
        <div className="rd-dlg-overlay" onClick={() => rd.setComposing(false)}>
          <div className="rd-dlg" onClick={(e) => e.stopPropagation()}>
            <button className="rd-dlg-close" onClick={() => rd.setComposing(false)} aria-label="Close">✕</button>
            <div className="rd-dlg-title">Write an opening</div>
            <p className="rd-dlg-hint">Give a one-line setup: genre, identity, the situation right now — the more specific, the better the story lands.</p>
            <textarea
              className="rd-dlg-input"
              value={rd.premise}
              autoFocus
              rows={3}
              onChange={(e) => rd.setPremise(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) rd.startBook(rd.premise); }}
              placeholder="e.g.: A journalist in 1920s Shanghai, drawn into a murder at the theater…"
            />
            <button className="rd-dlg-begin" onClick={() => rd.startBook(rd.premise)} disabled={!rd.premise.trim()}>
              Begin this story
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
