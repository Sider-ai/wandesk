import { verifySession, verifyApiToken, isConfigured } from "../../repository/auth.js";
import { parseCookieHeader, serializeCookie } from "../../../shared/http/cookie.js";

const SESSION_COOKIE = "AIOS_sess";

const buildSessionCookie = (sid, { maxAgeSeconds = 30 * 24 * 60 * 60 }: any = {}) => {
  // SameSite=Lax 比 Strict 宽松一档,允许跨站点导航 (例如从外部链接回到 AIOS).
  // Strict 会导致刷新页面后第一次请求丢 cookie;Lax 是 Google/GitHub 默认.
  // Secure 不强制 —— 本地 http://localhost 也要能用,ngrok 走 HTTPS 自动安全.
  return serializeCookie(SESSION_COOKIE, sid, {
    maxAge: maxAgeSeconds,
    sameSite: "Lax",
  });
};

const buildClearCookie = () => {
  return serializeCookie(SESSION_COOKIE, "", {
    maxAge: 0,
    sameSite: "Lax",
  });
};

// === 凭证识别 ===

const extractBearer = (req) => {
  const auth = String(req.headers?.authorization || "");
  if (!auth.startsWith("Bearer ")) return "";
  return auth.slice(7).trim();
};

const extractSessionId = (req) => {
  const cookies = parseCookieHeader(req.headers?.cookie || "");
  return cookies[SESSION_COOKIE] || "";
};

// WebSocket upgrade 没有 Authorization 头自由设的能力,允许 ?token= 兜底
const extractTokenFromUrl = (req) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    return url.searchParams.get("token") || "";
  } catch {
    return "";
  }
};

const isAuthenticated = (req, { allowQueryToken = false }: any = {}) => {
  // 未配置密码前所有请求都视为未鉴权 (除了允许的 setup 路径,由调用方决定)
  if (!isConfigured()) return false;

  const token = extractBearer(req) || (allowQueryToken ? extractTokenFromUrl(req) : "");
  if (token && verifyApiToken(token)) return true;

  const sid = extractSessionId(req);
  if (sid && verifySession(sid)) return true;

  return false;
};

// === 公开路径白名单 ===
// 这些 API 在未鉴权状态下也得能通,否则前端连登录页都进不去.
const PUBLIC_API_PATHS = new Set([
  "/api/auth/state",
  "/api/auth/setup",
  "/api/auth/login",
  "/api/settings/setup",
  "/api/health",
]);

// 静态资源:整个 SPA 包括登录页都是 SPA 自身,放行无密资源.
const isStaticAssetPath = (path) => {
  // /assets/*  /favicon.ico  /index.html  /
  if (path === "/" || path === "/index.html" || path === "/favicon.ico") return true;
  if (path.startsWith("/assets/")) return true;
  // 字体 / 图片 等其他静态资源 (按扩展名识别)
  const m = /\.(js|css|map|woff2?|ttf|otf|eot|svg|png|jpe?g|gif|webp|ico)$/i.exec(path);
  return Boolean(m);
};

const isPublicApiPath = (path) => PUBLIC_API_PATHS.has(path);

export {
  isAuthenticated,
  isConfigured,
  buildSessionCookie,
  buildClearCookie,
  isPublicApiPath,
  isStaticAssetPath,
  extractTokenFromUrl,
};
