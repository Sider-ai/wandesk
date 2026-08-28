// 阅读 — 主持人设、预置书、体裁推断、回合解析、回顾拼装(纯数据/纯函数)。
import type { Genre, Page, Preset, Turn } from './types';

// 引擎主持人设定(只在开场作为 system 传一次;续写靠会话原生保留)
export const GM = `你是一位顶尖的互动小说主持人(Game Master),为玩家即时生成一部第二人称的交互式故事。

叙事要求:
- 用第二人称("你")沉浸式叙事,文笔生动、有画面感和张力,调动五感,善用细节与悬念。
- 紧扣玩家给定的题材与设定,保持世界观、人物与已发生情节的连贯,记住此前的每一个选择。
- 每一页篇幅适中(约 120–220 字),是一段完整、好读的场景,结尾自然地把玩家推到一个需要抉择的节点。
- 推进剧情、制造转折,让玩家的选择真正影响走向;不要重复已经描写过的内容。

抉择要求:
- 每一页末尾给出 2–4 个具体、各有分量、彼此不同的行动选项,简短有力(每个不超过 18 字),让人难以取舍。
- 选项是玩家"可以做的事",不是旁白;不要把正确答案写在脸上。
- 当故事抵达一个自然且有力的结局时,可以收束全篇:把 choices 设为空数组 [],并在叙事里给出余韵。

标题:仅在开场时,为这个故事起一个贴切、有吸引力的中文标题(不超过 12 字)。

务必只输出一个 JSON 对象,不要任何解释、前后缀或代码块标记:
开场:{"title":"故事标题","narrative":"开场这一页…","choices":["行动一","行动二","行动三"]}
之后:{"narrative":"承接上文的下一页…","choices":["行动一","行动二"]}`;

export const PRESETS: Preset[] = [
  {
    key: 'cyberpunk', genre: 'cyberpunk', icon: '🌃',
    title: '霓虹残影',
    tagline: '酸雨之城,一桩牵涉巨企的失踪案。',
    premise: '题材:赛博朋克侦探。在一座永远下着酸雨的霓虹巨城,我是一名靠义体改造续命的私家侦探,刚接到一桩牵涉巨型企业的离奇失踪案。',
  },
  {
    key: 'wuxia', genre: 'wuxia', icon: '⚔️',
    title: '边城风雨',
    tagline: '少年侠客身负家仇,夜宿风雨客栈。',
    premise: '题材:武侠。我是一个初入江湖的少年侠客,身负一桩未解的家仇,行至一座风雨欲来的边城客栈。',
  },
  {
    key: 'fantasy', genre: 'fantasy', icon: '🧙',
    title: '护送一只猫',
    tagline: '见习法师的第一桩委托:穿过黑森林。',
    premise: '题材:剑与魔法的奇幻。我是一名刚从学院毕业的见习法师,接下了人生第一份委托:护送一只会说话的猫穿过黑森林。',
  },
];

// 字号三档(px)
export const FONT_SIZES = [15, 17, 19];

// JSON schema:Codex 会据此走 outputSchema;Claude 忽略它,我们仍从文本解析。
export const TURN_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    narrative: { type: 'string' },
    choices: { type: 'array', items: { type: 'string' }, maxItems: 4 },
  },
  required: ['narrative', 'choices'],
  additionalProperties: false,
};

// 从一段设定文字里推断体裁(用于自定义设定与重开旧故事的封面版式)。纯展示,不影响 AI。
const GENRE_HINTS: { g: Genre; keys: string[] }[] = [
  { g: 'cyberpunk', keys: ['赛博', '义体', '霓虹', '黑客', '巨型企业', '机械', 'cyber', 'neon', 'hacker', 'android'] },
  { g: 'wuxia', keys: ['武侠', '江湖', '侠客', '客栈', '内功', '剑客', '门派', '镖', 'wuxia', 'martial', 'jianghu'] },
  { g: 'apocalypse', keys: ['末日', '病毒', '丧尸', '废土', '幸存', '感染', '核', 'apocalypse', 'zombie', 'survivor', 'wasteland'] },
  { g: 'gothic', keys: ['哥特', '古堡', '诡', '幽灵', '凶案', '悬疑', '吸血', '诅咒', '深夜', 'gothic', 'haunted', 'mystery', 'vampire', 'ghost'] },
  { g: 'scifi', keys: ['科幻', '飞船', '星系', '太空', '殖民', '外星', 'AI', '机器人', '深空', 'sci-fi', 'space', 'starship', 'galaxy', 'alien'] },
  { g: 'fantasy', keys: ['奇幻', '魔法', '法师', '巨龙', '精灵', '森林', '冒险', '王国', '骑士', 'fantasy', 'magic', 'wizard', 'dragon', 'elf'] },
];
export function detectGenre(premise: string): Genre {
  const preset = PRESETS.find((p) => p.premise === premise);
  if (preset) return preset.genre;
  const t = (premise || '').toLowerCase();
  let best: Genre = 'classic';
  let score = 0;
  for (const { g, keys } of GENRE_HINTS) {
    const n = keys.reduce((a, k) => a + (t.includes(k.toLowerCase()) ? 1 : 0), 0);
    if (n > score) { score = n; best = g; }
  }
  return best;
}

// 把可能被包裹在文字/代码块里的 JSON 对象稳健地抠出来(Claude 返回纯文本,不填 json)
function parseTurn(raw: string): Turn | null {
  if (!raw) return null;
  let text = raw.trim();
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const m = text.match(/\{[\s\S]*\}/);
  if (m) text = m[0];
  try {
    const o = JSON.parse(text) as Partial<Turn>;
    const narrative = (o.narrative ?? '').toString().trim();
    if (!narrative) return null;
    const choices = Array.isArray(o.choices)
      ? o.choices.map((c) => (c ?? '').toString().trim()).filter(Boolean).slice(0, 4)
      : [];
    const title = o.title ? o.title.toString().trim() : undefined;
    return { narrative, choices, title };
  } catch { return null; }
}

// 从一次 agent 返回里取出一页:优先结构化 json(Codex),否则解析 result 文本(Claude)。
export function extractTurn(r: { ok: boolean; json?: unknown; result?: string }): Turn | null {
  if (!r.ok) return null;
  if (r.json && typeof r.json === 'object') {
    const t = parseTurn(JSON.stringify(r.json));
    if (t) return t;
  }
  return parseTurn(r.result || '');
}

// 解析存库的 choices 列(JSON 数组);坏数据时安全降级为空。
export function parseChoices(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((c) => String(c)).filter(Boolean);
  if (typeof raw !== 'string' || !raw.trim()) return [];
  try {
    const a = JSON.parse(raw);
    return Array.isArray(a) ? a.map((c) => String(c)).filter(Boolean) : [];
  } catch { return []; }
}

// 用已存的 pages 拼一段简短回顾,作为重建会话时的上下文兜底
export function buildRecap(p: string, sc: Page[]): string {
  const so = sc.length
    ? sc.map((s, i) => `〔第${i + 1}页〕${s.narrative}${s.chosen ? `\n→ 你选择了:${s.chosen}` : ''}`).join('\n\n')
    : '(故事尚未开始)';
  return `【这是一个正在进行的互动故事,请无缝承接,不要从头重述】\n设定:${p}\n\n已发生的剧情:\n${so}`;
}

// 取叙事开头的首字作首字下沉(drop-cap),其余正文照常。跳过开头的引号/空白等。
export function firstGlyph(s: string): { cap: string; rest: string } | null {
  const text = (s || '').replace(/^\s+/, '');
  if (!text) return null;
  const lead = text.match(/^["“「『（(]/);
  if (lead) return { cap: text.slice(0, 2), rest: text.slice(2) };
  const cp = Array.from(text)[0] ?? '';
  return { cap: cp, rest: text.slice(cp.length) };
}
