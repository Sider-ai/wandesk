// 卦坛:卦名冠 + 六爻逐条(阴阳、变爻朱点、铜钱)。casting 时高亮当前起的那一爻。
import { TRIGRAM_GLYPHS, TRIGRAM_NAMES, YAO_LABELS } from '../lib/yijing';

export function Altar({
  tone, casting, phase, hexName, pair, yaos, coins, changing, castIdx,
}: {
  tone: string;
  casting: boolean;
  phase: string;
  hexName: string;
  pair: { upper: number; lower: number } | null;
  yaos: (number | null)[];
  coins: number[][];
  changing: boolean[];
  castIdx: number;
}) {
  return (
    <div className={`fo-altar fo-tone-${tone} ${casting ? 'fo-altar-live' : ''}`}>
      <div className="fo-altar-corner tl" /><div className="fo-altar-corner tr" />
      <div className="fo-altar-corner bl" /><div className="fo-altar-corner br" />
      <div className="fo-altar-aura" aria-hidden />
      <div className="fo-incense" aria-hidden>
        <span className="fo-smoke fo-smoke-1" /><span className="fo-smoke fo-smoke-2" /><span className="fo-smoke fo-smoke-3" />
      </div>

      {hexName ? (
        <div className="fo-hexcrown">
          {pair && <span className="fo-tg-glyph fo-tg-up" title={TRIGRAM_NAMES[pair.upper]}>{TRIGRAM_GLYPHS[pair.upper]}</span>}
          <span className="fo-hexname">{hexName}</span>
          {pair && <span className="fo-tg-glyph fo-tg-dn" title={TRIGRAM_NAMES[pair.lower]}>{TRIGRAM_GLYPHS[pair.lower]}</span>}
        </div>
      ) : (
        <div className="fo-hexname fo-hexname-ph">{phase === 'shaking' ? '正在起卦…' : '　'}</div>
      )}

      <div className="fo-yaos">
        {yaos.map((y, i) => {
          const struck = castIdx === i;
          return (
            <div
              key={i}
              className={`fo-yao-row ${y !== null ? 'set' : ''} ${changing[i] ? 'chg' : ''} ${struck ? 'live' : ''}`}
              style={{ opacity: y !== null ? 1 : struck ? 0.9 : 0.16 }}
            >
              <span className="fo-yao-label">{YAO_LABELS[i]}</span>
              <span className="fo-yao-bar">
                {y === 1 && <span className="fo-bar fo-bar-yang">{changing[i] && <span className="fo-chg-dot" />}</span>}
                {y === 0 && (<><span className="fo-bar fo-bar-yin" />{changing[i] && <span className="fo-chg-dot fo-chg-dot-mid" />}<span className="fo-bar fo-bar-yin" /></>)}
                {y === null && <span className="fo-bar fo-bar-empty" />}
                {struck && <span className="fo-strike" aria-hidden />}
              </span>
              <span className="fo-coins">
                {(coins[i] || []).map((c, j) => (
                  <span key={j} className={`fo-coin ${c ? 'face' : 'back'} ${struck ? 'tumble' : ''}`} style={{ animationDelay: `${j * 110}ms` }}>
                    {c ? '字' : '背'}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
      </div>

      {hexName && changing.some(Boolean) && (
        <div className="fo-chg-legend"><span className="fo-chg-dot fo-chg-dot-inline" />朱点为变爻 · 动则生变</div>
      )}
    </div>
  );
}
