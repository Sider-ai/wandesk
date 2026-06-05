import { useSyncExternalStore } from "react";

type ToastState = {
  visible: boolean;
  message: string;
  type: "success" | "error";
};

let state: ToastState = { visible: false, message: "", type: "success" };
let timer: number | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function clearTimer() {
  if (timer) {
    window.clearTimeout(timer);
    timer = null;
  }
}

export const toast = {
  show(message: string, { type = "success", duration = 2200 }: { type?: "success" | "error"; duration?: number } = {}) {
    clearTimer();
    state = { visible: Boolean(String(message || "").trim()), message: String(message || "").trim(), type };
    emit();
    if (!state.visible) return;
    timer = window.setTimeout(() => {
      state = { ...state, visible: false };
      timer = null;
      emit();
    }, duration);
  },
  hide() {
    clearTimer();
    state = { ...state, visible: false };
    emit();
  }
};

export function useToastState() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => state
  );
}
