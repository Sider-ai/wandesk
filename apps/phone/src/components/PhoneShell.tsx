// Phone shell — earpiece + LCD (fixed status bar + screen body) + three options / free text input. Pure presentation.
import { type RefObject } from 'react';
import type { Screen } from '../lib/screen';

export function PhoneShell({
  screen, loading, busy, toast, clock, custom, setCustom, onChoose, lcdRef,
}: {
  screen: Screen | null;
  loading: boolean;
  busy: boolean;
  toast: string;
  clock: string;
  custom: string;
  setCustom: (v: string) => void;
  onChoose: (raw: string) => void;
  lcdRef: RefObject<HTMLDivElement | null>;
}) {
  const options = (screen?.options || []).slice(0, 3);

  return (
    <div className="ph-room">
      <div className="ph-phone">
        <div className="ph-head"><span className="ph-earpiece" aria-hidden /></div>

        {/* ── LCD ── */}
        <div className="ph-lcd">
          <div className="ph-status">
            <span className="ph-signal" aria-hidden><i /><i /><i /><i /></span>
            <span className="ph-3g">3G</span>
            <span className="ph-carrier">Carrier</span>
            <span className="ph-clock">{clock}</span>
            <span className="ph-batt" aria-hidden><b style={{ width: '76%' }} /></span>
          </div>
          <div className="ph-scan" aria-hidden />
          {loading ? (
            <div className="ph-lcd-body ph-loading">
              <div className="ph-toast">{toast}<span className="ph-cursor">▮</span></div>
              <div className="ph-prog"><span /></div>
            </div>
          ) : (
            <div className="ph-lcd-body" ref={lcdRef} dangerouslySetInnerHTML={{ __html: screen?.content || '' }} />
          )}
        </div>

        {/* ── controls: 3 options + free text ── */}
        <div className="ph-controls">
          <div className="ph-opts">
            {loading
              ? [0, 1, 2].map((i) => <span key={i} className="ph-skel" aria-hidden />)
              : options.map((o, i) => (
                  <button key={i} className="ph-opt" disabled={busy} onClick={() => onChoose(o.text)}>
                    <span className="ph-opt-key">{i + 1}</span>
                    <span className="ph-opt-txt">{o.text}</span>
                  </button>
                ))}
          </div>
          <div className="ph-inputrow">
            <input
              className="ph-input"
              value={custom}
              disabled={busy || loading}
              placeholder="Or type what you want to do…"
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && custom.trim()) onChoose(custom); }}
            />
            <button className="ph-send" disabled={busy || loading || !custom.trim()} onClick={() => onChoose(custom)}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
