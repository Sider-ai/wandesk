// Theme: light / dark / follow system. "auto" gets resolved here into a concrete value
// written to <html data-theme>; the style layer only ever sees "light" or "dark".
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
    try { localStorage.setItem(KEY, mode); } catch { /* private mode */ }
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
