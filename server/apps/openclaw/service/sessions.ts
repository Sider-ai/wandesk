import { runOpenClawJson } from "./openclaw.js";
import { normalizeSessionKey } from "./sessionKey.js";

const normalizeSession = (item: any) => ({
  key: String(item?.key || ""),
  sessionKey: normalizeSessionKey(item?.key || item?.sessionKey || item?.sessionId),
  sessionId: String(item?.sessionId || ""),
  agentId: String(item?.agentId || "main"),
  model: [item?.modelProvider, item?.model].filter(Boolean).join("/"),
  updatedAt: item?.updatedAt || null,
  ageMs: Number(item?.ageMs || 0) || 0,
  totalTokens: Number(item?.totalTokens || 0) || 0,
  inputTokens: Number(item?.inputTokens || 0) || 0,
  outputTokens: Number(item?.outputTokens || 0) || 0
});

const listSessions = async () => {
  try {
    const { data } = await runOpenClawJson(["sessions", "--json", "--limit", "20"], 20000);
    const sessions = Array.isArray(data?.sessions) ? data.sessions : [];
    return {
      success: true,
      count: Number(data?.count ?? data?.totalCount ?? sessions.length) || 0,
      totalCount: Number(data?.totalCount ?? data?.count ?? sessions.length) || 0,
      sessions: sessions.map(normalizeSession)
    };
  } catch (err: any) {
    return { status: 500, message: err?.message || "openclaw sessions 执行失败" };
  }
};

export { listSessions };
