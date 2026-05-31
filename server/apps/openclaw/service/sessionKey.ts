const defaultSessionKey = "wandesk";

const normalizeSessionKey = (value?: string) => {
  const raw = String(value || defaultSessionKey).trim() || defaultSessionKey;
  const unwrapped = raw.match(/^agent:[^:]+:(.+)$/)?.[1] || raw;
  return unwrapped.replace(/[^\w:.-]/g, "-").slice(0, 96) || defaultSessionKey;
};

export { defaultSessionKey, normalizeSessionKey };
