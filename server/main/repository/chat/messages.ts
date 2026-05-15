import { db } from "../client.js";
const countChatMessages = (conversationId) => {
  const row = db.prepare("SELECT COUNT(*) as count FROM messages WHERE conversation_id = ?").get(conversationId);
  return Number(row?.count || 0);
};
const listChatMessageRowsPaged = (conversationId, limit, offset) => {
  return db.prepare(
    "SELECT id, message, meta, remark FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT ? OFFSET ?"
  ).all(conversationId, limit, offset);
};
const listRecentChatMessageRows = (conversationId, limit) => {
  return db.prepare(
    "SELECT id, message, meta FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT ?"
  ).all(conversationId, limit);
};
const insertChatMessageRow = (conversationId, message, meta = null, remark = null) => {
  return db.prepare(
    "INSERT INTO messages (conversation_id, message, meta, remark) VALUES (?, ?, ?, ?)"
  ).run(conversationId, message, meta, remark);
};
const getChatState = (conversationId) => {
  const row = db.prepare("SELECT state FROM chats WHERE conversation_id = ? LIMIT 1").get(conversationId);
  return row?.state || "idle";
};
export {
  countChatMessages,
  getChatState,
  insertChatMessageRow,
  listRecentChatMessageRows,
  listChatMessageRowsPaged
};
