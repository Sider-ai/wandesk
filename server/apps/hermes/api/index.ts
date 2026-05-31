import { readBody } from "../../../shared/http/readBody.js";
import { json } from "../../../shared/http/json.js";
import { getStatus } from "../service/status.js";
import { listMessages, listSessions } from "../service/sessions.js";
import { listRoutines } from "../service/routines.js";
import { chat } from "../service/chat.js";
import { startDashboard } from "../service/dashboard.js";

const handleHermesApi = async (req, res, path) => {
  if (path === "/apps/hermes/status" && req.method === "GET") {
    return json(res, await getStatus());
  }

  if (path === "/apps/hermes/sessions" && req.method === "GET") {
    const url = new URL(req.url || "", "http://localhost");
    const data = await listSessions(Number(url.searchParams.get("limit") || 20));
    if ((data as any).status) return json(res, { success: false, message: (data as any).message }, (data as any).status);
    return json(res, data);
  }

  if (path === "/apps/hermes/messages" && req.method === "GET") {
    const url = new URL(req.url || "", "http://localhost");
    const data = await listMessages(url.searchParams.get("sessionId") || "", Number(url.searchParams.get("limit") || 160));
    if (data.status) return json(res, { success: false, message: data.message }, data.status);
    return json(res, data);
  }

  if (path === "/apps/hermes/routines" && req.method === "GET") {
    const data = await listRoutines();
    if (data.status) return json(res, { success: false, message: data.message }, data.status);
    return json(res, data);
  }

  if (path === "/apps/hermes/chat" && req.method === "POST") {
    const body = await readBody(req);
    const data = await chat(body);
    if (data.status) return json(res, { success: false, message: data.message }, data.status);
    return json(res, data);
  }

  if (path === "/apps/hermes/dashboard/start" && req.method === "POST") {
    return json(res, await startDashboard());
  }

  return false;
};

export { handleHermesApi };
