const normalizeMessages = (messages = []) => {
  return Array.isArray(messages) ? messages : [];
};

const openaiNormalizer = {
  normalizeMessages
};

export { openaiNormalizer };
