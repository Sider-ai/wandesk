const defaultSessionKey = "wandesk";

const normalizeSessionKey = (value?: string) => {
  const raw = String(value || defaultSessionKey).trim() || defaultSessionKey;
  return raw.startsWith("agent:") ? raw : raw.replace(/[^\w:.-]/g, "-").slice(0, 96) || defaultSessionKey;
};

export { defaultSessionKey, normalizeSessionKey };
