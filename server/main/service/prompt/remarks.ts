import { firstAndRecentRemarks } from "../chat/remarks.js";
import { countChatMessages } from "../../repository/chat/messages.js";
import { getSettings } from "../settings/get.js";

const INSTRUCTION = `__T_PROMPT_REMARKS_INSTRUCTION__`;

const remarks = (currentConversationId) => {
  const cid = String(currentConversationId || "").trim();
  if (!cid) return "";

  let block = `

## __T_PROMPT_REMARKS_TITLE__
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

### __T_PROMPT_REMARKS_EARLIER_TITLE__
${lines.join("\n")}`;
  return block;
};

export {
  remarks
};
