// Wallpaper generation: a feature of the shell itself, going through the same env.AI path (recorded under
// appId __shell, visible in the activity feed).
//
// It lives in the kernel instead of being its own app because it configures the shell's own appearance —— it
// belongs on the "configuration framework" side.
import type { IncomingMessage, ServerResponse } from "http";
import { json, readJson } from "./http.js";
import { aiAsk } from "../syscall/ai.js";

const SYSTEM = `You generate a wallpaper for a desktop. Output only a single CSS background property value — no explanation, no code fence.
Requirements: pure CSS (a gradient / radial-gradient combination), no references to external images, colors soft enough to look at for long periods.
Example output: radial-gradient(120% 90% at 20% 10%, #f7e8d8 0%, #efd9c4 45%, #d9bfa6 100%)`;

export const handleWallpaperApi = async (req: IncomingMessage, res: ServerResponse, rest: string): Promise<boolean> => {
  if (rest !== "/create" || req.method !== "POST") return false;
  const body = await readJson(req);
  const desc = String(body.prompt || "").trim();
  if (!desc) return json(res, 200, { ok: false, error: "Description cannot be empty" });

  const out = await aiAsk("__shell", {
    summary: `Generate wallpaper: ${desc.slice(0, 20)}`,
    system: SYSTEM,
    prompt: `Wallpaper description: ${desc}`,
  });
  if (!out.ok) return json(res, 200, { ok: false, error: out.error });

  const css = String(out.text || "").trim().replace(/^```[a-z]*\n?|```$/g, "").trim();
  if (!css || css.length > 2000) return json(res, 200, { ok: false, error: "The model did not return usable CSS" });
  return json(res, 200, { ok: true, id: `custom-${Date.now().toString(36)}`, css });
};
