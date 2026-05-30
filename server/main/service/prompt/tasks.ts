import { listRecentTaskSummaryRows } from "../../repository/task/records.js";

const PROMPT_TASKS_TITLE = "Recent App Tasks";
const PROMPT_TASKS_INTRO =
  "Recent AI tasks your apps asked you to run (newest first). This is what has been happening across the system, so you stay in sync with the user's activity.";
const PROMPT_TASKS_UNTITLED = "(untitled task)";

const recentTasks = () => {
  return listRecentTaskSummaryRows(8).map((row) => ({
    app: String(row.app || "").trim(),
    title: String(row.title || "").trim(),
    mode: String(row.mode || "").trim(),
    status: String(row.status || "").trim(),
    at: String(row.finished_at || row.created_at || "").trim()
  }));
};

const tasks = () => {
  const list = recentTasks();
  if (!Array.isArray(list) || list.length === 0) return "";
  const lines = list.map((t, i) => {
    const title = t.title || PROMPT_TASKS_UNTITLED;
    const parts = [`${i + 1}. [${t.app || "?"}] ${title}`];
    if (t.status) parts.push(`status: ${t.status}`);
    if (t.mode) parts.push(`mode: ${t.mode}`);
    if (t.at) parts.push(t.at);
    return parts.join(" | ");
  });
  return `

## ${PROMPT_TASKS_TITLE}
${PROMPT_TASKS_INTRO}
${lines.join("\n")}`;
};

export {
  tasks
};
