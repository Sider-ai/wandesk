import { randomUUID } from "crypto";
import {
  chatExists,
  insertChat,
  updateChatPinned,
  updateChatState
} from "../../repository/chat/conversations.js";
const createChat = (title = "新对话", scene = "chat", meta = null) => {
  const conversationId = randomUUID();
  insertChat({ conversationId, title, scene, meta });
  return { conversationId };
};
const hasChat = (conversationId) => {
  const id = String(conversationId || "").trim();
  if (!id) return false;
  return chatExists(id);
};
const setChatState = (conversationId, state = "idle") => {
  const id = String(conversationId || "").trim();
  const next = state === "running" ? "running" : "idle";
  if (!id) return { success: false };
  updateChatState(id, next);
  return { success: true, state: next };
};
const setChatPinned = (conversationId, pinned) => {
  const id = String(conversationId || "").trim();
  const next = pinned ? 1 : 0;
  if (!id) return { success: false };
  updateChatPinned(id, next);
  return { success: true, pinned: Boolean(next) };
};
export {
  createChat,
  hasChat,
  setChatPinned,
  setChatState
};
