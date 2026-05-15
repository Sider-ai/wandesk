import { readBody } from "../../../shared/http/readBody.js";
import { json } from "../../../shared/http/json.js";
import { listTaskRecords } from "../../service/task/list.js";
import { getTaskDetail } from "../../service/task/detail.js";
import { listTaskMessages } from "../../service/task/messages.js";
import { stopTask } from "../../service/task/stop.js";
import { createAgentTask, createInstantTask } from "../../service/task/create.js";
const handleTaskCreateInstantApi = async (req, res, path) => {
  if (path !== "/api/task/create/instant" || req.method !== "POST") return false;
  try {
    const {
      app,
      title = "",
      payload,
      meta = null,
    } = await readBody(req);
    if (!String(app || "").trim()) return json(res, { success: false, message: "app is required" }, 400);
    if (!payload || typeof payload !== "object" || !Array.isArray(payload.messages) || payload.messages.length === 0) {
      return json(res, { success: false, message: "payload.messages is required" }, 400);
    }
    const result = await createInstantTask({
      app: String(app || "").trim(),
      title: String(title || "").trim(),
      meta,
      payload
    });
    return json(res, result);
  } catch (e) {
    return json(res, { success: false, message: e?.message || "Task execution failed" }, 500);
  }
};
const handleTaskCreateAgentApi = async (req, res, path) => {
  if (path !== "/api/task/create/agent" || req.method !== "POST") return false;
  try {
    const { app, title = "", payload, meta = null, wait = true } = await readBody(req);
    if (!String(app || "").trim()) return json(res, { success: false, message: "app is required" }, 400);
    if (!payload || typeof payload !== "object" || !Array.isArray(payload.messages) || payload.messages.length === 0) {
      return json(res, { success: false, message: "payload.messages is required" }, 400);
    }
    const result = await createAgentTask({
      app: String(app || "").trim(),
      title: String(title || "").trim(),
      payload,
      meta,
      wait: Boolean(wait)
    });
    return json(res, result);
  } catch (e) {
    return json(res, { success: false, message: e?.message || "Task execution failed" }, 500);
  }
};
const handleTaskApi = async (req, res, path, url) => {
  if (path === "/api/task" && req.method === "GET") {
    const limit = Number(url.searchParams.get("limit") || 20);
    return json(res, listTaskRecords({ limit }));
  }
  if (path === "/api/task/detail" && req.method === "GET") {
    const id = Number(url.searchParams.get("id") || 0);
    if (!Number.isInteger(id) || id <= 0) return json(res, { success: false, message: "Invalid id" }, 400);
    const task = getTaskDetail({ id });
    if (!task) return json(res, { success: false, message: "Task not found" }, 404);
    return json(res, { success: true, task });
  }
  if (path === "/api/task/messages" && req.method === "GET") {
    const id = Number(url.searchParams.get("id") || 0);
    if (!Number.isInteger(id) || id <= 0) return json(res, { success: false, message: "Invalid id" }, 400);
    const task = getTaskDetail({ id });
    if (!task) return json(res, { success: false, message: "Task not found" }, 404);
    return json(res, { success: true, messages: listTaskMessages({ conversationId: task.conversation_id || "" }) });
  }
  if (path.startsWith("/api/task/create")) {
    const handled = await handleTaskCreateInstantApi(req, res, path);
    if (handled !== false) return true;
    const handled2 = await handleTaskCreateAgentApi(req, res, path);
    if (handled2 !== false) return true;
  }
  if (path === "/api/task/stop" && req.method === "POST") {
    const body = await readBody(req);
    const id = Number(body.id || 0);
    if (!Number.isInteger(id) || id <= 0) return json(res, { success: false, message: "Invalid id" }, 400);
    const result = stopTask({ id });
    if (result?.status) return json(res, { success: false, message: result.message }, result.status);
    return json(res, result);
  }
  json(res, { error: "not found" }, 404);
};
export {
  handleTaskApi
};
