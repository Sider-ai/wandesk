// 壳的界面语言:中 / 英两份字典,组件里只写 t(key)。
//
// 语言来自内核 /api/settings 的 language 字段 —— 启动时拉一次;设置面板保存后内核
// 广播 EV.LANGUAGE_CHANGED,这里更新当前语言并通知订阅者重渲染(见 useLang)。
// 壳只认这一份字典,不碰任何领域文案 —— 应用自己的多语言是 apps/<id>/src/wandesk/i18n.ts 的事。
import { useEffect, useState } from "react";
import { on, startRealtime, EV } from "./realtime";

export type Lang = "zh" | "en";

const dict: Record<Lang, Record<string, string>> = {
  zh: {
    "panel.wallpaper": "个性化",
    "panel.settings": "设置",
    "taskbar.apps": "应用",
    "taskbar.busy": "{n} 个应用正在调用 AI",
    "taskbar.assistant": "助理",

    "ctx.assistant": "打开助理",
    "ctx.create": "新建应用…",
    "ctx.refresh": "刷新桌面",
    "ctx.wallpaper": "个性化…",
    "ctx.about": "关于",

    "win.minimize": "最小化",
    "win.maximize": "全屏",
    "win.close": "关闭",

    "appframe.notReady": "应用运行时未就绪",
    "appframe.checkRuntime": "先确认 workerd 已就绪(内核日志里的 [runtime])",
    "appframe.starting": "正在启动…",

    "wallpaper.scan.gen": "正在生成…",
    "wallpaper.scan.draw": "正在绘制…",
    "wallpaper.scan.soon": "马上就好…",
    "wallpaper.fail": "生成失败",
    "wallpaper.placeholder": "描述你想要的壁纸,点生成…(例如:星空 / 沙丘 / 竹林)",
    "wallpaper.generate": "生成",

    "wallpaper.name.bokeh": "光斑清晨",
    "wallpaper.name.contour": "缓坡",
    "wallpaper.name.sakura": "樱花飘落",
    "wallpaper.name.wheat": "麦田",
    "wallpaper.name.yanyu": "烟雨",
    "wallpaper.name.birch": "白桦",
    "wallpaper.name.cork": "软木板",
    "wallpaper.name.aurora": "极光之夜",
    "wallpaper.name.linen": "绒布",
    "wallpaper.name.clouds": "云霞",
    "wallpaper.name.ink": "墨黑",

    "settings.loading": "读取中…",
    "settings.title": "模型连接",
    "settings.hint": "内核用它跑所有的 AI —— 应用调 env.AI 走的都是这一处配置。换供应商只换地址,不改任何应用代码。",
    "settings.driver": "协议驱动",
    "settings.driver.responses": "Responses(OpenAI 及兼容网关)",
    "settings.driver.chat": "Chat Completions(GLM 等只有这个接口的服务)",
    "settings.apiUrl": "接口地址",
    "settings.apiUrl.hint": "例如 https://api.openai.com/v1/responses",
    "settings.apiKey": "API Key",
    "settings.apiKey.hint": "只写不读 —— 存进去就不再回显",
    "settings.model": "模型 ID",
    "settings.system": "系统提示词",
    "settings.system.hint": "内核会在它后面追加长期记忆",
    "settings.save": "保存",
    "settings.saved": "已保存",
    "settings.language": "界面语言",
    "settings.language.zh": "中文",
    "settings.language.en": "English",
  },
  en: {
    "panel.wallpaper": "Personalize",
    "panel.settings": "Settings",
    "taskbar.apps": "Apps",
    "taskbar.busy": "{n} app(s) calling AI",
    "taskbar.assistant": "Assistant",

    "ctx.assistant": "Open assistant",
    "ctx.create": "New app…",
    "ctx.refresh": "Refresh desktop",
    "ctx.wallpaper": "Personalize…",
    "ctx.about": "About",

    "win.minimize": "Minimize",
    "win.maximize": "Maximize",
    "win.close": "Close",

    "appframe.notReady": "App runtime not ready",
    "appframe.checkRuntime": "Make sure workerd is up (see [runtime] in the kernel log)",
    "appframe.starting": "Starting…",

    "wallpaper.scan.gen": "Generating…",
    "wallpaper.scan.draw": "Painting…",
    "wallpaper.scan.soon": "Almost done…",
    "wallpaper.fail": "Generation failed",
    "wallpaper.placeholder": "Describe the wallpaper you want, then generate… (e.g. starry sky / dunes / bamboo)",
    "wallpaper.generate": "Generate",

    "wallpaper.name.bokeh": "Bokeh Morning",
    "wallpaper.name.contour": "Gentle Slope",
    "wallpaper.name.sakura": "Falling Sakura",
    "wallpaper.name.wheat": "Wheat Field",
    "wallpaper.name.yanyu": "Misty Rain",
    "wallpaper.name.birch": "Birch Wood",
    "wallpaper.name.cork": "Corkboard",
    "wallpaper.name.aurora": "Aurora Night",
    "wallpaper.name.linen": "Linen",
    "wallpaper.name.clouds": "Cloud Glow",
    "wallpaper.name.ink": "Ink Black",

    "settings.loading": "Loading…",
    "settings.title": "Model connection",
    "settings.hint": "The kernel runs every AI call through this — anything an app calls via env.AI goes through this one place. Switching providers only means changing the address, no app code changes.",
    "settings.driver": "Protocol driver",
    "settings.driver.responses": "Responses (OpenAI and compatible gateways)",
    "settings.driver.chat": "Chat Completions (for services like GLM that only expose this API)",
    "settings.apiUrl": "Endpoint URL",
    "settings.apiUrl.hint": "e.g. https://api.openai.com/v1/responses",
    "settings.apiKey": "API Key",
    "settings.apiKey.hint": "Write-only — once saved it's never echoed back",
    "settings.model": "Model ID",
    "settings.system": "System prompt",
    "settings.system.hint": "The kernel appends long-term memory after this",
    "settings.save": "Save",
    "settings.saved": "Saved",
    "settings.language": "Language",
    "settings.language.zh": "中文",
    "settings.language.en": "English",
  },
};

let lang: Lang = "zh";
const listeners = new Set<() => void>();
const notify = () => { for (const fn of listeners) fn(); };

/** 启动时拉一次内核设置,取 language 字段;之后靠 LANGUAGE_CHANGED 事件更新。 */
export const initI18n = async () => {
  startRealtime();
  try {
    const j = await fetch("/api/settings").then((r) => r.json());
    const v = j?.settings?.language;
    if (v === "zh" || v === "en") lang = v;
  } catch { /* 拉不到就用默认中文 */ }
  notify();
};

on(EV.LANGUAGE_CHANGED, (p) => {
  const v = p?.language;
  if (v === "zh" || v === "en") { lang = v; notify(); }
});

export const currentLang = (): Lang => lang;

export const t = (key: string, vars?: Record<string, string | number>): string => {
  let s = dict[lang][key] ?? dict.zh[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
};

/** React hook:订阅语言变化,变了就触发一次重渲染。 */
export const useLang = (): Lang => {
  const [, tick] = useState(0);
  useEffect(() => {
    const fn = () => tick((n) => n + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return lang;
};
