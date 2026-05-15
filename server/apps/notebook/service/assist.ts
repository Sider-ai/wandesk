import { agentTask } from "../../../shared/apps/agentTask.js";

const buildAssistPrompt = (content) => {
  return [
    "You are Wandesk's notebook assistant.",
    "The user wrote something in the Notebook app. Based on its intent, generate the final note body to save:",
    "- If it is a task or instruction, use shell proactively to gather the needed context, for example query database/aios.db chats/messages for recent conversation history, call /apps/* HTTP endpoints, or read local files. Complete the instruction and output the result as the note body.",
    "- If it is an unfinished draft, polish or expand it so it is clearer and more professional while preserving the original intent.",
    "- If it is already complete, only improve the wording and keep the meaning unchanged.",
    "- Write in English unless the user's note clearly asks for another language.",
    "",
    "When finished, output only the final note body. Do not add a prefix, explanation, or markdown heading.",
    "",
    "[Content written by the user in Notebook]",
    content
  ].join("\n");
};

const assistNotebook = async ({ content, taskTitle }) => {
  if (!content?.trim()) return { error: "Content is required", status: 400 };
  const data = await agentTask({
    app: "notebook",
    title: String(taskTitle || "").trim() || "Note Assist",
    payload: { messages: [{ role: "user", content: buildAssistPrompt(content) }] }
  });
  const result = (data.response || "").trim();
  if (!result) return { error: "Assist result is empty", status: 500 };
  return { result };
};
export {
  assistNotebook
};
