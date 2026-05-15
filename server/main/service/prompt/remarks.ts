import { firstAndRecentRemarks } from "../chat/remarks.js";
import { countChatMessages } from "../../repository/chat/messages.js";
import { getSettings } from "../settings/get.js";

const INSTRUCTION = `当本轮产生了值得长期记住的关键结论、决定、用户偏好或核心事实时，在你回答的最末尾追加一段 \`<remark>...</remark>\`，里面用一两句话写下要点。这段批注仅用于让你在后续轮次中回忆此前主线，不会展示在正文。不必每次都写，只在确实有值得长期记住的内容时写。`;

const remarks = (currentConversationId) => {
  const cid = String(currentConversationId || "").trim();
  if (!cid) return "";

  let block = `

## 长对话记忆
${INSTRUCTION}`;

  // 只有当历史消息数超出 contextRounds(意味着上下文窗口要切掉前面)时,
  // 才把过往 remark 注入回 system prompt 帮 AI 找回主线;
  // 否则全部历史都还在窗口里,无需重复.
  const total = countChatMessages(cid);
  const { contextRounds } = getSettings();
  if (total <= contextRounds) return block;

  const list = firstAndRecentRemarks(cid, 10, 20);
  if (!list.length) return block;

  const lines = list.map((r, i) => `${i + 1}. ${String(r).replace(/\s+/g, " ").slice(0, 300)}`);
  block += `

### 早前要点（按时间顺序，最早 → 最近；中间段已省略）
${lines.join("\n")}`;
  return block;
};

export {
  remarks
};
