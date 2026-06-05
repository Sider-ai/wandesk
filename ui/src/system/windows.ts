import { useSyncExternalStore } from "react";
import type { ComponentType } from "react";
import type { AppDefinition, WindowState } from "../types";

const TASKBAR_H = 44;
const WINDOW_Z_BASE = 10;

let windows: WindowState[] = [];
let nextZ = WINDOW_Z_BASE;
const listeners = new Set<() => void>();

function snapshot() {
  return windows;
}

function emit() {
  windows = [...windows];
  for (const listener of listeners) listener();
}

function rebalanceZ(activeWindowId: string | null = null) {
  const ordered = [...windows].sort((a, b) => a.zIndex - b.zIndex);
  const active = activeWindowId ? ordered.find((win) => win.id === activeWindowId) : null;
  const rest = active ? ordered.filter((win) => win.id !== activeWindowId) : ordered;
  rest.forEach((win, index) => {
    win.zIndex = WINDOW_Z_BASE + index;
  });
  if (active) active.zIndex = WINDOW_Z_BASE + rest.length;
  nextZ = WINDOW_Z_BASE + Math.max(0, windows.length - 1);
}

type OpenComponentOptions = {
  key: string;
  appId?: string;
  title: string;
  icon?: string;
  component?: ComponentType<any>;
  load?: () => Promise<{ default: ComponentType<any> }>;
  defaultDesktopWindowSize?: { w: number; h: number };
  minDesktopWindowSize?: { w: number; h: number };
  props?: Record<string, unknown>;
  singleton?: boolean;
};

async function openComponent(options: OpenComponentOptions) {
  const existing = windows.find((win) => win.windowKey === options.key || (options.singleton && win.appId === (options.appId || options.key)));
  if (existing) {
    if (existing.state === "minimized") existing.state = "normal";
    if (options.props) existing.props = { ...(existing.props || {}), ...options.props };
    focus(existing.id);
    return existing;
  }
  const component = options.component || (options.load ? (await options.load()).default : null);
  if (!component) throw new Error(`Window component is missing for ${options.key}`);
  const cascade = (windows.length % 8) * 30;
  const size = options.defaultDesktopWindowSize || { w: 780, h: 560 };
  const minSize = options.minDesktopWindowSize || { w: 360, h: 280 };
  const dw = size.w;
  const dh = size.h;
  const win: WindowState = {
    id: `${options.appId || options.key}-${Date.now()}`,
    appId: options.appId || options.key,
    windowKey: options.key,
    title: options.title,
    icon: options.icon || "▣",
    component,
    props: options.props || {},
    x: 120 + cascade,
    y: 60 + cascade,
    w: Math.min(dw, window.innerWidth - 80),
    h: Math.min(dh, window.innerHeight - 80),
    minW: minSize.w,
    minH: minSize.h,
    zIndex: nextZ,
    state: "normal",
    prevRect: null
  };
  windows = [...windows, win];
  rebalanceZ(win.id);
  emit();
  return win;
}

function openWindow(app: AppDefinition) {
  return openComponent({
    key: app.id,
    appId: app.id,
    title: app.name,
    icon: app.icon,
    component: app.component,
    defaultDesktopWindowSize: app.defaultDesktopWindowSize,
    minDesktopWindowSize: app.minDesktopWindowSize,
    singleton: true
  });
}

function close(windowId: string) {
  windows = windows.filter((win) => win.id !== windowId);
  rebalanceZ();
  emit();
}

function closeByKey(windowKey: string) {
  windows = windows.filter((win) => win.windowKey !== windowKey);
  rebalanceZ();
  emit();
}

function minimize(windowId: string) {
  const win = windows.find((item) => item.id === windowId);
  if (win) {
    win.state = "minimized";
    emit();
  }
}

function restore(windowId: string) {
  const win = windows.find((item) => item.id === windowId);
  if (!win) return;
  if (win.state === "minimized") win.state = "normal";
  rebalanceZ(windowId);
  emit();
}

function maximize(windowId: string) {
  const win = windows.find((item) => item.id === windowId);
  if (!win) return;
  if (win.state === "maximized") {
    if (win.prevRect) Object.assign(win, win.prevRect);
    win.prevRect = null;
    win.state = "normal";
  } else {
    win.prevRect = { x: win.x, y: win.y, w: win.w, h: win.h };
    win.x = 0;
    win.y = 0;
    win.w = window.innerWidth;
    win.h = window.innerHeight - TASKBAR_H;
    win.state = "maximized";
  }
  emit();
}

function focus(windowId: string) {
  if (windows.some((win) => win.id === windowId)) {
    rebalanceZ(windowId);
    emit();
  }
}

function isActive(windowId: string) {
  const visible = windows.filter((win) => win.state !== "minimized");
  if (!visible.length) return false;
  const maxZ = Math.max(...visible.map((win) => win.zIndex));
  const win = windows.find((item) => item.id === windowId);
  return Boolean(win && win.state !== "minimized" && win.zIndex === maxZ);
}

function toggleFromTaskbar(windowId: string) {
  const win = windows.find((item) => item.id === windowId);
  if (!win) return;
  if (win.state === "minimized") {
    restore(windowId);
  } else if (isActive(windowId)) {
    minimize(windowId);
  } else {
    focus(windowId);
  }
}

function updatePosition(windowId: string, x: number, y: number) {
  const win = windows.find((item) => item.id === windowId);
  if (win) {
    win.x = x;
    win.y = y;
    emit();
  }
}

function updateSize(windowId: string, w: number, h: number) {
  const win = windows.find((item) => item.id === windowId);
  if (win) {
    win.w = Math.max(w, win.minW);
    win.h = Math.max(h, win.minH);
    emit();
  }
}

function updateRect(windowId: string, rect: { x: number; y: number; w: number; h: number }) {
  const win = windows.find((item) => item.id === windowId);
  if (win) {
    win.x = rect.x;
    win.y = rect.y;
    win.w = Math.max(rect.w, win.minW);
    win.h = Math.max(rect.h, win.minH);
    emit();
  }
}

export const windowManager = {
  openWindow,
  openComponent,
  close,
  closeByKey,
  minimize,
  restore,
  maximize,
  focus,
  isActive,
  toggleFromTaskbar,
  updatePosition,
  updateSize,
  updateRect
};

export function useWindows() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    snapshot,
    snapshot
  );
}
