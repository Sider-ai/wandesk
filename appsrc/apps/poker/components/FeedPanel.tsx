// 右侧:对手头像 + 实时播报流 + 底部行动条(加注/梭哈/比牌/弃牌)。
import type { PokerState } from '../lib/usePoker';
import { BASE_STAKE, BOT, MAX_RAISES } from '../lib/game';
import { Avatar } from './Chips';
import { FeedRow } from './Feed';

export function FeedPanel({ pk }: { pk: PokerState }) {
  const { ai, aiActive, phase, feed, aiThinking, myTurn, human, stake } = pk;
  const raiseCostNow = stake + BASE_STAKE;

  return (
    <aside className="pk-feed">
      <div className="pk-feed-head">
        <div className="pk-feed-ava">
          <Avatar emoji={ai ? ai.emoji : BOT.emoji} mood={aiActive ? 'think' : ai ? ai.mood : 'idle'} active={aiActive} />
        </div>
        <div className="pk-feed-title-wrap">
          <div className="pk-feed-title">
            {ai ? ai.name : BOT.name}
            {aiActive && <span className="pk-thinking"><i /><i /><i /></span>}
          </div>
          <div className="pk-feed-sub">
            {ai ? <span className="pk-feed-chips"><span className="pk-stack-coin" aria-hidden />{ai.chips}</span> : '对手的心思与动作'}
          </div>
        </div>
        <span className={`pk-feed-live ${phase === 'playing' ? 'on' : ''}`} aria-hidden />
      </div>

      <div className="pk-feed-scroll" ref={pk.feedRef}>
        {feed.length === 0 && !aiThinking && (
          <div className="pk-feed-empty">
            <span className="pk-feed-empty-ico" aria-hidden>💬</span>
            开局后,对手的思考、台词和每一步动作都会在这里实时播报。
          </div>
        )}
        {feed.map((l) => <FeedRow key={l.id} line={l} botEmoji={BOT.emoji} />)}
        {aiThinking && (
          <div className="pk-msg ai thinking">
            <span className="pk-msg-ava" aria-hidden>{BOT.emoji}</span>
            <div className="pk-msg-body">
              <div className="pk-msg-who">{BOT.name}</div>
              <div className="pk-msg-think">正在盘算……<span className="pk-think-dots"><i /><i /><i /></span></div>
            </div>
          </div>
        )}
      </div>

      {/* 行动条 */}
      <div className="pk-actions">
        <button
          className="pk-act raise"
          onClick={() => pk.onCallOrRaise(true)}
          disabled={!myTurn || pk.raisesRef.current >= MAX_RAISES || ai?.chips === 0 || (!!human && human.chips < stake + BASE_STAKE)}
        >
          <span className="pk-act-lbl">加注</span>
          <span className="pk-act-cost">{raiseCostNow}</span>
        </button>
        <button className="pk-act call" onClick={pk.onAllIn} disabled={!myTurn || !human || human.chips <= 0 || ai?.chips === 0}>
          <span className="pk-act-lbl">梭哈</span>
        </button>
        <button className="pk-act show" onClick={pk.onShowdown} disabled={!myTurn}>
          <span className="pk-act-ico" aria-hidden>⚔</span>
          <span className="pk-act-lbl">比牌</span>
        </button>
        <button className="pk-act fold" onClick={pk.onFold} disabled={!myTurn}>
          <span className="pk-act-lbl">弃牌</span>
        </button>
      </div>
    </aside>
  );
}
