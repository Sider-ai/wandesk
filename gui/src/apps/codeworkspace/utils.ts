export const fetchJson = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(data.error || data.message || `HTTP ${res.status}`);
  return data;
};

export const formatTime = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(String(iso).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return iso;
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

export const extractText = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(extractText).filter(Boolean).join("\n");
  if (value.text) return String(value.text);
  if (value.content) return extractText(value.content);
  if (value.message) return extractText(value.message);
  return "";
};

export const eventToMessage = (item: any, index: number) => {
  const payload = item?.payload || item;
  const message = payload?.message || payload;
  const role = message?.role || payload?.type || item?.type || item?.kind || "event";
  let content = extractText(message?.content || payload?.content || payload?.text || message);
  if (!content && typeof payload === "object") content = JSON.stringify(payload, null, 2);
  return { key: item?.id || `${role}-${index}`, role, content };
};

export const formatSize = (n?: number) => {
  const size = Number(n || 0);
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)}MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)}KB`;
  return `${size}B`;
};

export const pickArray = (value: any, keys: string[]) => {
  for (const key of keys) {
    if (Array.isArray(value?.[key])) return value[key];
  }
  return [];
};

export const jsonlEntries = (content: string) => String(content || "").split("\n").filter(Boolean).map((line, index) => {
  try {
    const parsed = JSON.parse(line);
    return {
      key: `${index}:${parsed.timestamp || parsed.type || "entry"}`,
      index: index + 1,
      type: parsed.type || "entry",
      timestamp: parsed.timestamp || "",
      sessionId: parsed.sessionId ? String(parsed.sessionId).slice(0, 8) : "",
      summary: summarizeEntry(parsed),
      pretty: JSON.stringify(parsed, null, 2)
    };
  } catch {
    return { key: `${index}:raw`, index: index + 1, type: "raw", timestamp: "", sessionId: "", summary: line.slice(0, 200), pretty: line };
  }
});

export const summarizeEntry = (entry: any) => {
  if (!entry || typeof entry !== "object") return "Invalid entry";
  if (entry.type === "queue_operation") return `${entry.operation || "operation"} queue`;
  if (entry.type === "user") return extractText(entry.message?.content) || "User message";
  if (entry.type === "assistant") return extractText(entry.message?.content) || entry.message?.model || "Assistant message";
  if (entry.type === "last_prompt") return entry.lastPrompt || "Last prompt";
  if (entry.type === "ai_title") return entry.aiTitle || "AI title";
  if (entry.attachment?.type) return `${entry.attachment.type}${entry.attachment.addedNames?.length ? ` · ${entry.attachment.addedNames.join(", ")}` : ""}`;
  if (entry.message?.model) return entry.message.model;
  if (entry.promptId) return `Prompt ${entry.promptId}`;
  return Object.keys(entry).slice(0, 4).join(" · ") || "Entry";
};
