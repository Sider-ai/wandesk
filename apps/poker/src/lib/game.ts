// 炸金花 — 座位/牌局类型、常量、AI 决策契约与纯逻辑(下注、兜底决策、决策解析)。
import { strength, type Card, type Eval } from './cards';

export type Mood = 'idle' | 'think' | 'happy' | 'smug' | 'nervous' | 'down';
export type Phase = 'idle' | 'dealing' | 'playing' | 'over';

export type Seat = {
  id: number;
  name: string;
  emoji: string;
  isHuman: boolean;
  cards: Card[];
  eval: Eval;
  chips: number;   // chips remaining in front of this seat
  bet: number;     // chips this seat pushed into the pot this hand
  peeked: boolean; // 看牌?
  folded: boolean;
  out: boolean;    // knocked out by losing a showdown
  mood: Mood;
};

export const BOT = { name: '赌神老李', emoji: '🕶️' };
const BOT_NAME_RAW = '赌神老李';
export const TABLE_STACK = 1000; // chips the AI brings to the table per hand
export const BASE_STAKE = 10;    // 闷牌 stake unit; 看牌 costs double
export const MAX_RAISES = 6;     // raise ceiling per hand (keeps hands bounded)

// the right-hand live message feed
export type FeedKind = 'sys' | 'you' | 'ai' | 'think' | 'say' | 'result';
export type FeedLine = { id: number; kind: FeedKind; who?: string; text: string; action?: string };

export const ACTION_LABEL: Record<string, string> = {
  call: '跟注', raise: '加注', allin: '梭哈', fold: '弃牌', show: '比牌', peek: '看牌',
};

// a structured decision returned by the model
export type AiAction = 'raise' | 'allin' | 'fold' | 'compare';
export type AiDecision = { action: AiAction; amount?: number; say: string };

export const DECISION_SCHEMA = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['raise', 'allin', 'fold', 'compare'] },
    amount: { type: 'number' },
    say: { type: 'string' },
  },
  required: ['action', 'say'],
  additionalProperties: false,
};

export const AI_SYSTEM =
  '你是炸金花(三张)牌桌上的资深玩家「' + BOT_NAME_RAW + '」,正在和真人单挑。牌局里各自都能看到自己的牌。' +
  '性格老练、爱施压、偶尔诈唬,但下注合理、量力而行。' +
  '你只能从 raise(加注)/allin(梭哈全下)/compare(比牌摊牌)/fold(弃牌) 里选一个动作(没有单纯跟注)。' +
  '务必只输出一个 JSON 对象,形如 {"action":"raise","say":"一句不超过14字的中文台词"};' +
  '需要时可带 amount(整数,加注额)。say 必须是地道、带情绪的中文嘴炮,不要解释、不要标点堆砌、不要引号。';

// Robustly pull a decision out of an agent() reply (Codex fills json; Claude returns text).
function parseDecision(raw: string): AiDecision | null {
  if (!raw) return null;
  let text = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const m = text.match(/\{[\s\S]*\}/);
  if (m) text = m[0];
  try {
    const o = JSON.parse(text) as Partial<AiDecision> & { action?: string };
    const a = String(o.action || '').toLowerCase();
    const action: AiAction | null =
      a === 'raise' ? 'raise'
      : a === 'allin' || a === 'all-in' || a === 'shove' || a === 'push' || a === '梭哈' ? 'allin'
      : a === 'fold' ? 'fold'
      : a === 'compare' || a === 'show' || a === 'showdown' ? 'compare'
      : a === 'call' || a === 'check' || a === 'see' ? 'raise' // no plain call now → treat as a raise to stay in
      : null;
    if (!action) return null;
    const say = (o.say ?? '').toString().trim().split('\n')[0].slice(0, 28);
    const amount = typeof o.amount === 'number' && isFinite(o.amount) ? o.amount : undefined;
    return { action, amount, say };
  } catch { return null; }
}

export function extractDecision(r: { ok: boolean; json?: unknown; result?: string }): AiDecision | null {
  if (!r.ok) return null;
  if (r.json && typeof r.json === 'object') {
    const d = parseDecision(JSON.stringify(r.json));
    if (d) return d;
  }
  return parseDecision(r.result || '');
}

// apply one bet (call/raise) for a seat, return updated arrays
export function placeBet(arr: Seat[], idx: number, raise: boolean, curStake: number) {
  const me = arr[idx];
  const want = raise ? curStake + BASE_STAKE : curStake;
  const pay = Math.min(want, me.chips);
  const updated = arr.map((s, i) => (i === idx ? { ...s, chips: s.chips - pay, bet: s.bet + pay } : s));
  const newStake = raise ? curStake + BASE_STAKE : curStake;
  return { updated, pay, newStake, raised: raise };
}

// safe fallback move (used if agent() fails / times out)
export function fallbackDecide(me: Seat, opp: Seat, curStake: number, raises: number): AiDecision {
  const st = strength(me.eval);
  const potNow = me.bet + opp.bet;
  const callCost = curStake;
  const odds = callCost / (potNow + callCost);
  const r = Math.random();
  if (opp.chips === 0) return st > 0.35 ? { action: 'compare', say: '那就开牌' } : { action: 'fold', say: '不奉陪了' };
  if (st > 0.9 && me.chips > callCost) return { action: 'allin', say: '我全下,敢不敢' };
  if (st > 0.6 && me.chips >= callCost) return { action: 'compare', say: '别磨蹭,开牌' };
  if (st < 0.18 + odds * 0.5 && r > 0.3) return { action: 'fold', say: '这把我不奉陪' };
  if (st > 0.5 && raises < MAX_RAISES && r < 0.6 && me.chips > callCost + BASE_STAKE) {
    return { action: 'raise', say: '加一手,跟不跟' };
  }
  return st > 0.3 && me.chips >= callCost ? { action: 'compare', say: '开了' } : { action: 'fold', say: '算了' };
}
