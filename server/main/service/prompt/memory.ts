import { listEnabledMemories } from "../../repository/memory.js";

const trim = (value, max) => String(value || "").trim().slice(0, max);

// 用户在"记忆"应用里写下、并标记启用的条目,作为 AI 的长期上下文拼到 system prompt。
// 与 appContext(单条消息临时上下文)不同,这部分会出现在每一轮对话里。
const memory = () => {
  const items = listEnabledMemories();
  if (!items.length) return "";
  const lines = items.map((item) => {
    const title = trim(item.title, 120) || `记忆 #${item.id}`;
    const description = trim(item.description, 400);
    const content = trim(item.content, 4000);
    return [
      `### ${title}`,
      description ? `摘要:${description}` : "",
      content ? `内容:\n${content}` : ""
    ].filter(Boolean).join("\n");
  });
  return `\n\n## 用户记忆\n以下是用户写给你的长期记忆,请在所有对话里把它们当成事实背景。\n${lines.join("\n\n")}`;
};

export {
  memory
};
