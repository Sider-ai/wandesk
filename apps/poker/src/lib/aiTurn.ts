// 炸金花 — AI 的一步:向模型要决策(附带牌桌局势 + schema),兜底本地决策,再落到牌局上。
// 与状态解耦:所有 state 通过 ctx 里的 ref / setter 读写,usePoker 组装 ctx 并在 AI 回合触发。
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { agent } from '../wandesk/agent';
import { TYPE_NAME, cardText, compare, strength } from './cards';
import {
  AI_SYSTEM, BOT, DECISION_SCHEMA, MAX_RAISES,
  extractDecision, fallbackDecide, placeBet,
  type AiDecision, type FeedLine, type Mood, type Seat,
} from './game';

export type PokerCtx = {
  appId: string;
  seatsRef: MutableRefObject<Seat[]>;
  stakeRef: MutableRefObject<number>;
  raisesRef: MutableRefObject<number>;
  lastHumanActionRef: MutableRefObject<string>;
  setSeats: Dispatch<SetStateAction<Seat[]>>;
  setAiThinking: (b: boolean) => void;
  setStake: (n: number) => void;
  setPot: (n: number) => void;
  setTurn: (n: number) => void;
  pushFeed: (line: Omit<FeedLine, 'id'>) => void;
  settle: (finalSeats: Seat[], winId: number) => Promise<void> | void;
};

// ── ask the model for the AI's move, then apply it ──
export async function runAiTurn(ctx: PokerCtx) {
  const arr0 = ctx.seatsRef.current;
  const me = arr0.find((s) => !s.isHuman);
  const opp = arr0.find((s) => s.isHuman);
  if (!me || !opp || me.folded || me.out) return;
  const curStake = ctx.stakeRef.current;

  ctx.setSeats((cur) => cur.map((s) => (s.id === me.id ? { ...s, mood: 'think' } : s)));
  ctx.setAiThinking(true);

  const potNow = me.bet + opp.bet;
  const callCost = curStake;
  const oppAllIn = opp.chips === 0;
  const handDesc = `你的牌是 ${TYPE_NAME[me.eval.type]}(${me.cards.map(cardText).join(' ')})`;
  const lastAct = ctx.lastHumanActionRef.current ? `对手刚刚:${ctx.lastHumanActionRef.current}` : '你先手行动';
  const prompt =
    `单挑炸金花,现在轮到你。\n` +
    `${handDesc}。对手的牌你看不到。\n` +
    `底池 ${potNow} 筹码,当前注 ${curStake}。\n` +
    `你的剩余筹码 ${me.chips}${oppAllIn ? '(对手已梭哈全下,你只能 compare 比牌 或 fold 弃牌)' : ''}。本局已加注 ${ctx.raisesRef.current} 次(上限 ${MAX_RAISES})。\n` +
    `${lastAct}。\n` +
    `综合牌力、底池和对手动作,做出你的决策(raise/allin/compare/fold)并说一句台词。`;

  let decision: AiDecision | null = null;
  try {
    const r = await agent(ctx.appId, prompt, { system: AI_SYSTEM, schema: DECISION_SCHEMA });
    decision = extractDecision(r);
  } catch { decision = null; }
  if (!decision) decision = fallbackDecide(me, opp, curStake, ctx.raisesRef.current);

  // sanity-clamp the decision against the rules
  if (opp.chips === 0 && (decision.action === 'raise' || decision.action === 'allin')) decision.action = 'compare';
  if (decision.action === 'raise' && (ctx.raisesRef.current >= MAX_RAISES || me.chips <= callCost)) {
    decision.action = me.chips >= callCost ? 'compare' : 'fold';
  }
  if (decision.action === 'allin' && me.chips <= 0) decision.action = 'fold';

  ctx.setAiThinking(false);
  if (decision.say) ctx.pushFeed({ kind: 'say', who: BOT.name, text: decision.say });
  await new Promise((res) => window.setTimeout(res, 480)); // beat between speaking and acting
  applyAiDecision(ctx, decision);
}

// ── apply the AI's chosen action to the game ──
function applyAiDecision(ctx: PokerCtx, d: AiDecision) {
  const arr = ctx.seatsRef.current;
  const idx = arr.findIndex((s) => !s.isHuman);
  const me = arr[idx];
  const opp = arr.find((s) => s.isHuman);
  if (!me || !opp) return;
  const curStake = ctx.stakeRef.current;

  if (d.action === 'fold') {
    const updated = arr.map((s, i) => (i === idx ? { ...s, folded: true, mood: 'down' as Mood } : s));
    ctx.setSeats(updated);
    ctx.pushFeed({ kind: 'ai', who: BOT.name, text: '弃牌离场。', action: 'fold' });
    void ctx.settle(updated, opp.id); // last player standing wins
    return;
  }

  if (d.action === 'compare') {
    const paid = placeBet(arr, idx, false, curStake); // pay a call to enter the showdown, then compare
    const meP = paid.updated[idx];
    const oppP = paid.updated.find((s) => s.isHuman)!;
    const cmp = compare(meP.eval, oppP.eval);
    ctx.pushFeed({ kind: 'ai', who: BOT.name, text: '摊牌比大小!', action: 'show' });
    const aiWins = cmp > 0; // on a tie the challenger (AI) loses
    const revealed = paid.updated.map((s) => ({ ...s, peeked: true }));
    ctx.setSeats(revealed);
    ctx.setPot(revealed.reduce((s, x) => s + x.bet, 0));
    void ctx.settle(revealed, aiWins ? meP.id : oppP.id);
    return;
  }

  if (d.action === 'allin') { // 梭哈 — push everything
    const pay = me.chips;
    const updated = arr.map((s, i) => (i === idx ? { ...s, chips: 0, bet: s.bet + pay, mood: 'smug' as Mood } : s));
    ctx.raisesRef.current += 1;
    ctx.setSeats(updated);
    ctx.setStake(updated[idx].bet);
    ctx.setPot(updated.reduce((s, x) => s + x.bet, 0));
    ctx.pushFeed({ kind: 'ai', who: BOT.name, action: 'allin', text: `梭哈全下 ${pay}` });
    ctx.setTurn(0);
    return;
  }

  // 加注 (raise)
  const res = placeBet(arr, idx, true, curStake);
  ctx.raisesRef.current += 1;
  const mood: Mood = strength(me.eval) > 0.5 ? 'smug' : 'nervous';
  ctx.setSeats(res.updated.map((s) => (s.id === me.id ? { ...s, mood } : s)));
  ctx.setStake(res.newStake);
  ctx.setPot(res.updated.reduce((s, x) => s + x.bet, 0));
  ctx.pushFeed({ kind: 'ai', who: BOT.name, action: 'raise', text: `加注施压 ${res.pay} 筹码 (跟注线 ${res.newStake})。` });
  ctx.setTurn(0); // action returns to the human
}
