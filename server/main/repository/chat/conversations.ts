import { db } from "../client.js";

const insertChat = ({ conversationId, title, scene, meta = null }) => {
  db.prepare("INSERT INTO chats (conversation_id, title, scene, meta) VALUES (?, ?, ?, ?)").run(
    conversationId,
    title,
    scene,
    meta ? JSON.stringify(meta) : null
  );
};

const chatExists = (conversationId) => {
  return !!db.prepare("SELECT 1 FROM chats WHERE conversation_id = ? LIMIT 1").get(conversationId);
};

const updateChatState = (conversationId, state) => {
  db.prepare("UPDATE chats SET state = ? WHERE conversation_id = ?").run(state, conversationId);
};

const updateChatPinned = (conversationId, pinned) => {
  db.prepare("UPDATE chats SET pinned = ? WHERE conversation_id = ?").run(pinned, conversationId);
};

export {
  chatExists,
  insertChat,
  updateChatPinned,
  updateChatState
};
