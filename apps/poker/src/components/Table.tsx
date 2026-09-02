// Left-side table: pot + AI seat + center status (start/resolution) + your seat.
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
        <div className="pk-tabletag">Golden Room · Cash Table</div>

        {/* pot */}
        <div className={`pk-pot ${phase === 'over' ? 'is-clearing' : ''}`}>
          <ChipStack amount={pot} variant="pot" />
          <div className="pk-pot-meta">
            <div className="pk-pot-label">Pot</div>
            <div className="pk-pot-val">{pot}</div>
            {phase === 'playing' && <div className="pk-pot-stake">Call {stake}</div>}
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
              {ai.folded ? <span className="pk-tag fold">Folded</span>
                : ai.out ? <span className="pk-tag out">Out</span>
                : <><ChipStack amount={ai.bet} variant="seat" /><span className="pk-bet">{ai.bet}</span></>}
              {(phase === 'over' || ai.peeked) && !ai.folded && <span className="pk-hand">{ai.eval.name}</span>}
            </div>
          </div>
        )}

        {/* center status when idle / over */}
        {phase === 'idle' && (
          <div className="pk-center">
            <div className="pk-center-emblem" aria-hidden>♠</div>
            <div className="pk-center-title">Zhajinhua</div>
            <div className="pk-center-sub">1 on 1 heads-up · a real AI decision-maker</div>
            <button className="pk-deal" onClick={() => void pk.deal()} disabled={busyBank}>Deal</button>
            <div className="pk-center-tip">Peeking doubles your bet, staying blind plays it safe — feeling lucky?</div>
          </div>
        )}
        {phase === 'over' && (
          <div className={`pk-center pk-over ${winnerId === 0 ? 'pk-win' : 'pk-lose'}`}>
            {winnerId === 0 && <div className="pk-burst" aria-hidden><i /><i /><i /><i /><i /><i /></div>}
            <div className="pk-over-badge">{winnerId === 0 ? '👑' : '🃏'}</div>
            <div className="pk-center-title">{winnerId === 0 ? '🎉 You win!' : 'Hand over'}</div>
            <div className="pk-center-sub">{winnerId === 0 ? 'The pot is all yours' : 'Run it back and take it next time'}</div>
            <button className="pk-deal" onClick={() => void pk.deal()} disabled={busyBank || chips < BASE_STAKE}>Play Again</button>
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
              {human.folded && <span className="pk-tag fold">Folded</span>}
              {human.out && <span className="pk-tag out">Out</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
