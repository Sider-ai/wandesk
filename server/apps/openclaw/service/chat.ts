import { runOpenClawJson } from "./openclaw.js";
import { appendHistory } from "./history.js";
import { normalizeSessionKey } from "./sessionKey.js";

const readReply = (data: any) => {
  const payloadText = Array.isArray(data?.payloads)
    ? data.payloads.map((item: any) => String(item?.text || "")).filter(Boolean).join("\n\n")
    : "";
  return payloadText || data?.meta?.finalAssistantVisibleText || data?.meta?.finalAssistantRawText || "";
};

const chat = async ({
  message,
  sessionKey,
  agentId = "main",
  model,
  thinking = "medium",
  timeout = 180
}: {
  message?: string;
  sessionKey?: string;
  agentId?: string;
  model?: string;
  thinking?: string;
  timeout?: number;
}) => {
  if (!message?.trim()) return { status: 400, message: "message 不能为空" };

  const key = normalizeSessionKey(sessionKey);
  const safeTimeout = Math.max(30, Math.min(Number(timeout) || 180, 600));
  const userMessage = appendHistory(key, { role: "user", content: message.trim() });
  const args = [
    "agent",
    "--agent", String(agentId || "main"),
    "--session-key", key,
    "--message", message.trim(),
    "--json",
    "--timeout", String(safeTimeout)
  ];
  if (model) args.push("--model", String(model));
  if (thinking) args.push("--thinking", String(thinking));

  try {
    const { data } = await runOpenClawJson(args, (safeTimeout + 20) * 1000);
    const reply = readReply(data);
    const meta = {
      sessionKey: key,
      transport: data?.meta?.transport || "",
      fallbackFrom: data?.meta?.fallbackFrom || "",
      provider: data?.meta?.agentMeta?.provider || data?.meta?.executionTrace?.winnerProvider || "",
      model: data?.meta?.agentMeta?.model || data?.meta?.executionTrace?.winnerModel || "",
      durationMs: data?.meta?.durationMs || 0,
      sessionId: data?.meta?.agentMeta?.sessionId || ""
    };
    if (!reply.trim()) {
      const assistantMessage = appendHistory(key, { role: "assistant", content: "OpenClaw 未返回内容", meta, error: true });
      return { status: 500, message: "OpenClaw 未返回内容", userMessage, assistantMessage };
    }
    const assistantMessage = appendHistory(key, { role: "assistant", content: reply, meta });
    return {
      success: true,
      reply,
      meta,
      userMessage,
      assistantMessage
    };
  } catch (err: any) {
    const errorMessage = err?.message || "openclaw agent 执行失败";
    const assistantMessage = appendHistory(key, { role: "assistant", content: `Error: ${errorMessage}`, error: true });
    return { status: 500, message: errorMessage, userMessage, assistantMessage };
  }
};

export { chat };
