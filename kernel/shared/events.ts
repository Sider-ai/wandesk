// 事件名契约:内核与壳共用一份,两边都不写裸字符串。
export const EV = Object.freeze({
  APPS_CHANGED: "apps.changed",       // apps/ 目录变了,壳该重拉注册表
  ACTIVITY_START: "activity.start",   // 有应用开始调 AI
  ACTIVITY_END: "activity.end",
  PROC_LOG: "proc.log",
  PROC_EXIT: "proc.exit",
  UI_TOAST: "ui.toast",               // 应用请壳弹一条提示
  UI_OPEN_APP: "ui.openApp",          // 应用请壳打开另一个应用
  UI_OPEN_EXTERNAL: "ui.openExternal",
});

export type EventName = (typeof EV)[keyof typeof EV];
