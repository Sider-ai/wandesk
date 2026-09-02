// Right page: an open sheet of paper (title + date + body) + AI command bar at the bottom. Presentational only, logic lives in the hook.
import { type RefObject } from 'react';
import { dateStamp, paperOf, type Page } from '../lib/paper';

export function Sheet({
  active, title, body, paper, flip, cmd, busy, cmdErr,
  taRef, titleRef, scrollRef, onEdit, onCmdChange, onRunCommand,
}: {
  active: Page | null;
  title: string;
  body: string;
  paper: number;
  flip: 'next' | 'prev' | '';
  cmd: string;
  busy: boolean;
  cmdErr: string;
  taRef: RefObject<HTMLTextAreaElement | null>;
  titleRef: RefObject<HTMLTextAreaElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
  onEdit: (next: Partial<{ title: string; body: string }>) => void;
  onCmdChange: (v: string) => void;
  onRunCommand: () => void;
}) {
  const ink = paperOf(paper).ink;

  return (
    <section className={`nb-sheet ${paperOf(paper).cls} ${flip ? `flipping flip-${flip}` : ''}`}>
      <div className="nb-page-curl" aria-hidden />
      {!active ? (
        <div className="nb-blank">
          <div className="nb-blank-mark">✎</div>
          <div className="nb-blank-text">Click "＋ New page" on the left to open the first page</div>
        </div>
      ) : (
        <>
          <div className="nb-scroll" ref={scrollRef}>
            <div className="nb-sheet-top">
              <textarea
                ref={titleRef}
                className="nb-title"
                rows={1}
                style={{ color: ink, caretColor: ink }}
                value={title}
                onChange={(e) => onEdit({ title: e.target.value.replace(/\n/g, '') })}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); taRef.current?.focus(); } }}
                placeholder="Title…"
                spellCheck={false}
              />
            </div>

            <div className="nb-date" style={{ color: ink }}>{dateStamp()}</div>

            <textarea
              ref={taRef}
              className="nb-body"
              style={{ color: ink, caretColor: ink }}
              value={body}
              onChange={(e) => onEdit({ body: e.target.value })}
              placeholder={'Write something here…\nSaved automatically as you type.'}
              spellCheck={false}
            />
          </div>

          {/* Footer: a single instruction → AI rewrites this page directly */}
          <div className="nb-cmdbar">
            {cmdErr && <span className="nb-cmd-err">{cmdErr}</span>}
            <div className="nb-cmd-wrap">
              <input
                className="nb-cmd"
                value={cmd}
                disabled={busy}
                placeholder={busy ? 'AI is rewriting this page…' : 'Type an instruction, press Enter for AI to rewrite this page (continue / summarize / polish / translate…)'}
                onChange={(e) => onCmdChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) onRunCommand(); }}
              />
              <button className="nb-cmd-send" onClick={onRunCommand} disabled={busy || !cmd.trim()} title="Send" aria-label="Send">
                {busy ? '…' : '✦'}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
