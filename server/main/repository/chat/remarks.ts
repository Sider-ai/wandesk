import { db } from "../client.js";

const listHeadRemarkRows = (conversationId, limit) => {
  return db.prepare(
    `SELECT id, remark FROM messages
     WHERE conversation_id = ? AND remark IS NOT NULL
     ORDER BY id ASC LIMIT ?`
  ).all(conversationId, limit);
};

const listTailRemarkRows = (conversationId, limit) => {
  return db.prepare(
    `SELECT id, remark FROM messages
     WHERE conversation_id = ? AND remark IS NOT NULL
     ORDER BY id DESC LIMIT ?`
  ).all(conversationId, limit);
};

const listRemarkRows = (conversationId) => {
  return db.prepare(
    `SELECT id, remark, created_at FROM messages
     WHERE conversation_id = ? AND remark IS NOT NULL
     ORDER BY id ASC`
  ).all(conversationId);
};

export {
  listHeadRemarkRows,
  listRemarkRows,
  listTailRemarkRows
};
