import { getSettings } from "../settings/get.js";
import { apps as appsSection } from "./apps.js";
import { chats as chatsSection } from "./chats.js";
import { DEFAULT_SYSTEM_PROMPT } from "./default.js";
import { environment as environmentSection } from "./environment.js";
import { memory as memorySection } from "./memory.js";
import { model as modelSection } from "./model.js";
import { remarks as remarksSection } from "./remarks.js";
import { systemDocs as systemDocsSection } from "./system-docs.js";
import { tools as toolsSection } from "./tools.js";

const instruction = (settings) => String(settings.systemPrompt || "").trim() || DEFAULT_SYSTEM_PROMPT;

// 当前会话所在应用提供的临时上下文(QuickChat 在每条消息里随路透传过来)。
// 应用通过 gui 端 useAppContext().set({ context, prompts }) 注册,
// 由 chat ws 取出后塞进这里。不入库、不跨消息持久化。
const appContextSection = (text) => {
  const trimmed = String(text || "").trim();
  if (!trimmed) return "";
  return `\n\n## 当前应用上下文\n用户正在使用某个应用,该应用主动告诉你以下信息:\n${trimmed}`;
};

const buildSystemPrompt = (currentConversationId = "", { appContext = "" }: any = {}) => {
  const settings = getSettings();
  const {
    apiUrl,
    model,
    provider,
    enableToolResultTruncate,
    toolResultMaxChars,
    enableToolLoopLimit,
    toolMaxRounds
  } = settings;
  const cwd = process.cwd();
  let prompt = instruction(settings);
  prompt += environmentSection(cwd);
  prompt += modelSection({ provider, name: model, apiUrl });
  prompt += toolsSection({
    enableToolResultTruncate,
    toolResultMaxChars,
    enableToolLoopLimit,
    toolMaxRounds
  });
  prompt += appsSection();
  prompt += chatsSection(currentConversationId);
  prompt += remarksSection(currentConversationId);
  prompt += systemDocsSection();
  prompt += memorySection();
  prompt += appContextSection(appContext);
  return prompt;
};
export {
  buildSystemPrompt
};
