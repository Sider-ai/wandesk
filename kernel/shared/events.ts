// Event-name contract: shared by the kernel and the shell so neither side hardcodes raw strings.
export const EV = Object.freeze({
  APPS_CHANGED: "apps.changed",       // The apps/ directory changed, the shell should reload the registry
  ACTIVITY_START: "activity.start",   // An app started calling the AI
  ACTIVITY_END: "activity.end",
  PROC_LOG: "proc.log",
  PROC_EXIT: "proc.exit",
  UI_TOAST: "ui.toast",               // An app is asking the shell to show a toast
  UI_OPEN_APP: "ui.openApp",          // An app is asking the shell to open another app
  UI_OPEN_EXTERNAL: "ui.openExternal",
  LANGUAGE_CHANGED: "language.changed", // The UI language changed (toggled in settings) —— carries { language }
});

export type EventName = (typeof EV)[keyof typeof EV];
