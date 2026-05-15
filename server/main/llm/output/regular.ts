import { normalizeUsage } from "./usage.js";

const parseRegularResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM ${res.status}: ${text}`);
  }

  const json = await res.json();
  const message = json?.choices?.[0]?.message;
  if (!message) {
    throw new Error("LLM response missing choices[0].message");
  }

  return {
    role: "assistant",
    content: message.content ?? "",
    tool_calls: Array.isArray(message.tool_calls) ? message.tool_calls : undefined,
    reasoning_content: message.reasoning_content,
    usage: normalizeUsage(json?.usage)
  };
};

export { parseRegularResponse };
