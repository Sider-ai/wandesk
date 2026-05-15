import { openaiNormalizer } from "./openai.js";

const normalizeAssistantToolCall = (message) => {
  if (
    message?.role !== "assistant" ||
    !Array.isArray(message.tool_calls) ||
    message.tool_calls.length === 0 ||
    message.reasoning_content !== undefined
  ) {
    return message;
  }

  return {
    ...message,
    reasoning_content: ""
  };
};

const normalizeMessages = (messages = []) => {
  return openaiNormalizer.normalizeMessages(messages).map(normalizeAssistantToolCall);
};

const deepseekNormalizer = {
  normalizeMessages
};

export { deepseekNormalizer };
