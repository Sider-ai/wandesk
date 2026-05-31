import { createServer } from "http";
import { timingSafeEqual } from "crypto";
import { json } from "../shared/http/json.js";
import { getApiToken } from "../shared/apps/apiToken.js";
import { appLoaders } from "./registry.js";
const portArg = process.argv.find((arg) => arg.startsWith("--port="));
if (portArg && !/^\-\-port=\d+$/.test(portArg)) {
  throw new Error("Invalid port argument");
}
const DEFAULT_APPS_PORT = Number(process.env.AIOS_APPS_PORT || 9503);
const APPS_PORT = portArg ? Number(portArg.slice("--port=".length)) : DEFAULT_APPS_PORT;
const APPS_HOST = "127.0.0.1";
const MAIN_PORT = String(process.env.AIOS_MAIN_PORT || 9502);
const DEV_FRONTEND_ORIGIN = process.env.AIOS_DEV_FRONTEND_ORIGIN || "http://localhost:5173";
const ALLOWED_ORIGINS = new Set([
  `http://127.0.0.1:${MAIN_PORT}`,
  `http://localhost:${MAIN_PORT}`,
  DEV_FRONTEND_ORIGIN,
  "http://tauri.localhost",
  "tauri://localhost"
]);
const moduleCache = /* @__PURE__ */ new Map();
const appModules = [];
const dbInitCache = /* @__PURE__ */ new Set();

const safeEqual = (a, b) => {
  if (!a || !b || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

const bearerToken = (req) => {
  const auth = String(req.headers.authorization || "");
  return auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
};

const internalToken = (req) => {
  return String(req.headers["x-aios-internal-token"] || "").trim() || bearerToken(req);
};

const isAuthorizedAppRequest = (req) => {
  const expected = getApiToken();
  if (!expected) return true;
  return safeEqual(internalToken(req), expected);
};

const setCorsHeaders = (req, res) => {
  const origin = String(req.headers.origin || "");
  res.setHeader("Vary", "Origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-AIOS-Internal-Token");
};

const loadAppModule = async (load) => {
  if (moduleCache.has(load)) return moduleCache.get(load);
  const mod = await load();
  const app = mod?.default;
  if (!app || typeof app !== "object") {
    throw new Error("Invalid app module: missing default export object");
  }
  if (typeof app.name !== "string" || !app.name.trim()) {
    throw new Error("Invalid app module: missing name");
  }
  if (typeof app.match !== "function") {
    throw new Error(`Invalid app module "${app.name}": missing match(path)`);
  }
  if (typeof app.handleApi !== "function") {
    throw new Error(`Invalid app module "${app.name}": missing handleApi(req,res,path)`);
  }
  moduleCache.set(load, app);
  return app;
};
const loadRegisteredApps = async () => {
  for (const load of appLoaders) {
    const app = await loadAppModule(load);
    appModules.push(app);
  }
};
const initDbForApp = async (app) => {
  if (dbInitCache.has(app.name)) return;
  if (typeof app.initDb === "function") {
    await app.initDb();
  }
  dbInitCache.add(app.name);
};
const bootAppRuntimes = async () => {
  for (const app of appModules) {
    await initDbForApp(app);
    if (typeof app.initRuntime === "function") {
      await app.initRuntime();
    }
  }
};
const appsServer = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    setCorsHeaders(req, res);
    if (req.method === "OPTIONS") {
      const origin = String(req.headers.origin || "");
      if (origin && !ALLOWED_ORIGINS.has(origin)) {
        json(res, { success: false, message: "__T_APPS_ORIGIN_NOT_ALLOWED__" }, 403);
        return;
      }
      res.writeHead(204);
      res.end();
      return;
    }
    if (path === "/apps/health") {
      json(res, { success: true });
      return;
    }
    if (!isAuthorizedAppRequest(req)) {
      json(res, { success: false, message: "__T_APPS_UNAUTHENTICATED_REQUEST__" }, 401);
      return;
    }
    const app = appModules.find((item) => item.match(path));
    if (!app) {
      json(res, { success: false, message: "Apps endpoint not found" }, 404);
      return;
    }
    await initDbForApp(app);
    const handled = await app.handleApi(req, res, path);
    if (handled === false) {
      json(res, { success: false, message: "Apps endpoint not found" }, 404);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    if (!res.headersSent) {
      json(res, { success: false, message }, 500);
    } else {
      res.end();
    }
    console.error("[apps]", error);
  }
});
await loadRegisteredApps();
await bootAppRuntimes();
appsServer.listen(APPS_PORT, APPS_HOST, () => {
  console.log(`  > apps: http://${APPS_HOST}:${APPS_PORT}`);
});
