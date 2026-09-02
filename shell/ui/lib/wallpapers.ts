import type { CSSProperties } from 'react';
import { t } from './i18n';

// Wallpaper list (single source of truth), inherited from the Wandesk web client.
// css is a full background declaration, inlined by the desktop and the picker.
export type Wallpaper = { id: string; name: string; css: string };

// Built-in wallpapers. Each SVG entry must have a matching file in ui/public/wallpapers/;
// linen / clouds / ink are pure CSS and need no file. The first entry is the default/fallback.
export const WALLPAPERS: Wallpaper[] = [
  { id: 'bokeh',   name: '光斑清晨', css: 'background:#3f9fb0 url(/wallpapers/bokeh-dawn.svg) center/cover no-repeat;' },
  { id: 'contour', name: '缓坡',   css: 'background:#d8cce1 url(/wallpapers/contour-gentle.svg) center/cover no-repeat;' },
  { id: 'sakura',  name: '樱花飘落', css: 'background:#fef2f6 url(/wallpapers/sakura.svg) center/cover no-repeat;' },
  { id: 'wheat',   name: '麦田',   css: 'background:#f0cf86 url(/wallpapers/wheat.svg) center/cover no-repeat;' },
  { id: 'yanyu',   name: '烟雨',   css: 'background:#efe8da url(/wallpapers/yanyu.svg) center/cover no-repeat;' },
  { id: 'birch',   name: '白桦',   css: 'background:#e8dfc9 url(/wallpapers/birch.svg) center/cover no-repeat;' },
  { id: 'cork',    name: '软木板', css: 'background:#b9873f url(/wallpapers/cork.svg) center/cover no-repeat;' },
  { id: 'aurora',  name: '极光之夜', css: 'background:#04121f url(/wallpapers/aurora.svg) center/cover no-repeat;' },
  { id: 'linen',   name: '绒布',   css: 'background-color:#f4f0e8;background-image:linear-gradient(90deg,rgba(60,50,35,.05) 1px,transparent 1px),linear-gradient(rgba(60,50,35,.04) 1px,transparent 1px);background-size:18px 18px;' },
  { id: 'clouds',  name: '云霞',   css: 'background:linear-gradient(135deg,#fff0d8,#e6f2ff 48%,#f4d8ec);' },
  { id: 'ink',     name: '墨黑',   css: 'background-color:#0c1018;background-image:radial-gradient(rgba(255,255,255,.10) 1px,transparent 1px);background-size:16px 16px;' },
];

export const DEFAULT_WALLPAPER_ID = WALLPAPERS[0].id;

// 内置壁纸名走 t(),AI 生成的自定义壁纸没有词条,回落它自己起的名字(用户的描述截取)。
export const wallpaperName = (w: Wallpaper): string => {
  const key = `wallpaper.name.${w.id}`;
  const s = t(key);
  return s === key ? w.name : s;
};

// User-created wallpapers (via the picker's "+" — AI-generated SVGs). Source of truth is the
// settings table (key `custom_wallpapers`, seeded by the desktop at boot); localStorage is only
// the synchronous first-paint cache.
const CUSTOM_KEY = 'wandesk.wallpapers.custom';

export function loadCustomWallpapers(): Wallpaper[] {
  try {
    const v = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
    return Array.isArray(v) ? (v as Wallpaper[]).filter((w) => w && w.id && w.css) : [];
  } catch {
    return [];
  }
}

export function saveCustomWallpapers(list: Wallpaper[]): void {
  try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(list)); } catch {}
  void fetch('/api/settings', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ custom_wallpapers: JSON.stringify(list) }),
  }).catch(() => { /* 缓存已写,下次保存再同步 */ });
}

// 用库里的值刷新本地缓存(桌面启动时调用一次)
export function seedCustomWallpapers(json: string): void {
  try {
    const v = JSON.parse(json || '[]');
    if (Array.isArray(v)) localStorage.setItem(CUSTOM_KEY, JSON.stringify(v));
  } catch { /* 库里的值坏了就保持缓存 */ }
}

// Built-in + user-created, in display order.
export const allWallpapers = (): Wallpaper[] => [...WALLPAPERS, ...loadCustomWallpapers()];

// `mist` was the pre-1.0 default. Migrate saved state to the new default and recover safely
// from any other removed built-in or custom wallpaper.
export const normalizeWallpaperId = (id?: string): string => {
  if (!id || id === 'mist') return DEFAULT_WALLPAPER_ID;
  return allWallpapers().some((w) => w.id === id) ? id : DEFAULT_WALLPAPER_ID;
};

export const wallpaperCss = (id: string): string =>
  (allWallpapers().find((w) => w.id === normalizeWallpaperId(id)) || WALLPAPERS[0]).css;

// React style prop wants an object, not a CSS string. The wallpaper values have no
// semicolons inside their declarations, so a split on ';' / first ':' is safe here.
export function cssToStyle(css: string): CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (!prop) continue;
    out[prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = val;
  }
  return out as CSSProperties;
}
