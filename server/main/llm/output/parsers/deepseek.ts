import { openaiParser } from "./openai.js";

const createState = () => ({
  ...openaiParser.createState(),
  reasoning_content: ""
});

const parseChunk = (json, state, onDelta) => {
  const choice = json?.choices?.[0];
  const delta = choice?.delta || {};
  const reasoningText = typeof delta.reasoning_content === "string"
    ? delta.reasoning_content
    : typeof delta.reasoning === "string"
      ? delta.reasoning
      : "";
  if (reasoningText) {
    state.reasoning_content += reasoningText;
  }
  openaiParser.parseChunk(json, state, onDelta);
};

const toMessage = (state) => {
  const message: any = openaiParser.toMessage(state);
  if (message.tool_calls || state.reasoning_content) {
    message.reasoning_content = state.reasoning_content || "";
  }
  return message;
};

const deepseekParser = {
  createState,
  parseChunk,
  toMessage
};

export { deepseekParser };
