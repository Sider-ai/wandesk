// Settings: model connection, system prompt, plus the shell's own preferences (desktop layout / wallpaper).
import type { IncomingMessage, ServerResponse } from "http";
import { json, readJson } from "./http.js";
import { readSettings, writeSettings } from "../data/settings.js";
import { broadcast } from "../realtime.js";
import { EV } from "../shared/events.js";
import { complete } from "../ai/index.js";
import { modelConfig } from "../data/settings.js";
import { AGENT_LIMITS } from "../config.js";

/** One real request, so the welcome / settings panels can say "connected" honestly.
 *  Candidate values in the body take precedence over the saved ones, so a panel can test before it saves. */
export const handleSettingsTest = async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
  const body = (await readJson(req)) as Record<string, unknown>;
  const saved = modelConfig();
  const pick = (k: string, fallback: string) => (typeof body[k] === "string" && (body[k] as string).trim() ? (body[k] as string).trim() : fallback);
  const cfg = { driver: pick("driver", saved.driver), url: pick("apiUrl", saved.url), apiKey: pick("apiKey", saved.apiKey), model: pick("model", saved.model) };
  if (!cfg.url || !cfg.model || !cfg.apiKey) return json(res, 200, { ok: false, error: "Fill in the API URL, API key and model first" });
  try {
    const { text } = await complete({
      driver: cfg.driver, responsesUrl: cfg.url, apiKey: cfg.apiKey, model: cfg.model,
      instructions: "", input: [{ type: "message", role: "user", content: [{ type: "input_text", text: "Reply with the single word OK." }] }],
      retry: { attempts: 1, baseMs: 0 }, errorMaxChars: AGENT_LIMITS.errorMaxChars, modelOptions: undefined, signal: undefined,
    });
    return json(res, 200, { ok: true, text: String(text || "").slice(0, 80) });
  } catch (e: any) {
    return json(res, 200, { ok: false, error: String(e?.message || e).slice(0, 400) });
  }
};

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
