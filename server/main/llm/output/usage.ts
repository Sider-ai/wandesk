const normalizeUsage = (usage) => {
  if (!usage || typeof usage !== "object") return null;

  const promptTokens = Math.max(0, Number(usage.prompt_tokens) || 0);
  const completionTokens = Math.max(0, Number(usage.completion_tokens) || 0);
  const totalTokens = Math.max(
    0,
    Number(usage.total_tokens) || promptTokens + completionTokens
  );
  const cachedPromptTokens = Math.max(
    0,
    Number(usage.prompt_tokens_details?.cached_tokens) || 0
  );

  return {
    promptTokens,
    cachedPromptTokens,
    completionTokens,
    totalTokens
  };
};

export { normalizeUsage };
