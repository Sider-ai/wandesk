import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { runHermes } from "./exec.js";

const stateDbPath = () => path.join(os.homedir(), ".hermes", "state.db");

const cleanPreview = (value: unknown) => String(value || "").replace(/\s+/g, " ").trim();

const normalizeTimestamp = (value: unknown) => {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
};

const fallbackSessionsFromCli = async () => {
  const raw = await runHermes(["sessions", "list"], 15000);
  const rows = raw.stdout.split(/\r?\n/).slice(2).map((line) => line.trim()).filter(Boolean);
  const sessions = rows
    .filter((line) => !line.startsWith("─"))
    .map((line) => {
      const match = line.match(/(\d{8}_\d{6}_[a-z0-9]+)$/i);
      const id = match?.[1] || "";
      const preview = id ? line.slice(0, line.lastIndexOf(id)).trim() : line;
      return { id, preview, title: "", source: "", model: "", startedAt: 0, lastActive: 0, endedAt: null, messageCount: 0, inputTokens: 0, outputTokens: 0, cacheReadTokens: 0, reasoningTokens: 0, toolCallCount: 0, apiCallCount: 0 };
    })
    .filter((item) => item.id);
  return { success: true, count: sessions.length, sessions };
};

const listSessions = async (limit = 20) => {
  const dbPath = stateDbPath();
  if (!existsSync(dbPath)) return { success: true, count: 0, sessions: [] };

  const safeLimit = Math.max(1, Math.min(Number(limit) || 20, 80));
  try {
    const db = new DatabaseSync(dbPath, { readOnly: true });
    try {
      const rows = db.prepare(`
        SELECT
          s.id,
          s.title,
          s.source,
          s.model,
          s.started_at AS startedAt,
          s.ended_at AS endedAt,
          s.message_count AS messageCount,
          s.tool_call_count AS toolCallCount,
          s.input_tokens AS inputTokens,
          s.output_tokens AS outputTokens,
          s.cache_read_tokens AS cacheReadTokens,
          s.reasoning_tokens AS reasoningTokens,
          s.api_call_count AS apiCallCount,
          COALESCE((SELECT MAX(m.timestamp) FROM messages m WHERE m.session_id = s.id), s.started_at) AS lastActive,
          (SELECT m.content FROM messages m WHERE m.session_id = s.id AND m.role = 'user' AND m.content IS NOT NULL AND TRIM(m.content) != '' ORDER BY m.timestamp ASC LIMIT 1) AS preview
        FROM sessions s
        ORDER BY lastActive DESC
        LIMIT ${safeLimit}
      `).all() as any[];

      const sessions = rows.map((row) => ({
        id: String(row.id || ""),
        title: String(row.title || ""),
        source: String(row.source || ""),
        model: String(row.model || ""),
        startedAt: normalizeTimestamp(row.startedAt),
        lastActive: normalizeTimestamp(row.lastActive),
        endedAt: row.endedAt ?? null,
        messageCount: Number(row.messageCount || 0),
        toolCallCount: Number(row.toolCallCount || 0),
        inputTokens: Number(row.inputTokens || 0),
        outputTokens: Number(row.outputTokens || 0),
        cacheReadTokens: Number(row.cacheReadTokens || 0),
        reasoningTokens: Number(row.reasoningTokens || 0),
        apiCallCount: Number(row.apiCallCount || 0),
        preview: cleanPreview(row.preview || row.title)
      }));

      const total = db.prepare("SELECT COUNT(*) AS count FROM sessions").get() as any;
      return { success: true, count: Number(total?.count || sessions.length), sessions };
    } finally {
      db.close();
    }
  } catch (err: any) {
    try {
      return await fallbackSessionsFromCli();
    } catch {
      return { status: 500, message: err?.message || "Hermes sessions read failed" };
    }
  }
};

const listMessages = async (sessionId?: string, limit = 160) => {
  if (!sessionId?.trim()) return { status: 400, message: "sessionId is required" };
  const dbPath = stateDbPath();
  if (!existsSync(dbPath)) return { success: true, sessionId, messages: [] };

  const safeLimit = Math.max(1, Math.min(Number(limit) || 160, 300));
  try {
    const db = new DatabaseSync(dbPath, { readOnly: true });
    try {
      const rows = db.prepare(`
        SELECT id, role, content, tool_name AS toolName, timestamp, token_count AS tokenCount, finish_reason AS finishReason
        FROM messages
        WHERE session_id = ?
        ORDER BY timestamp ASC
        LIMIT ${safeLimit}
      `).all(sessionId.trim()) as any[];

      return {
        success: true,
        sessionId: sessionId.trim(),
        messages: rows.map((row) => ({
          id: Number(row.id),
          role: String(row.role || ""),
          content: String(row.content || ""),
          toolName: String(row.toolName || ""),
          timestamp: normalizeTimestamp(row.timestamp),
          tokenCount: Number(row.tokenCount || 0),
          finishReason: String(row.finishReason || "")
        }))
      };
    } finally {
      db.close();
    }
  } catch (err: any) {
    return { status: 500, message: err?.message || "Hermes messages read failed" };
  }
};

export { listMessages, listSessions };
