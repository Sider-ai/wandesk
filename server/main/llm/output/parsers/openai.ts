import { normalizeUsage } from "../usage.js";

const ensureToolCall = (toolCalls, index) => {
  if (!toolCalls[index]) {
    toolCalls[index] = {
      id: "",
      type: "function",
      function: { name: "", arguments: "" }
    };
  }
  return toolCalls[index];
};

const mergeToolCall = (target, delta) => {
  for (const [key, value] of Object.entries(delta || {})) {
    if (value == null || key === "index") continue;
    if (key === "function" && typeof value === "object") {
      const fn = value as any;
      target.function ||= { name: "", arguments: "" };
      if (typeof fn.name === "string") target.function.name += fn.name;
      if (typeof fn.arguments === "string") target.function.arguments += fn.arguments;
      for (const [subKey, subValue] of Object.entries(fn)) {
        if (subValue == null || subKey === "name" || subKey === "arguments") continue;
        target.function[subKey] = subValue;
      }
      continue;
    }
    target[key] = value;
  }
};

const createState = () => ({
  content: "",
  toolCalls: [],
  usage: null
});

const parseChunk = (json, state, onDelta) => {
  if (json?.usage) {
    state.usage = normalizeUsage(json.usage);
  }
  const choice = json?.choices?.[0];
  if (!choice) return;
  const delta = choice.delta || {};
  const text = typeof delta.content === "string" ? delta.content : "";
  if (text) {
    state.content += text;
    onDelta?.(text);
  }
  if (Array.isArray(delta.tool_calls)) {
    for (const tc of delta.tool_calls) {
      const idx = Number(tc?.index || 0);
      const target = ensureToolCall(state.toolCalls, idx);
      mergeToolCall(target, tc);
    }
  }
};

const toMessage = (state) => {
  if (state.toolCalls.length > 0) {
    return {
      role: "assistant",
      content: state.content || null,
      tool_calls: state.toolCalls.filter(Boolean),
      usage: state.usage
    };
  }

  return {
    role: "assistant",
    content: state.content ?? "",
    usage: state.usage
  };
};

const openaiParser = {
  createState,
  parseChunk,
  toMessage
};

export { openaiParser };
