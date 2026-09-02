// Zhajinhua — cards, shuffling, hand evaluation, and comparison (plain TypeScript, no AI involved).
export type Suit = '♠' | '♥' | '♦' | '♣';
export type Card = { rank: number; suit: Suit }; // rank 2..14 (11=J 12=Q 13=K 14=A)

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
export const RANK_LABEL: Record<number, string> = {
  2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
  10: '10', 11: 'J', 12: 'Q', 13: 'K', 14: 'A',
};

export function freshDeck(): Card[] {
  const d: Card[] = [];
  for (const suit of SUITS) for (let rank = 2; rank <= 14; rank++) d.push({ rank, suit });
  for (let i = d.length - 1; i > 0; i--) { // Fisher–Yates
    const j = Math.floor(Math.random() * (i + 1));
    const t = d[i]; d[i] = d[j]; d[j] = t;
  }
  return d;
}

// Hand types: 6 Three of a Kind > 5 Straight Flush > 4 Flush > 3 Straight > 2 Pair > 1 High Card
export type HandType = 1 | 2 | 3 | 4 | 5 | 6;
export type Eval = { type: HandType; vals: number[]; name: string };

export const TYPE_NAME: Record<HandType, string> = {
  6: 'Three of a Kind', 5: 'Straight Flush', 4: 'Flush', 3: 'Straight', 2: 'Pair', 1: 'High Card',
};

export function evaluate(cards: Card[]): Eval {
  const vals = cards.map((c) => c.rank).sort((a, b) => b - a); // high→low
  const sameSuit = cards[0].suit === cards[1].suit && cards[1].suit === cards[2].suit;
  const asc = [...vals].sort((a, b) => a - b);
  const normalStraight = asc[1] - asc[0] === 1 && asc[2] - asc[1] === 1;
  const wheel = asc[0] === 2 && asc[1] === 3 && asc[2] === 14; // A-2-3, lowest straight
  const straight = normalStraight || wheel;
  const straightVals = wheel ? [3, 2, 1] : vals; // wheel: A plays low, so Q-K-A still beats it

  let type: HandType;
  let ranked: number[];
  if (vals[0] === vals[1] && vals[1] === vals[2]) { type = 6; ranked = vals; }
  else if (sameSuit && straight) { type = 5; ranked = straightVals; }
  else if (sameSuit) { type = 4; ranked = vals; }
  else if (straight) { type = 3; ranked = straightVals; }
  else if (vals[0] === vals[1] || vals[1] === vals[2] || vals[0] === vals[2]) {
    const pair = vals[0] === vals[1] ? vals[0] : vals[1] === vals[2] ? vals[1] : vals[0];
    const kicker = vals.find((v) => v !== pair) ?? pair;
    type = 2; ranked = [pair, kicker];
  } else { type = 1; ranked = vals; }
  return { type, vals: ranked, name: TYPE_NAME[type] };
}

// >0 : a beats b ; <0 : b beats a ; 0 : tie
export function compare(a: Eval, b: Eval): number {
  if (a.type !== b.type) return a.type - b.type;
  for (let i = 0; i < a.vals.length; i++) if (a.vals[i] !== b.vals[i]) return a.vals[i] - b.vals[i];
  return 0;
}

// Rough 0..1 strength used only by the safe fallback (independent of opponent).
export function strength(e: Eval): number {
  const high = e.vals[0] ?? 2;
  switch (e.type) {
    case 6: return 0.98 + high / 1400;
    case 5: return 0.92 + high / 1800;
    case 4: return 0.66 + high / 60;
    case 3: return 0.55 + high / 80;
    case 2: return 0.30 + high / 45;
    default: return 0.05 + high / 38; // single, ~0.05..0.42
  }
}

export const cardText = (c: Card): string => RANK_LABEL[c.rank] + c.suit;
