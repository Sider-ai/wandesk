import { db } from "../client.js";
const listChatRows = (scene = null) => {
  if (scene) {
    return db.prepare(`
      SELECT id, conversation_id, title, description, scene, meta, state, pinned, created_at
      FROM chats
      WHERE scene = ?
      ORDER BY pinned DESC, created_at DESC
    `).all(scene);
  }
  return db.prepare(`
    SELECT id, conversation_id, title, description, scene, meta, state, pinned, created_at
    FROM chats
    ORDER BY pinned DESC, created_at DESC
  `).all();
};
const listRecentChatSummaryRows = (limit = 3) => {
  return db.prepare(`
    SELECT conversation_id, title, description
    FROM chats
    ORDER BY datetime(created_at) DESC, id DESC
    LIMIT ?
  `).all(limit);
};
export {
  listRecentChatSummaryRows,
  listChatRows
};
