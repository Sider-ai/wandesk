// Watch the apps/ directory — "installed = the directory exists" means the registry can change at any moment:
// when the AI uses write to build an app, the shell should see it immediately, without waiting for a manual refresh.
import fs from "fs";
import { appsDir } from "../paths.js";
import { EV } from "../shared/events.js";
import { broadcast } from "../realtime.js";

export const watchApps = () => {
  let timer: NodeJS.Timeout | null = null;
  try {
    fs.watch(appsDir(), { recursive: true }, (_event, filename) => {
      // A user running npm install inside an app directory floods thousands of events — that's not the app registry changing
      if (String(filename || "").split(/[\\/]/).includes("node_modules")) return;
      // An app's database is held by workerd (AppStore); the kernel side has no handle to invalidate
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => broadcast(EV.APPS_CHANGED, {}), 300); // debounce: a single write can fire multiple events
    });
  } catch (e: any) {
    console.error("[apps] failed to watch directory (manual refresh required):", e?.message);
  }
};
