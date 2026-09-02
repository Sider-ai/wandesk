// Zhajinhua — seat/hand types, constants, the AI decision contract, and pure logic (betting, fallback decisions, decision parsing).
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
  peeked: boolean; // has this seat peeked at its cards?
  folded: boolean;
  out: boolean;    // knocked out by losing a showdown
  mood: Mood;
};

export const BOT = { name: 'Old Lee the Shark', emoji: '🕶️' };
const BOT_NAME_RAW = 'Old Lee the Shark';
export const TABLE_STACK = 1000; // chips the AI brings to the table per hand
export const BASE_STAKE = 10;    // blind stake unit; a peeked hand costs double
export const MAX_RAISES = 6;     // raise ceiling per hand (keeps hands bounded)

// the right-hand live message feed
export type FeedKind = 'sys' | 'you' | 'ai' | 'think' | 'say' | 'result';
export type FeedLine = { id: number; kind: FeedKind; who?: string; text: string; action?: string };

export const ACTION_LABEL: Record<string, string> = {
  call: 'Call', raise: 'Raise', allin: 'All In', fold: 'Fold', show: 'Compare', peek: 'Peek',
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
  'You are "' + BOT_NAME_RAW + '", a seasoned player at a heads-up Zhajinhua (three-card) table, ' +
  'facing off against a real human. Each player can only see their own cards. ' +
  'You are cool-headed, love to pile on pressure, and bluff now and then, but you bet sensibly and within your means. ' +
  'You may only pick one action from raise / allin (shove everything) / compare (showdown) / fold — there is no plain call. ' +
  'You must output only a single JSON object, like {"action":"raise","say":"a one-liner under 8 words"}; ' +
  'include amount (an integer raise amount) when relevant. say must be a punchy, in-character taunt with real attitude — no explanations, no stacked punctuation, no quote marks.';

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
      : a === 'allin' || a === 'all-in' || a === 'shove' || a === 'push' ? 'allin'
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
  if (opp.chips === 0) return st > 0.35 ? { action: 'compare', say: 'Let\'s see it then' } : { action: 'fold', say: 'Not this time' };
  if (st > 0.9 && me.chips > callCost) return { action: 'allin', say: 'I\'m all in, you got the guts?' };
  if (st > 0.6 && me.chips >= callCost) return { action: 'compare', say: 'Quit stalling, show \'em' };
  if (st < 0.18 + odds * 0.5 && r > 0.3) return { action: 'fold', say: 'I\'ll pass on this one' };
  if (st > 0.5 && raises < MAX_RAISES && r < 0.6 && me.chips > callCost + BASE_STAKE) {
    return { action: 'raise', say: 'Raising — you in or out?' };
  }
  return st > 0.3 && me.chips >= callCost ? { action: 'compare', say: 'Let\'s go' } : { action: 'fold', say: 'Never mind' };
}
