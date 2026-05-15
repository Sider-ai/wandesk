import { useSyncExternalStore } from "react";
import { wallpaperList } from "../data/wallpapers";

const DEFAULT_WALLPAPER_ID = "wp-sea-mist-blue-bay";

type AppearanceState = {
  wallpaperId: string;
};

let state: AppearanceState = {
  wallpaperId: localStorage.getItem("aios-wallpaper") || DEFAULT_WALLPAPER_ID
};

const listeners = new Set<() => void>();
let snapshot = createSnapshot();

function createSnapshot() {
  const currentWallpaper = wallpaperList.find((item) => item.id === state.wallpaperId) || wallpaperList[0];
  return {
    wallpaperId: state.wallpaperId,
    currentWallpaper,
    desktopTheme: currentWallpaper?.desktopTheme || "light"
  };
}

function emit() {
  snapshot = createSnapshot();
  for (const listener of listeners) listener();
}

export function setWallpaper(id: string) {
  state = { ...state, wallpaperId: id };
  localStorage.setItem("aios-wallpaper", id);
  emit();
}

export function getAppearanceSnapshot() {
  return snapshot;
}

export function useAppearance() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getAppearanceSnapshot,
    getAppearanceSnapshot
  );
}
