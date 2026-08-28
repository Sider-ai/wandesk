import { usePoker } from './lib/usePoker';
import { Table } from './components/Table';
import { FeedPanel } from './components/FeedPanel';
import './style.css';

/* ════════════════════════════════════════════════════════════════════
   炸金花 · Zhajinhua — 单挑三张,对手是真人决策的 AI。
   发牌/比牌/筹码全是纯 TypeScript;AI 每一步来自一次 agent() 请求(局势 +
   schema → { action, say }),兜底本地决策保证不卡死。
   本文件只做:顶栏 + 组装(左牌桌 + 右播报)。逻辑在 lib/usePoker,
   AI 回合在 lib/aiTurn,牌/牌局纯逻辑在 lib/cards+game,数据在 db.ts。
   ════════════════════════════════════════════════════════════════════ */

export default function Poker({ appId }: { appId: string }) {
  const pk = usePoker(appId);

  return (
    <div className={`pk-root ${pk.phase === 'over' ? 'pk-resolved' : ''}`}>
      <div className="pk-bar">
        <div className="pk-brand"><span className="pk-brand-ico">🃏</span> 炸金花</div>
        <div className="pk-bank">
          <span className="pk-coin" aria-hidden>●</span>
          <span className="pk-chips">{pk.chips}</span>
          <span className="pk-rec">
            <b className="pk-rec-w">胜 {pk.record.win}</b>
            <i className="pk-rec-dot" aria-hidden />
            <b className="pk-rec-l">负 {pk.record.lose}</b>
          </span>
        </div>
        <button className="pk-reset" onClick={pk.onReset} title="筹码恢复 1000 并清空战绩">重置</button>
      </div>

      <div className="pk-body">
        <Table pk={pk} />
        <FeedPanel pk={pk} />
      </div>
    </div>
  );
}
