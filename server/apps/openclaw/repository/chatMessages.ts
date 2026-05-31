import { db } from "./client.js";

const SELECT = "id, session_key AS sessionKey, message, created_at AS createdAt";

const parseMessage = (row) => {
  let message = {};
  try {
    message = JSON.parse(row.message);
  } catch {
    message = { role: "assistant", content: "" };
  }
  return {
    id: row.id,
    sessionKey: row.sessionKey,
    createdAt: row.createdAt,
    ...message
  };
};

const appendChatMessage = (sessionKey, message) => {
  const info = db
    .prepare("INSERT INTO openclaw_chat_messages (session_key, message) VALUES (?, ?)")
    .run(sessionKey, JSON.stringify(message));
  return db
    .prepare(`SELECT ${SELECT} FROM openclaw_chat_messages WHERE id = ?`)
    .get(Number(info.lastInsertRowid));
};

const listChatMessages = (sessionKey) =>
  db
    .prepare(`SELECT ${SELECT} FROM openclaw_chat_messages WHERE session_key = ? ORDER BY id ASC`)
    .all(sessionKey)
    .map(parseMessage);

const deleteChatMessages = (sessionKey) => {
  db.prepare("DELETE FROM openclaw_chat_messages WHERE session_key = ?").run(sessionKey);
  return { success: true };
};

export {
  appendChatMessage,
  deleteChatMessages,
  listChatMessages,
  parseMessage
};
