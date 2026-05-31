import { readBody } from "../../../shared/http/readBody.js";
import { json } from "../../../shared/http/json.js";
import { getStatus } from "../service/status.js";
import { listCron, addCron, runCron, deleteCron } from "../service/cron.js";
import { chat } from "../service/chat.js";

const handleOpenclawApi = async (req, res, path) => {
  if (path === "/apps/openclaw/status" && req.method === "GET") {
    return json(res, await getStatus());
  }

  if (path === "/apps/openclaw/cron/list" && req.method === "GET") {
    const data = await listCron();
    if (data.status) return json(res, { success: false, message: data.message }, data.status);
    return json(res, data);
  }

  if (path === "/apps/openclaw/cron/add" && req.method === "POST") {
    const body = await readBody(req);
    const data = await addCron(body);
    if (data.status) return json(res, { success: false, message: data.message }, data.status);
    return json(res, data);
  }

  if (path === "/apps/openclaw/cron/run" && req.method === "POST") {
    const body = await readBody(req);
    const data = await runCron(body?.jobId);
    if (data.status) return json(res, { success: false, message: data.message }, data.status);
    return json(res, data);
  }

  if (path === "/apps/openclaw/cron/delete" && req.method === "POST") {
    const body = await readBody(req);
    const data = await deleteCron(body?.jobId);
    if (data.status) return json(res, { success: false, message: data.message }, data.status);
    return json(res, data);
  }

  if (path === "/apps/openclaw/chat" && req.method === "POST") {
    const body = await readBody(req);
    const data = await chat(body);
    if (data.status) return json(res, { success: false, message: data.message }, data.status);
    return json(res, data);
  }

  return false;
};

export { handleOpenclawApi };
