import { openaiNormalizer } from "./openai.js";

const kimiNormalizer = {
  normalizeMessages: openaiNormalizer.normalizeMessages
};

export { kimiNormalizer };
