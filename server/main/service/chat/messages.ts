import { countChatMessages, getChatState, listChatMessageRowsPaged } from "../../repository/chat/messages.js";
const getChatMessagesPaged = (conversationId, limit = 20, offset = 0) => {
  const total = countChatMessages(conversationId);
  const rows = listChatMessageRowsPaged(conversationId, limit, offset);
  return {
    messages: rows.reverse().map((r) => ({
      ...JSON.parse(r.message),
      _id: r.id,
      _meta: r.meta ? JSON.parse(r.meta) : null,
      _remark: r.remark || null
    })),
    total,
    hasMore: offset + limit < total,
    offset,
    state: getChatState(conversationId)
  };
};
export {
  getChatMessagesPaged
};
