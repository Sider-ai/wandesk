// 算一卦 — 周易六爻的数据与纯逻辑:卦表、起卦、解卦解析、卦师人设、展示辅助。

export type Reading = {
  signName: string;
  signPoem: string;
  good: string;
  bad: string;
  advice: string;
};
export type Phase = 'idle' | 'shaking' | 'reading' | 'done';

// last cast is cached (single, not a history) so reopening shows it; 重新起卦 clears it
export const CACHE_KEY = 'wandesk.fortune.last';

// ── 卦师人设 ──
export const DIVINER = `你是一位精通《周易》六爻的卦师,世外高人,学识渊博,文笔古雅,断语简练却意味深长。
用户已通过摇铜钱起卦,得到了一个确定的卦象,你只负责解读这一卦,绝不可另起卦或更改卦象。

解卦要求(紧扣所得卦名与卦义,贴合用户所问):
1. signName:卦象总评,只能取其一 —— "大吉" / "中吉" / "小吉" / "中平" / "小凶" / "凶"。
2. signPoem:一首原创四句签诗(每句五到七言,古雅有韵),暗合卦象与所问,可用意象,不要直白。
3. good:宜行之事,2-3 项,顿号分隔,简短。
4. bad:忌行之事,2-3 项,顿号分隔,简短。
5. advice:解读建议,60-90 字,有易经味道但通俗,言辞不可过于绝对,
   收束处点到"尽人事,听天命""仅供参详,莫要执泥"之意,劝人理性看待。

语气:沉静、笃定、有古意,像庙里抽到的签文旁那位捻须的老先生。

务必只输出一个 JSON 对象,不要任何解释、前后缀或代码块标记:
{"signName":"...","signPoem":"...","good":"...","bad":"...","advice":"..."}`;

// ── 64 卦表 (upper × lower, 0=坤..7=乾 三爻索引) ──
const HEXAGRAMS: string[][] = [
  ['坤为地', '地山谦', '地水师', '地风升', '地雷复', '地火明夷', '地泽临', '地天泰'],
  ['山地剥', '艮为山', '山水蒙', '山风蛊', '山雷颐', '山火贲', '山泽损', '山天大畜'],
  ['水地比', '水山蹇', '坎为水', '水风井', '水雷屯', '水火既济', '水泽节', '水天需'],
  ['风地观', '风山渐', '风水涣', '巽为风', '风雷益', '风火家人', '风泽中孚', '风天小畜'],
  ['雷地豫', '雷山小过', '雷水解', '雷风恒', '震为雷', '雷火丰', '雷泽归妹', '雷天大壮'],
  ['火地晋', '火山旅', '火水未济', '火风鼎', '火雷噬嗑', '离为火', '火泽睽', '火天大有'],
  ['泽地萃', '泽山咸', '泽水困', '泽风大过', '泽雷随', '泽火革', '兑为泽', '泽天夬'],
  ['天地否', '天山遁', '天水讼', '天风姤', '天雷无妄', '天火同人', '天泽履', '乾为天'],
];
export const YAO_LABELS = ['上爻', '五爻', '四爻', '三爻', '二爻', '初爻'];
export const TRIGRAM_NAMES = ['坤', '艮', '坎', '巽', '震', '离', '兑', '乾'];
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
    signName: '中平',
    signPoem: '天机一时未分明,且待云开月自生。\n心有所问皆有应,静守本心万事成。',
    good: '静观、守正',
    bad: '妄动、强求',
    advice: '此卦机缘未显,宜静不宜躁。所问之事尚在变化之中,且尽己力,余者听之。仅供参详,莫要执泥。',
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

// ── 展示辅助 ──
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export const six = <T,>(v: T): T[] => [v, v, v, v, v, v];
export function poemLines(poem: string): string[] {
  return poem.split(/\r?\n|(?<=[,，。;；!！?？])/).map((s) => s.trim()).filter(Boolean);
}
export function listItems(s: string): string[] {
  return s.split(/[、,，;；\s]+/).map((x) => x.trim()).filter(Boolean);
}
export function toneOf(signName: string): 'gold' | 'jade' | 'dim' | 'omen' {
  if (/大吉|中吉/.test(signName)) return 'gold';
  if (/小吉/.test(signName)) return 'jade';
  if (/凶/.test(signName)) return 'omen';
  return 'dim';
}

// 深空背景的星点(确定式公式,非随机,便于稳定渲染)
export const STARS = Array.from({ length: 110 }, (_, i) => {
  const x = (i * 67 + 23) % 760;
  const y = (i * 41 + 13) % 560;
  const o = 0.1 + (i % 6) * 0.1;
  const big = i % 13 === 0 ? 1 : 0;
  return `${x}px ${y}px 0 ${big}px rgba(245,228,180,${o.toFixed(2)})`;
}).join(',');
