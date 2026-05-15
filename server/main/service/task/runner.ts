import { randomUUID } from "crypto";
import { broadcast } from "../runtime/ws.js";
import {
  insertTaskRecord,
  updateTaskAborted,
  updateTaskDone,
  updateTaskError
} from "../../repository/task/records.js";
import { saveTaskMessage } from "../../repository/task/messages.js";
import { registerTaskExecution, unregisterTaskExecution } from "./execution.js";

const createTaskRun = async ({
  mode,
  app,
  title = "",
  payload,
  meta = null,
  wait = true,
  execute,
  errorMessage = "Task execution failed"
}) => {
  const conversationId = `task:${randomUUID().slice(0, 8)}`;
  const { taskId } = insertTaskRecord({
    conversationId,
    app,
    title,
    mode,
    payload,
    meta
  });
  broadcast({ type: "tasks_changed" });

  const abortController = new AbortController();
  registerTaskExecution(taskId, abortController);

  const emitMessage = (message, metaValue = null) => {
    if (message) saveTaskMessage(conversationId, message, metaValue);
  };

  const exec = async () => {
    try {
      if (Array.isArray(payload?.messages)) {
        for (const message of payload.messages) emitMessage(message, { phase: "request" });
      }
      const result = await execute({
        conversationId,
        emitMessage,
        signal: abortController.signal
      });
      if (result?.assistantMessage) emitMessage(result.assistantMessage, null);
      const response = result?.response ?? "";
      updateTaskDone({ taskId, response });
      broadcast({ type: "tasks_changed" });
      return response;
    } catch (error) {
      if (error?.name === "AbortError") {
        updateTaskAborted({ taskId });
      } else {
        updateTaskError({ taskId, message: error?.message || errorMessage });
      }
      broadcast({ type: "tasks_changed" });
      if (wait) throw error;
      return null;
    } finally {
      unregisterTaskExecution(taskId);
    }
  };

  if (!wait) {
    exec().catch(() => {});
    return { id: taskId, conversationId, response: null };
  }

  const response = await exec();
  return { id: taskId, conversationId, response };
};

export {
  createTaskRun
};
