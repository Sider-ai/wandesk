// Reader page: off-white paper, long-form text, serif type, a vermilion drop cap, a "You chose:" vermilion annotation; choices scroll with the content.
import type { CSSProperties } from 'react';
import type { ReaderCtx } from '../lib/useReader';
import { FONT_SIZES, firstGlyph } from '../lib/story';

export function ReaderView({ rd }: { rd: ReaderCtx }) {
  const { book, pages, busy, error, ended, choices, custom, awaitingResume, showChoiceBlock, theme, fontStep, genre } = rd;

  return (
    <div className={`reader-app reader-read theme-${theme}`} data-genre={genre}>
      <header className="r-top">
        <button className="r-back" onClick={() => rd.setView('shelf')} aria-label="Back to shelf">‹</button>
        <div className="r-title">{book?.title || (busy ? 'The story is unfolding…' : 'New story')}</div>
        <div className="r-page">{pages.length ? `Page ${pages.length}` : ''}</div>
        <span className="r-keys">
          <button className="r-key r-key-sm" onClick={() => rd.setFontStep((s) => Math.max(0, s - 1))} disabled={fontStep === 0} aria-label="Decrease font size">A</button>
          <button className="r-key r-key-lg" onClick={() => rd.setFontStep((s) => Math.min(FONT_SIZES.length - 1, s + 1))} disabled={fontStep === FONT_SIZES.length - 1} aria-label="Increase font size">A</button>
          <button className="r-key" onClick={() => rd.setTheme((t) => (t === 'day' ? 'night' : 'day'))} aria-label={theme === 'day' ? 'Night mode' : 'Day mode'}>
            {theme === 'day' ? '☾' : '☀'}
          </button>
        </span>
      </header>

      <div className="r-scroll">
        <div className="r-body" style={{ '--fs': `${FONT_SIZES[fontStep]}px` } as CSSProperties}>
          {book?.premise && (
            <div className="r-premise"><span className="r-premise-label">Setup</span>{book.premise}</div>
          )}

          {pages.map((sc, idx) => {
            const fresh = sc.idx === rd.idxOfNew.current && idx === pages.length - 1;
            const dc = idx === 0 ? firstGlyph(sc.narrative) : null;
            return (
              <div ref={idx === pages.length - 1 ? rd.lastPageRef : undefined} className={`r-block${fresh ? ' is-fresh' : ''}`} key={sc.idx}>
                {dc ? (
                  <p className="r-p r-first"><span className="r-dc">{dc.cap}</span>{dc.rest}</p>
                ) : (
                  <p className="r-p">{sc.narrative}</p>
                )}
                {sc.chosen && <p className="zhu">You chose: {sc.chosen}</p>}
              </div>
            );
          })}

          {busy && (
            <div className="r-loading"><span>The story is unfolding</span><span className="r-dots"><i /><i /><i /></span></div>
          )}
          {error && <div className="r-error">{error}</div>}

          {/* Choices: follow the end of the text, scrolling with the page */}
          {showChoiceBlock && (
            <div className="r-choices-flow">
              {awaitingResume && (
                <button className="choice choice-resume" onClick={rd.resumeChoices} disabled={busy}>Continue this story</button>
              )}
              {choices.map((c, ci) => (
                <button key={ci} className="choice" onClick={() => rd.advance(c)} disabled={busy}>{c}</button>
              ))}
              <div className="r-free">
                <input
                  className="r-free-input"
                  value={custom}
                  onChange={(e) => rd.setCustom(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && rd.advance(custom)}
                  placeholder="Write your own action…"
                />
                <button className="r-free-go" onClick={() => rd.advance(custom)} disabled={!custom.trim() || busy} aria-label="Send">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {ended && !busy && (
            <div className="r-end"><span className="r-end-line" /><span className="r-end-word">THE END</span><span className="r-end-line" /></div>
          )}
        </div>
      </div>
    </div>
  );
}
