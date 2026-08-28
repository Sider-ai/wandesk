// 会话与消息:messages 逐条落库,一行一个 Responses item。
// 中途停止只丢正在流式的半句;刷新、开多窗口都不丢流。
import { randomUUID } from "crypto";
import { all, one, run } from "./db.js";

export type Conversation = {
  id: string;
  title: string;
  pinned: number;
  created_at: string;
  updated_at: string;
};

export const listConversations = (): Conversation[] =>
  all<Conversation>("SELECT id, title, pinned, created_at, updated_at FROM conversations ORDER BY pinned DESC, updated_at DESC");

export const createConversation = (title = "新对话"): Conversation => {
  const id = randomUUID();
  run("INSERT INTO conversations (id, title) VALUES (?, ?)", id, title);
  return one<Conversation>("SELECT id, title, pinned, created_at, updated_at FROM conversations WHERE id = ?", id)!;
};

export const touchConversation = (id: string) =>
  run("UPDATE conversations SET updated_at = datetime('now') WHERE id = ?", id);

export const renameConversation = (id: string, title: string) =>
  run("UPDATE conversations SET title = ?, updated_at = datetime('now') WHERE id = ?", title.slice(0, 120), id);

export const deleteConversation = (id: string) => run("DELETE FROM conversations WHERE id = ?", id);

// ── 消息 ──
export type StoredItem = { seq: number; role: string; item: any };

export const listItems = (conversationId: string): StoredItem[] =>
  all<{ seq: number; role: string; item_json: string }>(
    "SELECT seq, role, item_json FROM messages WHERE conversation_id = ? ORDER BY seq",
    conversationId,
  ).map((r) => ({ seq: r.seq, role: r.role, item: JSON.parse(r.item_json) }));

const nextSeq = (conversationId: string) =>
  (one<{ n: number }>("SELECT COALESCE(MAX(seq), 0) + 1 AS n FROM messages WHERE conversation_id = ?", conversationId)?.n ?? 1);

/** 一个 item 落一行。role 冗余出来只为列表渲染省一次 JSON.parse。 */
export const appendItem = (conversationId: string, item: any, role = "") => {
  const seq = nextSeq(conversationId);
  run(
    "INSERT INTO messages (conversation_id, seq, role, item_json) VALUES (?, ?, ?, ?)",
    conversationId, seq, role || item?.role || item?.type || "", JSON.stringify(item),
  );
  touchConversation(conversationId);
  return seq;
};

export const recordCompaction = (conversationId: string, kind: string, startSeq: number, endSeq: number, summary: string, tokens: number) =>
  run(
    "INSERT INTO compactions (conversation_id, kind, start_seq, end_seq, summary, tokens) VALUES (?, ?, ?, ?, ?, ?)",
    conversationId, kind, startSeq, endSeq, summary, tokens,
  );
