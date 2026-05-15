import { listEnabledMemories } from "../../repository/memory.js";

const trim = (value, max) => String(value || "").trim().slice(0, max);
const PROMPT_MEMORY_FALLBACK_TITLE = "__T_PROMPT_MEMORY_FALLBACK_TITLE__";
const PROMPT_MEMORY_SUMMARY = "__T_PROMPT_MEMORY_SUMMARY__";
const PROMPT_MEMORY_CONTENT = "__T_PROMPT_MEMORY_CONTENT__";

// 用户在"记忆"应用里写下、并标记启用的条目,作为 AI 的长期上下文拼到 system prompt。
// 与 appContext(单条消息临时上下文)不同,这部分会出现在每一轮对话里。
const memory = () => {
  const items = listEnabledMemories();
  if (!items.length) return "";
  const lines = items.map((item) => {
    const title = trim(item.title, 120) || `${PROMPT_MEMORY_FALLBACK_TITLE} #${item.id}`;
    const description = trim(item.description, 400);
    const content = trim(item.content, 4000);
    return [
      `### ${title}`,
      description ? `${PROMPT_MEMORY_SUMMARY}: ${description}` : "",
      content ? `${PROMPT_MEMORY_CONTENT}:\n${content}` : ""
    ].filter(Boolean).join("\n");
  });
  return `\n\n## __T_PROMPT_MEMORY_TITLE__\n__T_PROMPT_MEMORY_INTRO__\n${lines.join("\n\n")}`;
};

export {
  memory
};
