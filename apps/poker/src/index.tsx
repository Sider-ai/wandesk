import { usePoker } from './lib/usePoker';
import { Table } from './components/Table';
import { FeedPanel } from './components/FeedPanel';
import './style.css';

/* ════════════════════════════════════════════════════════════════════
   Zhajinhua — heads-up three-card poker against a real AI decision-maker.
   Dealing, comparing hands, and chip math are all plain TypeScript; each
   AI move comes from an agent() request (situation + schema → { action, say }),
   with a local fallback decision so play never stalls.
   This file only does: the top bar + layout (table on the left, feed on the
   right). Logic lives in lib/usePoker, the AI's turn in lib/aiTurn, pure
   card/hand logic in lib/cards + game, data in db.ts.
   ════════════════════════════════════════════════════════════════════ */

export default function Poker({ appId }: { appId: string }) {
  const pk = usePoker(appId);

  return (
    <div className={`pk-root ${pk.phase === 'over' ? 'pk-resolved' : ''}`}>
      <div className="pk-bar">
        <div className="pk-brand"><span className="pk-brand-ico">🃏</span> Zhajinhua</div>
        <div className="pk-bank">
          <span className="pk-coin" aria-hidden>●</span>
          <span className="pk-chips">{pk.chips}</span>
          <span className="pk-rec">
            <b className="pk-rec-w">W {pk.record.win}</b>
            <i className="pk-rec-dot" aria-hidden />
            <b className="pk-rec-l">L {pk.record.lose}</b>
          </span>
        </div>
        <button className="pk-reset" onClick={pk.onReset} title="Restores chips to 1000 and clears your record">Reset</button>
      </div>

      <div className="pk-body">
        <Table pk={pk} />
        <FeedPanel pk={pk} />
      </div>
    </div>
  );
}
