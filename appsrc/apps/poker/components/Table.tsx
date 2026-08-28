// 左侧牌桌:底池 + AI 座位 + 中央状态(开局/结算)+ 你的座位。
import type { PokerState } from '../lib/usePoker';
import { BASE_STAKE } from '../lib/game';
import { CardView } from './Card';
import { ChipStack } from './Chips';

export function Table({ pk }: { pk: PokerState }) {
  const { phase, pot, stake, potFly, ai, human, winnerId, myTurn, aiActive, chips, busyBank } = pk;

  return (
    <div className="pk-stage">
      <div className="pk-table">
        <div className="pk-felt" /><div className="pk-felt-grain" /><div className="pk-spot" />
        <div className="pk-vignette" /><div className="pk-rail" /><div className="pk-rail-inner" />
        <div className="pk-tabletag">黄金厅 · 现金桌</div>

        {/* pot */}
        <div className={`pk-pot ${phase === 'over' ? 'is-clearing' : ''}`}>
          <ChipStack amount={pot} variant="pot" />
          <div className="pk-pot-meta">
            <div className="pk-pot-label">底池</div>
            <div className="pk-pot-val">{pot}</div>
            {phase === 'playing' && <div className="pk-pot-stake">跟注线 {stake}</div>}
          </div>
        </div>

        {potFly !== null && (
          <div className={`pk-fly ${potFly === 0 ? 'to-hero' : 'to-ai'}`} aria-hidden>
            <span className="pk-fly-chip" /><span className="pk-fly-chip d2" /><span className="pk-fly-chip d3" />
          </div>
        )}

        {/* AI seat (top center) */}
        {ai && (
          <div className={`pk-seat ${ai.folded ? 'is-folded' : ''} ${ai.out ? 'is-out' : ''} ${aiActive ? 'is-active' : ''} ${winnerId === ai.id ? 'is-winner' : ''}`}>
            <div className="pk-cards">
              {ai.cards.map((c, i) => (
                <CardView key={i} card={c} faceUp={phase === 'over' || ai.peeked} idx={i} dealing={phase === 'dealing'} />
              ))}
            </div>
            <div className="pk-betrow">
              {ai.folded ? <span className="pk-tag fold">弃牌</span>
                : ai.out ? <span className="pk-tag out">出局</span>
                : <><ChipStack amount={ai.bet} variant="seat" /><span className="pk-bet">{ai.bet}</span></>}
              {(phase === 'over' || ai.peeked) && !ai.folded && <span className="pk-hand">{ai.eval.name}</span>}
            </div>
          </div>
        )}

        {/* center status when idle / over */}
        {phase === 'idle' && (
          <div className="pk-center">
            <div className="pk-center-emblem" aria-hidden>♠</div>
            <div className="pk-center-title">炸金花</div>
            <div className="pk-center-sub">1 对 1 单挑 · 真人决策的 AI 对手</div>
            <button className="pk-deal" onClick={() => void pk.deal()} disabled={busyBank}>发牌 开局</button>
            <div className="pk-center-tip">看牌翻倍下注,闷牌稳扎稳打 — 敢不敢一搏?</div>
          </div>
        )}
        {phase === 'over' && (
          <div className={`pk-center pk-over ${winnerId === 0 ? 'pk-win' : 'pk-lose'}`}>
            {winnerId === 0 && <div className="pk-burst" aria-hidden><i /><i /><i /><i /><i /><i /></div>}
            <div className="pk-over-badge">{winnerId === 0 ? '👑' : '🃏'}</div>
            <div className="pk-center-title">{winnerId === 0 ? '🎉 你赢了！' : '本局结束'}</div>
            <div className="pk-center-sub">{winnerId === 0 ? '底池尽收囊中' : '再战一局,扳回一城'}</div>
            <button className="pk-deal" onClick={() => void pk.deal()} disabled={busyBank || chips < BASE_STAKE}>再来一局</button>
          </div>
        )}

        {/* human seat (bottom center) */}
        {human && (
          <div className={`pk-hero ${human.folded ? 'is-folded' : ''} ${human.out ? 'is-out' : ''} ${myTurn ? 'is-active' : ''} ${winnerId === 0 ? 'is-winner' : ''}`}>
            <div className="pk-cards hero-cards">
              {human.cards.map((c, i) => (
                <CardView key={i} card={c} faceUp={phase === 'over' || human.peeked} idx={i} dealing={phase === 'dealing'} big />
              ))}
            </div>
            <div className="pk-hero-info">
              <div className="pk-hero-id">
                <span className="pk-hero-meta">
                  <span className="pk-stackline"><span className="pk-stack-coin" aria-hidden />{human.chips}</span>
                  {!human.folded && <span className="pk-hand mine">{human.eval.name}</span>}
                </span>
              </div>
              {!human.folded && !human.out && <><ChipStack amount={human.bet} variant="seat" /><span className="pk-bet hero-bet">{human.bet}</span></>}
              {human.folded && <span className="pk-tag fold">已弃牌</span>}
              {human.out && <span className="pk-tag out">已出局</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
