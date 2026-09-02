// env.AI —— the one and only intelligence surface.
//
// "Apps don't share data with each other; what apps share is the same all-knowing agent."
// An app doesn't need to know what exists in the system — it just says what it wants; the
// gathering of memory, conversation history, and workspace files all happens at this layer. The
// kernel therefore never has to grow any domain concepts of its own —— it never has to know what
// a "note" is.
//
//   ask    A one-shot completion, no tools. Use it for a title or to polish a piece of text.
//   run    A full agent round, with bash / read / write / edit, returns the final text once it finishes.
//   stream Same as run, but emits SSE token by token —— the app can pass it straight through as its
//          own response body to the frontend. This is the only push path that works inside workerd
//          (within a single HTTP request), and it's what makes the chat app possible.
import { complete } from "../ai/index.js";
import { runAgent } from "../agent/index.js";
import { EVENTS } from "../ai/events.js";
import { AGENT_LIMITS } from "../config.js";
import { modelConfig } from "../data/settings.js";
import { memoryBlock } from "../memory/index.js";
import { appsBlock, languageBlock } from "../apps/scan.js";
import { startActivity, finishActivity } from "../data/activity.js";
import { workspace } from "../paths.js";
import { broadcast } from "../realtime.js";

export type AiRequest = {
  summary: string;
  prompt: string;
  system?: string;
  /** An app can bring its own context; the kernel injects memory ahead of it. */
  data?: unknown;
};

const textItem = (text: string) => ({
  type: "message",
  role: "user",
  content: [{ type: "input_text", text }],
});

/** instructions = the app's persona + the app roster and memory injected by the kernel. An app never sees this raw text — only the model does. */
export const buildInstructions = (system?: string) => {
  const base = String(system || modelConfig().system || "").trim();
  return `${base}${appsBlock()}${languageBlock()}${memoryBlock()}`.trim();
};

const buildPrompt = (req: AiRequest) => {
  const parts = [String(req.prompt || "")];
  if (req.data !== undefined) {
    try { parts.push("\n\n# Attached data\n```json\n" + JSON.stringify(req.data, null, 2) + "\n```"); } catch { /* ignore if not serializable */ }
  }
  return parts.join("");
};

const assertConfigured = () => {
  const cfg = modelConfig();
  if (!cfg.url || !cfg.model) throw new Error("No model configured yet: fill in the endpoint URL and model ID in Settings");
  return cfg;
};

/** Every call gets logged as one activity entry —— summary is required so the user can see who's burning tokens and why. */
const track = (appId: string, summary: string) => {
  const clean = String(summary || "").trim();
  if (!clean) throw new Error("summary is required: a short sentence describing what this call is for");
  const id = startActivity(appId, clean);
  broadcast("activity.start", { id, appId, summary: clean });
  return {
    done: (detail = "") => { finishActivity(id, "done", detail); broadcast("activity.end", { id, status: "done" }); },
    fail: (detail: string) => { finishActivity(id, "error", detail); broadcast("activity.end", { id, status: "error" }); },
  };
};

// ── ask: one-shot completion ────────────────────────────────────────────
export const aiAsk = async (appId: string, req: AiRequest) => {
  const cfg = assertConfigured();
  const act = track(appId, req.summary);
  try {
    const { text, usage } = await complete({
      driver: cfg.driver,
      responsesUrl: cfg.url,
      apiKey: cfg.apiKey,
      model: cfg.model,
      instructions: buildInstructions(req.system),
      input: [textItem(buildPrompt(req))],
      retry: AGENT_LIMITS.retry,
      errorMaxChars: AGENT_LIMITS.errorMaxChars,
      modelOptions: undefined,
      signal: undefined,
    });
    act.done();
    return { ok: true, text, usage };
  } catch (e: any) {
    act.fail(String(e?.message || e));
    return { ok: false, error: String(e?.message || e) };
  }
};

// ── the single agent round shared by run / stream ──────────────────────────────
type RunHooks = { onEvent?: (name: string, payload: any) => void };

const runOnce = async (appId: string, req: AiRequest, hooks: RunHooks = {}) => {
  const cfg = assertConfigured();
  const runId = `${appId}-${Date.now()}`;
  const result = await runAgent({
    runId,
    driver: cfg.driver,
    responsesUrl: cfg.url,
    apiKey: cfg.apiKey,
    model: cfg.model,
    instructions: buildInstructions(req.system),
    input: [textItem(buildPrompt(req))],
    maxRounds: AGENT_LIMITS.maxRounds,
    errorMaxChars: AGENT_LIMITS.errorMaxChars,
    retry: AGENT_LIMITS.retry,
    workdir: workspace(),
    bash: AGENT_LIMITS.bash,
    emit: (name: string, payload: any) => hooks.onEvent?.(name, payload),
  });
  const text = (result.items || [])
    .filter((i: any) => i.type === "message")
    .flatMap((i: any) => (Array.isArray(i.content) ? i.content : []))
    .map((p: any) => p.text || "")
    .join("");
  return { text, items: result.items, usage: result.usage, status: result.status };
};

export const aiRun = async (appId: string, req: AiRequest) => {
  const act = track(appId, req.summary);
  try {
    const out = await runOnce(appId, req);
    act.done();
    return { ok: true, ...out };
  } catch (e: any) {
    act.fail(String(e?.message || e));
    return { ok: false, error: String(e?.message || e) };
  }
};

/** SSE stream: event names follow the kernel's contract (message / reasoning / function_call / …). */
export const aiStream = (appId: string, req: AiRequest): ReadableStream<Uint8Array> => {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch { /* downstream already disconnected */ }
      };
      let act: ReturnType<typeof track> | null = null;
      try {
        act = track(appId, req.summary);
        // The kernel's own internal done never goes out —— it doesn't carry the final text. We add
        // a single done here that carries the full text instead; the app frontend only ever sees
        // this one end-of-stream signal and never has to tell the two kinds of done apart.
        const out = await runOnce(appId, req, {
          onEvent: (name, payload) => { if (name !== EVENTS.DONE) send(name, payload); },
        });
        send(EVENTS.DONE, { text: out.text, usage: out.usage, status: out.status });
        act.done();
      } catch (e: any) {
        const message = String(e?.message || e);
        send(EVENTS.ERROR, { error: message });
        act?.fail(message);
      } finally {
        try { controller.close(); } catch { /* already closed */ }
      }
    },
  });
};
