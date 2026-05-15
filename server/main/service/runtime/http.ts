import { createServer } from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { join, extname } from "path";
import { handleApiRequest } from "../../api/index.js";
import { json } from "../../../shared/http/json.js";
import { isAuthenticated, isConfigured, isPublicApiPath } from "../auth/session.js";
const ROOT_DIR = process.cwd();
const PUBLIC_DIR = join(ROOT_DIR, "gui", "dist");
const DEV_FRONTEND_ORIGIN = process.env.AIOS_DEV_FRONTEND === "1"
  ? (process.env.AIOS_DEV_FRONTEND_ORIGIN || "http://localhost:5173")
  : "";
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".ts": "application/javascript",
  ".css": "text/css",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};
const APPS_PORT = Number(process.env.AIOS_APPS_PORT || 9503);
const readRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
};
const proxyAppsRequest = async (req, res, url) => {
  const target = `http://127.0.0.1:${APPS_PORT}${url.pathname}${url.search}`;
  const headers: Record<string, any> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) headers[key] = value.join(", ");
    else if (typeof value === "string") headers[key] = value;
  }
  delete headers.host;
  delete headers.connection;
  delete headers.upgrade;
  delete headers["proxy-connection"];
  delete headers["keep-alive"];
  delete headers["transfer-encoding"];
  delete headers.te;
  delete headers.trailer;
  const method = req.method || "GET";
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await readRawBody(req) : void 0;
  let upstream;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body
    });
  } catch (error) {
    const code = String(error?.code || error?.cause?.code || "").trim();
    const detail = String(error?.cause?.message || error?.message || "unknown fetch error").trim();
    const summary = `[apps-proxy] ${method} ${url.pathname}${url.search} -> ${target} failed` + (code ? ` (${code})` : "") + `: ${detail}`;
    const wrapped: any = new Error(summary);
    wrapped.code = code || "APPS_PROXY_FETCH_FAILED";
    wrapped.target = target;
    wrapped.method = method;
    wrapped.path = `${url.pathname}${url.search}`;
    wrapped.detail = detail;
    throw wrapped;
  }
  const buf = Buffer.from(await upstream.arrayBuffer());
  const outHeaders: Record<string, any> = {};
  upstream.headers.forEach((v, k) => {
    if (k.toLowerCase() === "content-encoding") return;
    outHeaders[k] = v;
  });
  res.writeHead(upstream.status, outHeaders);
  res.end(buf);
};

const proxyDevFrontendRequest = async (req, res, url) => {
  const targetUrl = new URL(`${url.pathname}${url.search}`, DEV_FRONTEND_ORIGIN);
  const headers: Record<string, any> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) headers[key] = value.join(", ");
    else if (typeof value === "string") headers[key] = value;
  }
  delete headers.host;
  delete headers.connection;
  delete headers.upgrade;
  delete headers["proxy-connection"];
  delete headers["keep-alive"];
  delete headers["transfer-encoding"];
  delete headers.te;
  delete headers.trailer;

  const method = req.method || "GET";
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await readRawBody(req) : void 0;
  const upstream = await fetch(targetUrl, { method, headers, body });
  const buf = Buffer.from(await upstream.arrayBuffer());
  const outHeaders: Record<string, any> = {};
  upstream.headers.forEach((v, k) => {
    if (k.toLowerCase() === "content-encoding") return;
    outHeaders[k] = v;
  });
  res.writeHead(upstream.status, outHeaders);
  res.end(buf);
};
const httpServer = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // === 鉴权门 ===
  // 静态资源 + 公开 API (/api/auth/state, /api/auth/setup, /api/auth/login,
  // /api/health) 直接放行;其余一律要求 Bearer token (AI/curl) 或 cookie session.
  // 未鉴权统一返回 401 JSON,前端拦截 401 后跳 /login.
  const path = url.pathname;
  const isApi = path.startsWith("/api/");
  const isApps = path.startsWith("/apps/");
  const isFiles = path.startsWith("/files/");
  const needsAuth = isConfigured() && ((isApi && !isPublicApiPath(path)) || isApps || isFiles);
  if (needsAuth && !isAuthenticated(req)) {
    json(res, { success: false, message: "未鉴权", code: "UNAUTHENTICATED" }, 401);
    return;
  }

  if (url.pathname.startsWith("/files/")) {
    const filePath2 = join(ROOT_DIR, url.pathname);
    if (existsSync(filePath2) && statSync(filePath2).isFile()) {
      const fileName = url.pathname.split("/").pop() || "file";
      const ext = extname(fileName).toLowerCase();
      res.writeHead(200, {
        "Content-Type": MIME[ext] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`
      });
      res.end(readFileSync(filePath2));
      return;
    }
  }
  if (url.pathname.startsWith("/apps/")) {
    try {
      await proxyAppsRequest(req, res, url);
    } catch (error) {
      const code = String(error?.code || "APPS_PROXY_ERROR").trim();
      const detail = String(error?.detail || error?.message || "unknown error").trim();
      const target = String(error?.target || `http://127.0.0.1:${APPS_PORT}`).trim();
      const method = String(error?.method || req.method || "GET").trim();
      const path = String(error?.path || `${url.pathname}${url.search}`).trim();
      console.error("[apps-proxy]", { code, method, path, target, detail });
      res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({
        success: false,
        message: `Apps service unavailable: ${method} ${path} -> ${target} (${code}) ${detail}`,
        code,
        method,
        path,
        target,
        detail
      }));
    }
    return;
  }
  if (url.pathname.startsWith("/api/")) {
    await handleApiRequest(req, res, url);
    return;
  }
  if (DEV_FRONTEND_ORIGIN) {
    try {
      await proxyDevFrontendRequest(req, res, url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "dev frontend unavailable";
      console.error("[frontend-proxy]", message);
      res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`Dev frontend unavailable: ${message}`);
    }
    return;
  }
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = join(PUBLIC_DIR, pathname);
  if (existsSync(filePath) && statSync(filePath).isFile()) {
    const ext = pathname.slice(pathname.lastIndexOf("."));
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(readFileSync(filePath));
    return;
  }
  const indexPath = join(PUBLIC_DIR, "index.html");
  if (existsSync(indexPath)) {
    res.writeHead(200, { "Content-Type": MIME[".html"] });
    res.end(readFileSync(indexPath));
    return;
  }
  res.writeHead(404);
  res.end("Not Found");
});
export {
  httpServer
};
