// 与内核 kernel/shared/events.ts 保持一致。两边都不写裸字符串。
export const EV = Object.freeze({
  APPS_CHANGED: "apps.changed",
  ACTIVITY_START: "activity.start",
  ACTIVITY_END: "activity.end",
  PROC_LOG: "proc.log",
  PROC_EXIT: "proc.exit",
  UI_TOAST: "ui.toast",
  UI_OPEN_APP: "ui.openApp",
  UI_OPEN_EXTERNAL: "ui.openExternal",
  LANGUAGE_CHANGED: "language.changed",
});
