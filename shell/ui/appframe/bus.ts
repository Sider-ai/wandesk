// 同一应用的多个实例之间的事件总线(窗口 ↔ 侧栏面板)。
// 只在壳的内存里,不落库 —— 实例都没了,事件也就没意义了。
type Listener = (event: string, payload: unknown) => void;
const byApp = new Map<string, Set<Listener>>();

export const subscribe = (appId: string, fn: Listener) => {
  if (!byApp.has(appId)) byApp.set(appId, new Set());
  byApp.get(appId)!.add(fn);
  return () => { byApp.get(appId)?.delete(fn); };
};

export const publish = (appId: string, event: string, payload: unknown, exclude?: Listener) => {
  for (const fn of byApp.get(appId) || []) if (fn !== exclude) fn(event, payload);
};
