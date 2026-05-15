import { openaiNormalizer } from "./openai.js";

const geminiNormalizer = {
  normalizeMessages: openaiNormalizer.normalizeMessages
};

export { geminiNormalizer };
