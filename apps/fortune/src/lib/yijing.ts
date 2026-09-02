// I Ching (fortune) — data and pure logic for the six-line divination: hexagram
// table, casting, reading parsing, diviner persona, display helpers.

export type Reading = {
  signName: string;
  signPoem: string;
  good: string;
  bad: string;
  advice: string;
};
export type Phase = 'idle' | 'shaking' | 'reading' | 'done';

// last cast is cached (single, not a history) so reopening shows it; "Cast Again" clears it
export const CACHE_KEY = 'wandesk.fortune.last';

// ── diviner persona ──
export const DIVINER = `You are a master diviner of the I Ching (Book of Changes) — a sage of few words,
learned and eloquent, whose pronouncements are terse yet resonant with meaning.
The querent has already cast their hexagram by tossing three coins six times; you only
interpret the hexagram they were given. Never cast a new one or alter the result.

Reading requirements (stay tightly bound to the hexagram's name and meaning, and to the querent's question):
1. signName: an overall verdict, chosen from exactly one of these six —
   "Great Fortune" / "Good Fortune" / "Modest Fortune" / "Neutral" / "Slight Misfortune" / "Misfortune".
2. signPoem: an original four-line oracle verse (each line roughly five to seven words,
   in an elevated, classical register), evoking the hexagram and the question through
   imagery rather than stating things plainly.
3. good: 2-3 favorable actions, short phrases separated by commas.
4. bad: 2-3 actions to avoid, short phrases separated by commas.
5. advice: a 60-90 word interpretation with the flavor of the I Ching but plainly readable,
   never too absolute in its claims, closing with a note in the spirit of
   "do what you can, and leave the rest to fate" / "take this as guidance, not gospel,"
   urging the reader to weigh it with a clear head.

Tone: calm, assured, touched with antiquity — like the old fortune-teller stroking his
beard beside the temple's oracle slips.

Output only a single JSON object, with no explanation, no prefix or suffix, and no code fences:
{"signName":"...","signPoem":"...","good":"...","bad":"...","advice":"..."}`;

// ── 64-hexagram table (upper × lower, 0=Kun..7=Qian trigram index) ──
const HEXAGRAMS: string[][] = [
  ['Kun (The Receptive)', 'Qian (Modesty)', 'Shi (The Army)', 'Sheng (Pushing Upward)', 'Fu (Return)', 'Mingyi (Darkening of the Light)', 'Lin (Approach)', 'Tai (Peace)'],
  ['Bo (Splitting Apart)', 'Gen (Keeping Still)', 'Meng (Youthful Folly)', 'Gu (Work on the Decayed)', 'Yi (Nourishment)', 'Bi (Grace)', 'Sun (Decrease)', 'Daxu (Great Taming)'],
  ['Bi (Holding Together)', 'Jian (Obstruction)', 'Kan (The Abysmal)', 'Jing (The Well)', 'Zhun (Difficulty at the Beginning)', 'Jiji (After Completion)', 'Jie (Limitation)', 'Xu (Waiting)'],
  ['Guan (Contemplation)', 'Jian (Gradual Progress)', 'Huan (Dispersion)', 'Xun (The Gentle)', 'Yi (Increase)', 'Jiaren (The Family)', 'Zhongfu (Inner Truth)', 'Xiaochu (Small Taming)'],
  ['Yu (Enthusiasm)', 'Xiaoguo (Small Preponderance)', 'Jie (Deliverance)', 'Heng (Duration)', 'Zhen (The Arousing)', 'Feng (Abundance)', 'Guimei (The Marrying Maiden)', 'Dazhuang (Great Power)'],
  ['Jin (Progress)', 'Lu (The Wanderer)', 'Weiji (Before Completion)', 'Ding (The Cauldron)', 'Shike (Biting Through)', 'Li (The Clinging)', 'Kui (Opposition)', 'Dayou (Great Possession)'],
  ['Cui (Gathering Together)', 'Xian (Influence)', 'Kun (Oppression)', 'Daguo (Great Preponderance)', 'Sui (Following)', 'Ge (Revolution)', 'Dui (The Joyous)', 'Guai (Breakthrough)'],
  ['Pi (Standstill)', 'Dun (Retreat)', 'Song (Conflict)', 'Gou (Coming to Meet)', 'Wuwang (Innocence)', 'Tongren (Fellowship)', 'Lu (Treading)', 'Qian (The Creative)'],
];
export const YAO_LABELS = ['Top Line', 'Fifth Line', 'Fourth Line', 'Third Line', 'Second Line', 'Initial Line'];
export const TRIGRAM_NAMES = ['Kun (Earth)', 'Gen (Mountain)', 'Kan (Water)', 'Xun (Wind)', 'Zhen (Thunder)', 'Li (Fire)', 'Dui (Lake)', 'Qian (Heaven)'];
export const TRIGRAM_GLYPHS = ['☷', '☶', '☵', '☴', '☳', '☲', '☱', '☰'];
export const RING_GLYPHS = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];

const trigram = (a: number, b: number, c: number) => a * 4 + b * 2 + c;
export function lookupHexagram(yaos: number[]): string {
  const lower = trigram(yaos[0], yaos[1], yaos[2]);
  const upper = trigram(yaos[3], yaos[4], yaos[5]);
  return HEXAGRAMS[upper][lower];
}
export function trigramPair(yaos: number[]): { upper: number; lower: number } {
  return { lower: trigram(yaos[0], yaos[1], yaos[2]), upper: trigram(yaos[3], yaos[4], yaos[5]) };
}

export function shakeOnce(): { coins: number[]; yao: number; changing: boolean } {
  const c = [Math.random() < 0.5 ? 1 : 0, Math.random() < 0.5 ? 1 : 0, Math.random() < 0.5 ? 1 : 0];
  const sum = c.reduce((s, v) => s + (v ? 3 : 2), 0);
  const yao = sum === 7 || sum === 9 ? 1 : 0;
  const changing = sum === 6 || sum === 9;
  return { coins: c, yao, changing };
}

export function parseReading(raw: string): Reading {
  const fallback: Reading = {
    signName: 'Neutral',
    signPoem: 'The heavenly workings are not yet clear;\nwait for the clouds to part and the moon to rise.\nWhat the heart asks, an answer will find;\nhold to your center and all things resolve in time.',
    good: 'staying watchful, holding steady',
    bad: 'acting rashly, forcing the issue',
    advice: 'This hexagram\'s omen has not yet shown itself clearly — better to stay still than to stir. The matter you ask about is still in flux; do what you can, and leave the rest to fate. Take this as guidance, not gospel.',
  };
  let text = raw.trim();
  const m = text.match(/\{[\s\S]*\}/);
  if (m) text = m[0];
  try {
    const o = JSON.parse(text) as Partial<Reading>;
    return {
      signName: (o.signName || fallback.signName).toString().trim(),
      signPoem: (o.signPoem || fallback.signPoem).toString().trim(),
      good: (o.good || fallback.good).toString().trim(),
      bad: (o.bad || fallback.bad).toString().trim(),
      advice: (o.advice || fallback.advice).toString().trim(),
    };
  } catch {
    return fallback;
  }
}

// ── display helpers ──
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export const six = <T,>(v: T): T[] => [v, v, v, v, v, v];
export function poemLines(poem: string): string[] {
  return poem.split(/\r?\n|(?<=[,，。;；!！?？])/).map((s) => s.trim()).filter(Boolean);
}
export function listItems(s: string): string[] {
  return s.split(/[、,，;；\s]+/).map((x) => x.trim()).filter(Boolean);
}
export function toneOf(signName: string): 'gold' | 'jade' | 'dim' | 'omen' {
  if (/Great Fortune|Good Fortune/.test(signName)) return 'gold';
  if (/Modest Fortune/.test(signName)) return 'jade';
  if (/Misfortune/.test(signName)) return 'omen';
  return 'dim';
}

// Star field for the deep-space backdrop (a deterministic formula, not random, for stable rendering)
export const STARS = Array.from({ length: 110 }, (_, i) => {
  const x = (i * 67 + 23) % 760;
  const y = (i * 41 + 13) % 560;
  const o = 0.1 + (i % 6) * 0.1;
  const big = i % 13 === 0 ? 1 : 0;
  return `${x}px ${y}px 0 ${big}px rgba(245,228,180,${o.toFixed(2)})`;
}).join(',');
