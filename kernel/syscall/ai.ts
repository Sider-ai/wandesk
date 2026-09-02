// env.AI —— 唯一的智能面。
//
// 「应用之间不共享数据,应用共享的是同一个知道一切的 agent。」
// 应用不需要知道系统里有什么,它只说一句话;记忆、会话历史、工作区文件的汇聚
// 发生在这一层。内核因此不必长出任何领域概念 —— 它永远不知道「笔记」是什么。
//
//   ask    一次性补全,无工具。要个标题、润色一段文字用它。
//   run    完整 agent 轮次,带 bash / read / write / edit,跑完返回最终文本。
//   stream 同 run,但逐字吐 SSE —— 应用把它当自己的响应体透传给前端即可。
//          这是 workerd 里唯一通的推送路径(同一条 HTTP 请求内),chat 应用靠它成立。
import { complete } from "../ai/index.js";
import { runAgent } from "../agent/index.js";
import { EVENTS } from "../ai/events.js";
import { AGENT_LIMITS } from "../config.js";
import { modelConfig } from "../data/settings.js";
import { memoryBlock } from "../memory/index.js";
import { appsBlock } from "../apps/scan.js";
import { startActivity, finishActivity } from "../data/activity.js";
import { workspace } from "../paths.js";
import { broadcast } from "../realtime.js";

export type AiRequest = {
  summary: string;
  prompt: string;
  system?: string;
  /** 应用可以自带一段上下文;内核会在它之前注入记忆。 */
  data?: unknown;
};

const textItem = (text: string) => ({
  type: "message",
  role: "user",
  content: [{ type: "input_text", text }],
});

/** instructions = 应用的人格 + 内核注入的应用清单与记忆。应用拿不到这些原文,只有模型看得见。 */
export const buildInstructions = (system?: string) => {
  const base = String(system || modelConfig().system || "").trim();
  return `${base}${appsBlock()}${memoryBlock()}`.trim();
};

const buildPrompt = (req: AiRequest) => {
  const parts = [String(req.prompt || "")];
  if (req.data !== undefined) {
    try { parts.push("\n\n# 附带数据\n```json\n" + JSON.stringify(req.data, null, 2) + "\n```"); } catch { /* 忽略不可序列化 */ }
  }
  return parts.join("");
};

const assertConfigured = () => {
  const cfg = modelConfig();
  if (!cfg.url || !cfg.model) throw new Error("尚未配置模型:请在「设置」里填写接口地址与模型 ID");
  return cfg;
};

/** 每次调用都记一笔活动流水 —— summary 必填的理由:用户要看得见谁在烧 token。 */
const track = (appId: string, summary: string) => {
  const clean = String(summary || "").trim();
  if (!clean) throw new Error("summary 必填:一句话说明这次调用要干什么");
  const id = startActivity(appId, clean);
  broadcast("activity.start", { id, appId, summary: clean });
  return {
    done: (detail = "") => { finishActivity(id, "done", detail); broadcast("activity.end", { id, status: "done" }); },
    fail: (detail: string) => { finishActivity(id, "error", detail); broadcast("activity.end", { id, status: "error" }); },
  };
};

// ── ask:一次性补全 ────────────────────────────────────────────
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

// ── run / stream 共用的一轮 agent ──────────────────────────────
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

/** SSE 流:事件名沿用内核契约(message / reasoning / function_call / …)。 */
export const aiStream = (appId: string, req: AiRequest): ReadableStream<Uint8Array> => {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch { /* 下游已断开 */ }
      };
      let act: ReturnType<typeof track> | null = null;
      try {
        act = track(appId, req.summary);
        // 内核自己的 done 不外发 —— 它不带最终文本。这里统一补一个带全文的 done,
        // 应用前端只认这一个结束信号,不必分辨两种 done。
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
        try { controller.close(); } catch { /* 已关 */ }
      }
    },
  });
};
