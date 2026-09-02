// Left half: header + chat log + toolbar + input area. Pure display; state and send logic live in index.
import { type RefObject } from 'react';
import { Portrait } from './Portrait';
import { EMOJIS, type Msg } from '../lib/persona';
import { dayLabel, hms, levelIcons, renderContent, toDate } from '../lib/format';

export function ChatPane({
  msgs, busy, text, setText, emoOpen, setEmoOpen, onSend,
  scrollRef, inputRef,
}: {
  msgs: Msg[];
  busy: boolean;
  text: string;
  setText: (v: string | ((t: string) => string)) => void;
  emoOpen: boolean;
  setEmoOpen: (v: boolean | ((b: boolean) => boolean)) => void;
  onSend: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const firstDay = msgs.length ? dayLabel(toDate(msgs[0].created_at)) : dayLabel(new Date());

  return (
    <div className="lw-chatside">
      {/* Header: avatar · name · level · signature */}
      <div className="lw-header">
        <div className="lw-ava-frame">
          <div className="lw-ava-face"><Portrait thinking={busy} /></div>
          <span className="lw-online-dot" title="Online" />
        </div>
        <div className="lw-who">
          <div className="lw-name">
            Su Wan
            <span className="lw-lv" title={`Level grows with chatting · ${msgs.length} messages so far`}>{levelIcons(msgs.length)}</span>
          </div>
          <div className="lw-sig">Bio: Not every reunion was ever really a goodbye.</div>
        </div>
      </div>

      {/* Chat log */}
      <div className="lw-chatlog" ref={scrollRef}>
        <div className="lw-daysplit"><span>—— {firstDay} ——</span></div>
        {msgs.length === 0 && !busy && (
          <div className="lw-empty">She's online, seems to be waiting for you to say hi first…</div>
        )}
        {msgs.map((m) =>
          m.role === 'sys'
            ? <div key={m.id} className="lw-daysplit"><span>{m.content}</span></div>
            : (
              <div key={m.id} className={`lw-msg ${m.role === 'user' ? 'me' : 'her'}`}>
                <div className="lw-mava">{m.role === 'user' ? '🐧' : <Portrait />}</div>
                <div className="lw-mbody">
                  <div className="lw-mmeta">
                    {m.role === 'user' ? `${hms(toDate(m.created_at))} Me` : `Su Wan ${hms(toDate(m.created_at))}`}
                  </div>
                  <div className="lw-bubble">{m.role === 'bot' ? renderContent(m.content) : m.content}</div>
                </div>
              </div>
            ),
        )}
      </div>

      {/* Toolbar */}
      <div className="lw-tools">
        <span className={`lw-tool ${emoOpen ? 'on' : ''}`} title="Emoji" onClick={() => setEmoOpen((v) => !v)}>😊</span>
        {emoOpen && (
          <div className="lw-emojis">
            {EMOJIS.map((e) => (
              <span key={e} className="lw-emo" onClick={() => { setText((t) => t + e); inputRef.current?.focus(); }}>{e}</span>
            ))}
          </div>
        )}
        <span className={`lw-typing ${busy ? 'show' : ''}`}>Su Wan is typing<i>…</i></span>
      </div>

      {/* Input area */}
      <div className="lw-inputarea">
        <textarea
          ref={inputRef}
          className="lw-input"
          value={text}
          disabled={busy}
          placeholder="Say something to her… (she'll remember it)"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); onSend(); }
          }}
        />
        <div className="lw-sendrow">
          <span className="lw-hint">Enter to send · Shift+Enter for a new line</span>
          <button className="lw-send" disabled={busy || !text.trim()} onClick={() => onSend()}>Send (S)</button>
        </div>
      </div>
    </div>
  );
}
