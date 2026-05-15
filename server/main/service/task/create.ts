import { getSettings } from "../settings/get.js";
import { createTaskRun } from "./runner.js";
import { executeAgentTask } from "./executors/agent.js";
import { executeInstantTask } from "./executors/instant.js";

const normalizePayload = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("payload is required");
  }
  if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
    throw new Error("payload.messages is required");
  }
  const { apiKey, api_key, apiUrl, provider, signal, ...requestPayload } = payload;
  return requestPayload;
};

const createAgentTask = async ({
  app,
  title = "",
  payload,
  meta = null,
  wait = true
}) => {
  const settings = getSettings();
  const taskPayload = {
    ...normalizePayload(payload),
    model: settings.model
  };
  return await createTaskRun({
    mode: "agent",
    app,
    title,
    payload: taskPayload,
    meta,
    wait,
    errorMessage: "任务执行失败",
    execute: ({ emitMessage, signal }) => executeAgentTask({
      messages: taskPayload.messages,
      settings,
      emitMessage,
      signal
    })
  });
};

const createInstantTask = async ({
  app,
  title = "",
  payload,
  meta = null
}) => {
  const settings = getSettings();
  const taskPayload = {
    ...normalizePayload(payload),
    model: settings.model
  };
  return await createTaskRun({
    mode: "instant",
    app,
    title,
    payload: taskPayload,
    meta,
    errorMessage: "Task execution failed",
    execute: ({ signal }) => executeInstantTask({
      settings,
      signal,
      payload: taskPayload
    })
  });
};

export {
  createAgentTask,
  createInstantTask
};
