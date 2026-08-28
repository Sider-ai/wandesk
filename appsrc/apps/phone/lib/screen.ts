// 手机 — 屏幕类型、AI 契约(schema + 系统人设)、解析与清洗(纯逻辑,无副作用)。

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
export const SYSTEM = `这是一台 2010 年前后的 3G 彩屏功能机(直板机,塞班 S60 / MTK 那一代)的互动模拟,你扮演这台手机的操作系统。根据用户的选择,实时生成「下一屏」的界面。
规则:
1. 生成的是「界面」不是文章:每一屏都要像 2010 年的彩屏功能机。固定结构 = 顶部一条屏幕标题栏(可给一条浅色渐变底或品牌色底、文字加粗居中),下面是界面主体。注意:屏幕最顶上的系统状态栏(时间、信号格、电量、运营商)是手机外壳自带的、永远固定显示,不归你管——你生成的 content 里绝对不要再出现时间、信号、电量、状态栏或外壳,一次都不要。你的 content 会以零内边距铺满整块屏幕:标题栏必须自己通到左右边缘(margin:0),界面主体自己带合适的内边距(比如 8-11px)。
2. 界面主体必须用那个年代的 UI 形态,拒绝大段文字:
   - 主菜单 → 3×3 彩色图标网格(内联 grid,每格一个 emoji 大图标 + 底下一行小字名称),当前选中格加浅蓝底
   - 短信/手机QQ/飞信 → 收件箱是密排列表(发件人加粗、摘要一行、右侧小字时间,未读加 ●);聊天是左右对齐的圆角小气泡(对方浅灰底、自己浅蓝底),QQ 好友列表带在线状态点
   - 电话本/设置/文件管理 → 密排列表行 + 1px 浅色分隔线,选中行整行浅蓝底
   - 浏览器 → 3G 时代的 WAP2.0/手机网页(UC 浏览器那种):顶部一行等宽小字地址栏(如 3g.qq.com、wap.sina.com.cn、wap.baidu.com),正文是门户式栏目列表,链接一律蓝色下划线(可带 [1][2] 编号),页脚「上一页 · 刷新 · 主页」
   - 音乐播放器 → 歌名/歌手、一条进度条(用带边框的细长条 + 已播放段落深色填充)、一两句歌词
   - 游戏 → Java 小游戏(贪吃蛇、俄罗斯方块、是男人就下100层这类),用等宽字符画/表格真的画出画面,能一步一步玩下去
   - 微博/QQ空间 → wap 版信息流:头像用 emoji,昵称加粗,正文一两行,底下小字「转发 · 评论 · 赞」
3. 内容要具体、像真的有人在 2010 年用这台手机:有名字、有细节、有情绪、有烟火气(同学、家人、班级群发、10086 提醒、彩铃、流量焦虑);机主始终是同一个人、同一段正在发生的生活,人和事要接得上前文。
4. 样式:纯 HTML + 内联样式;这是彩屏,允许并鼓励克制的颜色——浅色渐变标题栏、蓝色链接、浅蓝选中条、灰色小字,像 2010 年的手机主题,不要现代扁平大圆角卡片风;正文白底黑字为主,不要整屏铺深色背景;字号约 12px、行高 1.6,可用 border、table、grid、圆角小气泡。
5. 禁止任何外部资源(图片/字体/脚本/链接/iframe),不要 <script> 和事件属性。
6. 每屏恰好给 3 个后续选项,每个是一句很短的动作文案(像功能机按键菜单);content 是这一屏的 HTML 字符串,options 是长度为 3 的数组,每项含 text 字段。
所有界面文字一律用 中文 书写。`;

export const BOOT_PROMPT =
  '开机完成,进入这台手机的主屏。请生成主菜单界面:3×3 的彩色 emoji 图标网格(短信、手机QQ、UC浏览器、音乐、相册、游戏、微博、闹钟、设置这类 2010 年功能机菜单),并给出 3 个功能选项。';

// shown only if the very first generation fails — a minimal fallback home
export const FALLBACK_HOME: Screen = {
  content:
    '<div style="padding:9px 11px"><div style="text-align:center;font-weight:900;letter-spacing:3px;margin:4px 0 12px">主菜单</div>' +
    '<div style="margin:6px 2px">1 · 📩 短信</div>' +
    '<div style="margin:6px 2px">2 · 📝 记事本</div>' +
    '<div style="margin:6px 2px">3 · 🔮 每日占卜</div>' +
    '<div style="text-align:center;margin-top:14px;font-size:11px;opacity:.75">▶ 选一项开始</div></div>',
  options: [{ text: '短信' }, { text: '记事本' }, { text: '每日占卜' }],
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
  if (options.length === 0) options = [{ text: '返回' }];
  return { content: sanitize(obj.content), options };
}
