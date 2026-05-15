import { listRecentChatSummaryRows } from "../../repository/chat/list.js";
const PROMPT_CHATS_TITLE = "__T_PROMPT_CHATS_TITLE__";
const PROMPT_CHATS_UNTITLED = "__T_PROMPT_CHATS_UNTITLED__";
const PROMPT_CHATS_CURRENT_ID = "__T_PROMPT_CHATS_CURRENT_ID__";
const PROMPT_CHATS_RECENT = "__T_PROMPT_CHATS_RECENT__";
const recentChats = () => {
  return listRecentChatSummaryRows(3).map((row) => ({
    conversationId: row.conversation_id,
    title: String(row.title || "").trim(),
    description: String(row.description || "").trim().slice(0, 100)
  }));
};
const chats = (currentConversationId) => {
  const currentId = String(currentConversationId || "").trim();
  const list = recentChats();
  if (!currentId && (!Array.isArray(list) || list.length === 0)) return "";
  const recentLines = list.slice(0, 3).map((c, i) => `${i + 1}. ${c.title || PROMPT_CHATS_UNTITLED} | ${String(c.description || "").slice(0, 100)}`);
  let block = `

## ${PROMPT_CHATS_TITLE}`;
  if (currentId) {
    block += `
- ${PROMPT_CHATS_CURRENT_ID}: ${currentId}`;
  }
  if (recentLines.length) {
    block += `
- ${PROMPT_CHATS_RECENT}:
${recentLines.join("\n")}`;
  }
  return block;
};
export {
  chats
};
