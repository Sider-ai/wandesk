import { appendChatMessage, deleteChatMessages, listChatMessages, parseMessage } from "../repository/chatMessages.js";
import { normalizeSessionKey } from "./sessionKey.js";

const listHistory = (sessionKey?: string) => ({
  success: true,
  sessionKey: normalizeSessionKey(sessionKey),
  messages: listChatMessages(normalizeSessionKey(sessionKey))
});

const appendHistory = (sessionKey: string, message) => {
  const row = appendChatMessage(normalizeSessionKey(sessionKey), message);
  return parseMessage(row);
};

const clearHistory = (sessionKey?: string) => {
  const key = normalizeSessionKey(sessionKey);
  deleteChatMessages(key);
  return { success: true, sessionKey: key };
};

export {
  appendHistory,
  clearHistory,
  listHistory
};
