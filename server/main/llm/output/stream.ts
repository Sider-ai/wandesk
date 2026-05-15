import { parseJson } from "../utils.js";

const parseStreamResponse = async (res, parser, onDelta) => {
  const state = parser.createState();
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM ${res.status}: ${text}`);
  }
  if (!res.body) {
    throw new Error("LLM stream body is empty");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    let sep = buffer.indexOf("\n\n");
    while (sep >= 0) {
      const event = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      sep = buffer.indexOf("\n\n");

      const lines = event
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const dataLines = lines
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());

      if (!dataLines.length) continue;
      const raw = dataLines.join("\n");
      if (!raw || raw === "[DONE]") continue;

      const json = parseJson(raw, "agent.lm.stream.chunk");
      parser.parseChunk(json, state, onDelta);
    }
  }

  return parser.toMessage(state);
};

export { parseStreamResponse };
