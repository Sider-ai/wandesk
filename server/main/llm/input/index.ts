const normalizeLlmPayload = (payload, normalizer) => {
  return {
    ...payload,
    messages: normalizer?.normalizeMessages(payload?.messages) || []
  };
};

export { normalizeLlmPayload };
