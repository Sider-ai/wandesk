// 左半:信息头 + 聊天记录 + 工具条 + 输入区。纯展示,状态与发送逻辑都在 index。
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
      {/* 信息头:头像 · 昵称 · 等级 · 签名 */}
      <div className="lw-header">
        <div className="lw-ava-frame">
          <div className="lw-ava-face"><Portrait thinking={busy} /></div>
          <span className="lw-online-dot" title="在线" />
        </div>
        <div className="lw-who">
          <div className="lw-name">
            苏晚
            <span className="lw-lv" title={`等级随聊天增长 · 已聊 ${msgs.length} 句`}>{levelIcons(msgs.length)}</span>
          </div>
          <div className="lw-sig">签名:不是所有的相遇都是久别重逢。</div>
        </div>
      </div>

      {/* 聊天记录 */}
      <div className="lw-chatlog" ref={scrollRef}>
        <div className="lw-daysplit"><span>—— {firstDay} ——</span></div>
        {msgs.length === 0 && !busy && (
          <div className="lw-empty">她在线,似乎在等你先开口…</div>
        )}
        {msgs.map((m) =>
          m.role === 'sys'
            ? <div key={m.id} className="lw-daysplit"><span>{m.content}</span></div>
            : (
              <div key={m.id} className={`lw-msg ${m.role === 'user' ? 'me' : 'her'}`}>
                <div className="lw-mava">{m.role === 'user' ? '🐧' : <Portrait />}</div>
                <div className="lw-mbody">
                  <div className="lw-mmeta">
                    {m.role === 'user' ? `${hms(toDate(m.created_at))} 我` : `苏晚 ${hms(toDate(m.created_at))}`}
                  </div>
                  <div className="lw-bubble">{m.role === 'bot' ? renderContent(m.content) : m.content}</div>
                </div>
              </div>
            ),
        )}
      </div>

      {/* 工具条 */}
      <div className="lw-tools">
        <span className={`lw-tool ${emoOpen ? 'on' : ''}`} title="表情" onClick={() => setEmoOpen((v) => !v)}>😊</span>
        {emoOpen && (
          <div className="lw-emojis">
            {EMOJIS.map((e) => (
              <span key={e} className="lw-emo" onClick={() => { setText((t) => t + e); inputRef.current?.focus(); }}>{e}</span>
            ))}
          </div>
        )}
        <span className={`lw-typing ${busy ? 'show' : ''}`}>苏晚 正在输入<i>…</i></span>
      </div>

      {/* 输入区 */}
      <div className="lw-inputarea">
        <textarea
          ref={inputRef}
          className="lw-input"
          value={text}
          disabled={busy}
          placeholder="想对她说点什么…(她都会记得)"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); onSend(); }
          }}
        />
        <div className="lw-sendrow">
          <span className="lw-hint">Enter 发送 · Shift+Enter 换行</span>
          <button className="lw-send" disabled={busy || !text.trim()} onClick={() => onSend()}>发送(S)</button>
        </div>
      </div>
    </div>
  );
}
