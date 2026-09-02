// Kept in sync with the kernel's kernel/shared/events.ts. Neither side writes bare strings.
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
