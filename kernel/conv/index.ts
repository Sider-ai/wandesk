// Conversation surface —— the AGENT repo's web/server code carried into the kernel as-is.
//
// The files under `server/` and `shared/` are **unchanged, not a single line edited**,
// and even the relative imports still line up
// (`../../ai/index.js` → kernel/ai, `../../agent/index.js` → kernel/agent).
// This file only does three pieces of wiring:
//   1. Assemble an AGENT-shaped config (working directory, bash policy, and compaction
//      thresholds are supplied from the wandesk side);
//   2. Bridge its settings table **to wandesk's settings** —— the whole product has a
//      single model configuration; editing it from the assistant or from the shell's
//      settings panel writes the same place;
//   3. Expose a handle(req, res), mounted under the kernel's /api/conv/*.
//
// Apps reach this via env.AI.fetch() (see CONTRACT.md). So the "assistant" is just an
// ordinary app —— it has no special privileges; swap in a different UI and it can still
// talk to the same conversation surface.
import type { IncomingMessage, ServerResponse } from "http";
// server/ and shared/ are plain JS (kept in sync both ways with the AGENT repo); we don't add types to them
import path from "path";
import { openDatabase, createStore } from "./server/store.js";
import { createChannel } from "./server/sse.js";
import { createRuns } from "./server/runs.js";
import { createApi } from "./server/api.js";
import { createFiles } from "./server/files.js";
import { kernelDir, workspace } from "../paths.js";
import { readSettings, writeSettings } from "../data/settings.js";
import { AGENT_LIMITS } from "../config.js";
import { appsBlock, languageBlock } from "../apps/scan.js";
import { memoryBlock } from "../memory/index.js";

const WINDOWS = process.platform === "win32";

const buildConfig = () => ({
  driver: "responses",
  responsesUrl: "",
  apiKey: "",
  model: "",
  instructions: "You are a coding agent. Before calling a tool, briefly state its purpose in the summary.",
  workdir: workspace(),
  maxRounds: AGENT_LIMITS.maxRounds,
  errorMaxChars: AGENT_LIMITS.errorMaxChars,
  retry: { enabled: true, maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 30000, retryAfterStream: false },
  modelOptions: {},
  compaction: {
    contextWindowTokens: 128000, foldRatio: 0.8, tailKeepChars: 40000,
    summaryMinChars: 80, callArgsMaxChars: 2000, callOutputMaxChars: 4000,
    mechanicalItemMaxChars: 160,
    prompt: [
      "You are compacting a conversation so the agent can continue working seamlessly.",
      "Preserve the user's goals and constraints, what has already been done, key facts, paths, commands, errors, unfinished parts, and the next steps.",
      "Output only continuous summary prose in English — no tool calls, tags, or code fences.",
    ].join("\n"),
  },
  bash: {
    executable: WINDOWS ? "cmd.exe" : "/bin/zsh",
    args: WINDOWS ? ["/d", "/s", "/c"] : ["-lc"],
    minTimeoutMs: 100, defaultTimeoutMs: 120000, maxTimeoutMs: 600000, maxOutputChars: 40000,
  },
  web: { host: "127.0.0.1", port: 0, dataFile: path.join(kernelDir(), "conversations.db") },
  images: { maxBytes: 8 * 1024 * 1024, maxPerMessage: 10, maxLiveToolImages: 2, directory: path.join(kernelDir(), "files") },
});

// wandesk's key names ↔ AGENT's key names. Only apiUrl / instructions differ.
const TO_AGENT: Record<string, string> = { apiUrl: "responsesUrl", system: "instructions" };
const TO_WANDESK: Record<string, string> = { responsesUrl: "apiUrl", instructions: "system" };
const rename = (obj: Record<string, string>, map: Record<string, string>) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [map[k] || k, v]));

// Apps can read this table via env.AI.fetch("/api/settings") —— the key doesn't need to actually go out.
// Same approach as the shell's settings panel: mask it to a placeholder on read, and treat the
// placeholder coming back unchanged on write as "not changed".
const MASK = "********";
const maskKey = (s: Record<string, string>) => (s.apiKey ? { ...s, apiKey: MASK } : s);

let handler: ((req: IncomingMessage, res: ServerResponse, url: URL) => Promise<boolean>) | null = null;

export const convApi = () => {
  if (handler) return handler;
  const config = buildConfig();
  const store = createStore(openDatabase(config.web.dataFile));

  // One model configuration for the whole product: the assistant's settings page and the
  // shell's settings page write to the same table.
  const bridged = {
    ...store,
    getSettings: () => rename(readSettings(), TO_AGENT),
    setSettings: (values: Record<string, string>) => {
      const patch = { ...values };
      if (patch.apiKey === MASK) delete patch.apiKey; // placeholder coming back unchanged = not changed
      writeSettings(rename(patch, TO_WANDESK));
      return rename(readSettings(), TO_AGENT);
    },
  };

  // The run loop needs the real key; the outward-facing API layer gets the masked one. Same
  // underlying data, two views.
  const forApi = {
    ...bridged,
    getSettings: () => maskKey(bridged.getSettings()),
    setSettings: (values: Record<string, string>) => maskKey(bridged.setSettings(values)),
  };

  // When running the loop, append "installed apps" and long-term memory after instructions ——
  // the assistant and env.AI see the same world.
  // The settings page still reads back only the text the user themselves wrote; the injected part is not echoed.
  const forRuns = {
    ...bridged,
    getSettings: () => {
      const s = bridged.getSettings();
      return { ...s, instructions: `${s.instructions || ""}${appsBlock()}${languageBlock()}${memoryBlock()}`.trim() };
    },
  };

  const channel = createChannel();
  const files = createFiles(config);
  const runs = createRuns({ config, store: forRuns, files, broadcast: channel.broadcast });
  handler = createApi({ config, store: forApi, runs, files, channel, meta: { version: "2.0.0" } });
  return handler!;
};
