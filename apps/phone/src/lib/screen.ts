// Phone — screen type, AI contract (schema + system persona), parsing and sanitizing (pure logic, no side effects).

export type Screen = { content: string; options: { text: string }[] };

// the AI returns exactly this — content (inline-styled HTML for the screen) + 3 options
export const SCREEN_SCHEMA = {
  type: 'object',
  properties: {
    content: { type: 'string' },
    options: {
      type: 'array',
      items: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] },
    },
  },
  required: ['content', 'options'],
  additionalProperties: false,
} as const;

// The OS persona.
export const SYSTEM = `This is an interactive simulation of a 2010-era 3G color-screen feature phone (candybar, Symbian S60 / MTK generation), and you play the role of this phone's operating system. Based on the user's choice, generate the "next screen" of the interface in real time.
Rules:
1. Generate an "interface", not an article: every screen must look like a 2010 color-screen feature phone. Fixed structure = a screen title bar at the top (can use a light gradient or brand-color background, bold centered text), with the interface body below. Note: the system status bar at the very top of the screen (time, signal bars, battery, carrier) is built into the phone shell and always shown — it is not your concern. Your generated content must never include time, signal, battery, status bar, or shell — not even once. Your content fills the whole screen with zero padding: the title bar must reach edge to edge on its own (margin:0), and the interface body must supply its own suitable padding (e.g. 8-11px).
2. The interface body must use UI patterns from that era — no long blocks of text:
   - Main menu → a 3×3 colorful icon grid (inline grid, each cell a big emoji icon + a small name label below), the currently selected cell gets a light blue background
   - Texting / chat apps → the inbox is a dense list (sender bold, one-line summary, small time on the right, unread marked with ●); chats are left/right-aligned rounded bubbles (the other party light gray, you light blue), contact lists show online-status dots
   - Contacts / settings / file manager → dense list rows + 1px light dividers, the selected row gets a full-row light blue background
   - Browser → a 3G-era WAP2.0/mobile web page (like the old UC Browser): a monospace address bar line at the top (e.g. 3g.example.com, wap.example.com), a portal-style section list as the body, links always blue and underlined (may use [1][2] numbering), footer "Back · Refresh · Home"
   - Music player → song title/artist, a progress bar (a bordered slim bar with a dark-filled played portion), a line or two of lyrics
   - Games → small Java-style games (Snake, Tetris, endless-runner style games), actually drawn out with monospace ASCII art/tables, playable step by step
   - Social feed apps → a wap-style feed: avatars as emoji, bold nicknames, one or two lines of body text, small "Repost · Comment · Like" text below
3. Content must be specific, like a real person actually using this phone in 2010: names, details, mood, everyday texture (friends, family, class group messages, carrier notifications, ringtones, data-plan anxiety); the owner is always the same person living the same ongoing life — people and events must connect to what came before.
4. Style: plain HTML + inline styles; this is a color screen, so restrained color is allowed and encouraged — light gradient title bars, blue links, light blue selection bars, small gray text, like a 2010 phone theme, not a modern flat-large-rounded-corner card look; body text should mostly be black on white, not a dark background filling the whole screen; font size around 12px, line-height 1.6; you may use border, table, grid, and small rounded bubbles.
5. No external resources of any kind (images/fonts/scripts/links/iframes); no <script> tags and no event attributes.
6. Give exactly 3 follow-up options per screen, each a very short action label (like a feature-phone key menu); content is this screen's HTML string, options is an array of length 3, each item with a text field.
All interface text must be written in English.`;

export const BOOT_PROMPT =
  'Power-on complete, entering this phone\'s home screen. Generate the main menu: a 3×3 colorful emoji icon grid (Messages, Chat, Browser, Music, Photos, Games, Feed, Alarm, Settings — that kind of 2010 feature-phone menu), and give 3 menu options.';

// shown only if the very first generation fails — a minimal fallback home
export const FALLBACK_HOME: Screen = {
  content:
    '<div style="padding:9px 11px"><div style="text-align:center;font-weight:900;letter-spacing:3px;margin:4px 0 12px">MAIN MENU</div>' +
    '<div style="margin:6px 2px">1 · 📩 Messages</div>' +
    '<div style="margin:6px 2px">2 · 📝 Notes</div>' +
    '<div style="margin:6px 2px">3 · 🔮 Daily Fortune</div>' +
    '<div style="text-align:center;margin-top:14px;font-size:11px;opacity:.75">▶ Pick one to start</div></div>',
  options: [{ text: 'Messages' }, { text: 'Notes' }, { text: 'Daily Fortune' }],
};

// strip anything that could break out of the little LCD sandbox (belt and braces).
export function sanitize(html: string): string {
  return String(html)
    .replace(/<\s*script[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*(iframe|object|embed|link|meta|style)[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

export function stripTags(html: string): string {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// pull { content, options } out of an agent reply (schema → json; else parse the text)
export function parseScreen(r: { json?: unknown; result?: string }): Screen | null {
  let obj: any = r?.json && typeof r.json === 'object' ? r.json : null;
  if (!obj && r?.result) {
    let s = String(r.result).trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    const a = s.indexOf('{');
    const b = s.lastIndexOf('}');
    if (a !== -1 && b > a) s = s.slice(a, b + 1);
    try { obj = JSON.parse(s); } catch { obj = null; }
  }
  if (!obj || typeof obj.content !== 'string' || !obj.content.trim()) return null;
  let options: { text: string }[] = Array.isArray(obj.options)
    ? obj.options
        .map((o: any) => ({ text: String(o?.text ?? o ?? '').trim().slice(0, 22) }))
        .filter((o: { text: string }) => o.text)
        .slice(0, 3)
    : [];
  if (options.length === 0) options = [{ text: 'Back' }];
  return { content: sanitize(obj.content), options };
}
