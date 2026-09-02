// 右页:摊开的纸(标题 + 日期 + 正文)+ 底部 AI 指令栏。纯展示,逻辑在 hook。
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
          <div className="nb-blank-text">左边「＋ 新一页」翻开第一页</div>
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
                placeholder="标题…"
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
              placeholder={'在这里写点什么…\n写下即自动保存。'}
              spellCheck={false}
            />
          </div>

          {/* 页脚:一条指令 → AI 直接改写本页 */}
          <div className="nb-cmdbar">
            {cmdErr && <span className="nb-cmd-err">{cmdErr}</span>}
            <div className="nb-cmd-wrap">
              <input
                className="nb-cmd"
                value={cmd}
                disabled={busy}
                placeholder={busy ? 'AI 正在改写这一页…' : '输入指令，回车让 AI 直接改写这一页（续写 / 总结 / 润色 / 翻译…）'}
                onChange={(e) => onCmdChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) onRunCommand(); }}
              />
              <button className="nb-cmd-send" onClick={onRunCommand} disabled={busy || !cmd.trim()} title="发送" aria-label="发送">
                {busy ? '…' : '✦'}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
