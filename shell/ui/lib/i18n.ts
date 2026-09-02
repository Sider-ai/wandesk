// Shell UI language: a single English dictionary, components just write t(key).
//
// The mechanism still exists for a future second language (see CONTRACT.md §9):
// language comes from the kernel's /api/settings `language` field — pulled once at
// startup; after the settings panel saves, the kernel broadcasts EV.LANGUAGE_CHANGED
// and this updates the current language and notifies subscribers to re-render (see useLang).
// The shell only knows this one dictionary — it never touches any domain copy —
// an app's own localization is its own business, at apps/<id>/src/wandesk/i18n.ts.
import { useEffect, useState } from "react";
import { on, startRealtime, EV } from "./realtime";

export type Lang = "en";

const dict: Record<Lang, Record<string, string>> = {
  en: {
    "panel.wallpaper": "Personalize",
    "panel.settings": "Settings",
    "panel.about": "About Wandesk",
    "panel.welcome": "Welcome",
    "welcome.title": "Connect a model",
    "welcome.hint": "Wandesk runs on your own model. Paste any OpenAI-compatible endpoint, your API key and a model id. You can change these later in Settings.",
    "welcome.connect": "Connect",
    "welcome.testing": "Connecting…",
    "welcome.skip": "Skip for now",
    "welcome.err.missing": "All three fields are required.",
    "welcome.err.test": "Could not reach the model: {e}",
    "taskbar.apps": "Apps",
    "taskbar.busy": "{n} app(s) calling AI",
    "taskbar.assistant": "Assistant",

    "ctx.assistant": "Open assistant",
    "ctx.refresh": "Refresh desktop",
    "ctx.wallpaper": "Personalize…",
    "ctx.settings": "Settings…",
    "ctx.about": "About",
    "about.tagline": "An AI desktop. Every app is a small website you can read, edit and rebuild.",
    "about.version": "Version {v}",
    "about.website": "Website",
    "about.license": "Open source under the ISC license",

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
  },
};

let lang: Lang = "en";
const listeners = new Set<() => void>();
const notify = () => { for (const fn of listeners) fn(); };

/** Pulls the kernel settings once at startup for the `language` field; after that, updates come from the LANGUAGE_CHANGED event. */
export const initI18n = async () => {
  startRealtime();
  try {
    const j = await fetch("/api/settings").then((r) => r.json());
    const v = j?.settings?.language;
    if (v === "en") lang = v;
  } catch { /* fall back to the default on failure */ }
  notify();
};

on(EV.LANGUAGE_CHANGED, (p) => {
  const v = p?.language;
  if (v === "en") { lang = v; notify(); }
});

export const currentLang = (): Lang => lang;

export const t = (key: string, vars?: Record<string, string | number>): string => {
  let s = dict.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
};

/** React hook: subscribes to language changes and triggers a re-render when it changes. */
export const useLang = (): Lang => {
  const [, tick] = useState(0);
  useEffect(() => {
    const fn = () => tick((n) => n + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return lang;
};
