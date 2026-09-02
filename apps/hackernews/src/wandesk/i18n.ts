// 语言:壳经 /_wd/sdk.js 暴露 window.wandesk.lang("zh" | "en"),没有就看浏览器。
// 文案放 src/locales/{zh,en}.json,组件里只写 t("key")。缺 key 回落中文,再缺回显 key。
import zh from "../locales/zh.json";
import en from "../locales/en.json";

export type Lang = "zh" | "en";

const detect = (): Lang => {
  const w = (globalThis as any).wandesk;
  if (w?.lang === "en" || w?.lang === "zh") return w.lang;
  const nav = typeof navigator !== "undefined" ? navigator.language : "";
  return nav.toLowerCase().startsWith("en") ? "en" : "zh";
};

export const lang: Lang = detect();

const ZH = zh as Record<string, string>;
const EN = en as Record<string, string>;
const dict: Record<string, string> = lang === "en" ? EN : ZH;

export const t = (key: string, vars?: Record<string, string | number>): string => {
  let s = dict[key] ?? ZH[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
};
