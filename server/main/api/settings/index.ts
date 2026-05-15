import { readBody } from "../../../shared/http/readBody.js";
import { json } from "../../../shared/http/json.js";
import { DEFAULT_SYSTEM_PROMPT } from "../../service/prompt/default.js";
import { getSettings, getSetupStatus } from "../../service/settings/get.js";
import { updateSettings } from "../../service/settings/update.js";

const handleSettingsApi = async (req, res, path) => {
  if (path === "/api/settings/setup" && req.method === "GET") {
    return json(res, { success: true, ...getSetupStatus() });
  }
  if (path === "/api/settings/setup" && req.method === "POST") {
    const body = await readBody(req);
    updateSettings({ welcomeSkipped: body?.welcomeSkipped !== false });
    return json(res, { success: true, ...getSetupStatus() });
  }

  if (path === "/api/settings" && req.method === "GET") {
    return json(res, getSettings());
  }
  if (path === "/api/settings" && req.method === "POST") {
    const body = await readBody(req);
    updateSettings(body);
    return json(res, getSettings());
  }

  if (path === "/api/settings/prompt" && req.method === "GET") {
    const content = String(getSettings().systemPrompt || "").trim() || DEFAULT_SYSTEM_PROMPT;
    return json(res, { success: true, content });
  }
  if (path === "/api/settings/prompt" && req.method === "POST") {
    const body = await readBody(req);
    const content = String(body.content || "").trim();
    if (!content) return json(res, { success: false, message: "content is required" }, 400);
    updateSettings({ systemPrompt: content });
    return json(res, { success: true });
  }

  return json(res, { error: "API endpoint not found" }, 404);
};
export {
  handleSettingsApi
};
