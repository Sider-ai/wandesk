// Settings: model connection, system prompt, plus the shell's own preferences (desktop layout / wallpaper).
import type { IncomingMessage, ServerResponse } from "http";
import { json, readJson } from "./http.js";
import { readSettings, writeSettings } from "../data/settings.js";
import { broadcast } from "../realtime.js";
import { EV } from "../shared/events.js";

/** apiKey is write-only: masked to a placeholder in the response to the shell, so the settings page never echoes it back. */
const SECRET_KEYS = new Set(["apiKey"]);

export const handleSettingsApi = async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
  if (req.method === "POST") {
    const body = (await readJson(req)) as Record<string, string>;
    const before = readSettings().language;
    const patch: Record<string, string> = {};
    for (const [k, v] of Object.entries(body)) {
      if (typeof v !== "string") continue;
      if (SECRET_KEYS.has(k) && v === "********") continue; // Placeholder sent back unchanged = leave it alone
      patch[k] = v;
    }
    writeSettings(patch);
    // Only broadcast if the language actually changed —— the shell uses this to re-render and reload every open app window
    if (typeof patch.language === "string" && patch.language !== before) {
      broadcast(EV.LANGUAGE_CHANGED, { language: patch.language });
    }
    return json(res, 200, { ok: true });
  }
  const settings = readSettings();
  for (const k of SECRET_KEYS) if (settings[k]) settings[k] = "********";
  return json(res, 200, { settings });
};
