import { chat } from "../../../ai/handler.js";

const executeAgentTask = async ({
  messages,
  settings,
  emitMessage,
  signal
}) => {
  const {
    apiUrl,
    apiKey,
    model,
    provider,
    enableToolResultTruncate,
    toolResultMaxChars,
    enableToolLoopLimit,
    toolMaxRounds
  } = settings;
  const send = (msg) => {
    if (msg.type === "tool_call") {
      if (msg.toolCall) {
        emitMessage({
          role: "assistant",
          content: null,
          tool_calls: [msg.toolCall]
        });
      }
      return;
    }
    if (msg.type === "tool_result") {
      if (msg.message) emitMessage(msg.message);
      return;
    }
    if (msg.type === "assistant") {
      if (msg.message) emitMessage(msg.message);
    }
  };
  const response = await chat(messages, {
    provider,
    apiUrl,
    apiKey,
    model,
    send,
    signal,
    maxRounds: enableToolLoopLimit ? toolMaxRounds : 1e5,
    enableToolResultTruncate,
    toolResultMaxChars
  });
  return {
    assistantMessage: { role: "assistant", content: response },
    response
  };
};

export {
  executeAgentTask
};
