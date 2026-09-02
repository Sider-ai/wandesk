// Event bus between multiple instances of the same app (window ↔ side panel).
// Lives only in the shell's memory, never persisted — once the instances are gone, the events are meaningless anyway.
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
