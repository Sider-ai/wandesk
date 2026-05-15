import { readBody } from "../../../shared/http/readBody.js";
import { json } from "../../../shared/http/json.js";
import { requestReload, runReload } from "../../service/runtime/reload.js";
import { prepareLanguage, restartAfterLanguageApply } from "../../service/runtime/language.js";
import { runReloadTest } from "../../service/runtime/test.js";
import { shell } from "../../ai/functions.js";

const logReloadRequest = (req, body, stage, extra: any = {}) => {
  console.log("[reload.request]", JSON.stringify({
    stage,
    body,
    user: null,
    remoteAddress: req.socket?.remoteAddress || "",
    forwardedFor: String(req.headers["x-forwarded-for"] || ""),
    referer: String(req.headers.referer || ""),
    userAgent: String(req.headers["user-agent"] || ""),
    ...extra
  }));
};

const isLocalRequest = (req) => {
  const address = String(req.socket?.remoteAddress || "").trim();
  return (
    address === "127.0.0.1" ||
    address === "::1" ||
    address === "::ffff:127.0.0.1" ||
    address === ""
  );
};

const matches = (path, suffix) => path === `/api/runtime${suffix}`;

const handleRuntimeApi = async (req, res, path) => {
  if (matches(path, "/debug/exec") && req.method === "POST") {
    if (!isLocalRequest(req)) {
      return json(res, { success: false, message: "Debug API only allows local requests" }, 403);
    }
    const body = await readBody(req);
    const command = String(body.command || "").trim();
    if (!command) {
      return json(res, { success: false, message: "Missing command" }, 400);
    }
    const output = await shell({
      command,
      cwd: body.cwd || "",
      reason: body.reason || "Debug API command"
    });
    return json(res, {
      success: true,
      cwd: String(body.cwd || "").trim() || process.cwd(),
      output
    });
  }
  if (matches(path, "/reload/request") && req.method === "POST") {
    const body = await readBody(req);
    const build = body.build ?? false;
    const restartApps = body.restartApps === true || body.restart === "apps";
    const restartServer = body.restartServer === true;
    logReloadRequest(req, body, "received", { build, restartApps, restartServer });
    requestReload({
      build,
      restartApps,
      restartServer,
      message: body.message || ""
    });
    return json(res, { success: true, tested: false });
  }
  if (matches(path, "/language/apply") && req.method === "POST") {
    const body = await readBody(req);
    const language = String(body.language || "").trim();
    if (language !== "zh" && language !== "en") {
      return json(res, { success: false, message: "Unsupported language" }, 400);
    }
    try {
      prepareLanguage(language);
      json(res, { success: true });
      setTimeout(() => {
        restartAfterLanguageApply().catch((error) => {
          console.error("[language.apply]", error);
        });
      }, 100);
    } catch (e) {
      return json(res, { success: false, message: e instanceof Error ? e.message : "Language apply failed" }, 500);
    }
    return;
  }
  if (matches(path, "/reload/test") && req.method === "POST") {
    const body = await readBody(req);
    const build = body.build === true;
    const restartApps = body.restartApps === true || body.restart === "apps";
    const restartServer = body.restartServer === true;
    try {
      await runReloadTest(build, restartApps, restartServer);
      return json(res, { success: true });
    } catch (e) {
      return json(res, { success: false, message: e instanceof Error ? e.message : "System preflight check failed" }, 500);
    }
  }
  if (matches(path, "/reload") && req.method === "POST") {
    const body = await readBody(req);
    const build = body.build === true;
    const restartApps = body.restartApps === true || body.restart === "apps";
    const restartServer = body.restartServer === true;
    try {
      await runReload(build, restartApps, restartServer, { defer: restartApps || restartServer, delayMs: 300 });
      json(res, { success: true });
    } catch (e) {
      json(res, { success: false, message: e instanceof Error ? e.message : "System reload failed" }, 500);
    }
    return;
  }
  json(res, { error: "API endpoint not found" }, 404);
};
export {
  handleRuntimeApi
};
