import { db } from "../client.js";
const saveTaskMessage = (conversationId, msg, meta = null) => {
  db.prepare("INSERT INTO messages (conversation_id, message, meta) VALUES (?, ?, ?)").run(
    conversationId,
    JSON.stringify(msg),
    meta ? JSON.stringify(meta) : null
  );
};
const listMessagesByConversationId = (conversationId) => {
  return db.prepare(
    "SELECT id, message, meta, created_at FROM messages WHERE conversation_id = ? ORDER BY id ASC"
  ).all(conversationId);
};
export {
  listMessagesByConversationId,
  saveTaskMessage
};
