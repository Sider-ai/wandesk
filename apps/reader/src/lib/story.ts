// Reader — GM persona, presets, genre detection, turn parsing, recap assembly (pure data / pure functions).
import type { Genre, Page, Preset, Turn } from './types';

// Engine game-master persona (sent as system only at story start; continuation relies on native session memory)
export const GM = `You are a top-tier interactive-fiction Game Master, generating a second-person interactive story for the player in real time.

Narrative requirements:
- Write immersive second-person narration ("you"), vivid and cinematic, engaging the senses, rich in detail and tension.
- Stay tightly bound to the genre and setup the player gave; keep the world, characters, and prior events consistent, and remember every choice made so far.
- Each page should be a moderate length (about 120–220 words), a complete and readable scene that naturally ends on a moment demanding a decision.
- Advance the plot and create turns that make the player's choices genuinely matter; never repeat content already narrated.

Choice requirements:
- End each page with 2–4 concrete, weighty, meaningfully different action options, short and punchy (under 12 words each), that make the player pause to decide.
- Options are things the player "can do," not narration; don't telegraph the "right" answer.
- When the story reaches a natural, powerful ending, you may close it out: set choices to an empty array [], and let the narrative land with a lingering final note.

Title: only at the story's opening, give it a fitting, striking English title (under 8 words).

Output only a single JSON object — no explanation, no prefix/suffix, no code fences:
Opening: {"title":"Story Title","narrative":"The opening page…","choices":["Action one","Action two","Action three"]}
Continuation: {"narrative":"The next page, following on…","choices":["Action one","Action two"]}`;

export const PRESETS: Preset[] = [
  {
    key: 'cyberpunk', genre: 'cyberpunk', icon: '🌃',
    title: 'Neon Afterimage',
    tagline: 'A city of acid rain, and a disappearance tied to a mega-corp.',
    premise: 'Genre: cyberpunk detective. In a neon megacity where it never stops raining acid, I am a private investigator kept alive by cybernetic implants, just handed a bizarre missing-persons case tangled up with a giant corporation.',
  },
  {
    key: 'wuxia', genre: 'wuxia', icon: '⚔️',
    title: 'Storm Over the Border Town',
    tagline: 'A young swordsman carrying a family vendetta takes shelter at a windswept inn.',
    premise: "Genre: wuxia. I am a young swordsman newly out into the martial world, carrying an unresolved blood feud, arriving at a border-town inn as a storm gathers.",
  },
  {
    key: 'fantasy', genre: 'fantasy', icon: '🧙',
    title: 'Escorting a Cat',
    tagline: "A novice mage's first job: cross the Black Forest.",
    premise: 'Genre: sword-and-sorcery fantasy. I am a novice mage fresh out of the academy, taking on my very first job: escorting a talking cat across the Black Forest.',
  },
];

// Three font-size steps (px)
export const FONT_SIZES = [15, 17, 19];

// JSON schema: Codex follows this via outputSchema; Claude ignores it, and we still parse it out of the text.
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

// Infer a genre from a piece of setup text (used for custom setups and for reopening old stories' cover styling). Purely cosmetic; does not affect the AI.
const GENRE_HINTS: { g: Genre; keys: string[] }[] = [
  { g: 'cyberpunk', keys: ['cyber', 'neon', 'hacker', 'android', 'implant', 'corporation', 'megacity'] },
  { g: 'wuxia', keys: ['wuxia', 'martial', 'jianghu', 'swordsman', 'sect', 'inn', 'blade'] },
  { g: 'apocalypse', keys: ['apocalypse', 'zombie', 'survivor', 'wasteland', 'virus', 'infected', 'nuclear'] },
  { g: 'gothic', keys: ['gothic', 'haunted', 'mystery', 'vampire', 'ghost', 'castle', 'curse', 'murder'] },
  { g: 'scifi', keys: ['sci-fi', 'space', 'starship', 'galaxy', 'alien', 'robot', 'colony', 'ai'] },
  { g: 'fantasy', keys: ['fantasy', 'magic', 'wizard', 'dragon', 'elf', 'kingdom', 'knight', 'forest'] },
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

// Robustly pull a JSON object out of text that may be wrapped in prose/code fences (Claude returns plain text, doesn't fill `json`).
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

// Pull one page out of an agent response: prefer structured json (Codex), otherwise parse the result text (Claude).
export function extractTurn(r: { ok: boolean; json?: unknown; result?: string }): Turn | null {
  if (!r.ok) return null;
  if (r.json && typeof r.json === 'object') {
    const t = parseTurn(JSON.stringify(r.json));
    if (t) return t;
  }
  return parseTurn(r.result || '');
}

// Parse a stored choices column (JSON array); falls back safely to an empty array on bad data.
export function parseChoices(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((c) => String(c)).filter(Boolean);
  if (typeof raw !== 'string' || !raw.trim()) return [];
  try {
    const a = JSON.parse(raw);
    return Array.isArray(a) ? a.map((c) => String(c)).filter(Boolean) : [];
  } catch { return []; }
}

// Stitch stored pages into a short recap, used as a context fallback when rebuilding a session
export function buildRecap(p: string, sc: Page[]): string {
  const so = sc.length
    ? sc.map((s, i) => `[Page ${i + 1}] ${s.narrative}${s.chosen ? `\n→ You chose: ${s.chosen}` : ''}`).join('\n\n')
    : '(The story has not begun yet)';
  return `[This is an interactive story in progress. Continue it seamlessly — do not retell it from the start.]\nSetup: ${p}\n\nWhat has happened so far:\n${so}`;
}

// Take the narrative's first character for a drop cap; the rest of the body reads normally. Skips leading quotes/whitespace.
export function firstGlyph(s: string): { cap: string; rest: string } | null {
  const text = (s || '').replace(/^\s+/, '');
  if (!text) return null;
  const lead = text.match(/^["“「『（(]/);
  if (lead) return { cap: text.slice(0, 2), rest: text.slice(2) };
  const cp = Array.from(text)[0] ?? '';
  return { cap: cp, rest: text.slice(cp.length) };
}
