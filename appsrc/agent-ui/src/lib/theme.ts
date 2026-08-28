// 主题:亮 / 暗 / 跟随系统。auto 在这里解析成具体值写到 <html data-theme>,
// 样式层只认 light/dark 两个字。
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'auto';
const KEY = 'agent.theme';
const ORDER: ThemeMode[] = ['auto', 'light', 'dark'];

export const useTheme = create<{ mode: ThemeMode }>(() => ({ mode: 'auto' }));

const media = window.matchMedia('(prefers-color-scheme: dark)');

function apply(mode: ThemeMode) {
    const resolved = mode === 'auto' ? (media.matches ? 'dark' : 'light') : mode;
    document.documentElement.dataset.theme = resolved;
}

export function setTheme(mode: ThemeMode) {
    useTheme.setState({ mode });
    try { localStorage.setItem(KEY, mode); } catch { /* 私隐模式 */ }
    apply(mode);
}

export function cycleTheme() {
    const { mode } = useTheme.getState();
    setTheme(ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length]);
}

export function initTheme() {
    let mode: ThemeMode = 'auto';
    try {
        const saved = localStorage.getItem(KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'auto') mode = saved;
    } catch { /* ignore */ }
    useTheme.setState({ mode });
    apply(mode);
    media.addEventListener('change', () => {
        if (useTheme.getState().mode === 'auto') apply('auto');
    });
}
