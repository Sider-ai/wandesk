import { getTools } from "./tools.js";
import { runTools } from "./runner.js";
import { callLlmStream } from "../llm/index.js";
import { normalizeAgentMessages, normalizeChatOptions } from "./utils.js";

const chat = async (messages, {
  provider,
  apiUrl,
  apiKey,
  model,
  send = (_message) => {
  },
  signal,
  maxRounds = 50,
  enableToolResultTruncate = true,
  toolResultMaxChars = 12e3
}: any = {}) => {
  const opts = normalizeChatOptions({ maxRounds, enableToolResultTruncate, toolResultMaxChars });
  const workMessages = normalizeAgentMessages(messages);
  const tools = getTools();
  let round = 0;
  while (round++ < opts.maxRounds) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const payload = { model, messages: workMessages, tools };
    const message = await callLlmStream(apiUrl, apiKey, payload, {
      provider,
      signal,
      onDelta: (delta) => {
        if (delta) send({ type: "delta", delta });
      }
    });
    if (Array.isArray(message.tool_calls) && message.tool_calls.length > 0) {
      const assistantMsg: any = {
        role: "assistant",
        content: message.content ?? null,
        tool_calls: message.tool_calls
      };
      if (message.reasoning_content !== undefined) {
        assistantMsg.reasoning_content = message.reasoning_content ?? "";
      }
      workMessages.push(assistantMsg);
      send({ type: "assistant_tool_calls", message: assistantMsg });
      for (const toolCall of message.tool_calls) {
        send({ type: "tool_call", toolCall });
      }
      const toolMessages = await runTools(message.tool_calls, {
        enableToolResultTruncate: opts.enableToolResultTruncate,
        toolResultMaxChars: opts.toolResultMaxChars
      });
      for (const tm of toolMessages) {
        workMessages.push(tm);
        send({ type: "tool_result", message: tm });
      }
      continue;
    }
    const text = message.content ?? "";
    const replyMsg: any = { role: "assistant", content: text };
    if (message.reasoning_content !== undefined) {
      replyMsg.reasoning_content = message.reasoning_content ?? "";
    }
    workMessages.push(replyMsg);
    send({ type: "done", message: replyMsg });
    return text;
  }
  send({ type: "done", message: { role: "assistant", content: "__T_CHAT_MAX_ROUNDS_REACHED__" } });
  return "__T_CHAT_MAX_ROUNDS_REACHED__";
};
export {
  chat
};
