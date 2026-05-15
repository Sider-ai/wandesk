import { json } from "../../../shared/http/json.js";
import { readBody } from "../../../shared/http/readBody.js";
import {
  isConfigured,
  setupAuth,
  verifyPassword,
  changePassword,
  createSession,
  deleteSession,
  getApiToken,
} from "../../repository/auth.js";
import {
  isAuthenticated,
  buildSessionCookie,
  buildClearCookie,
} from "../../service/auth/session.js";
import { saveSetting } from "../../repository/settings/save.js";

// 失败计数 —— 内存级,不持久化,服务重启清零.防止暴破而已.
const failedAttempts = new Map(); // ip -> { count, firstAt }
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_WINDOW_MS = 60_000;
const LOCKOUT_DURATION_MS = 60_000;

const peerIp = (req) => {
  return req.socket?.remoteAddress || req.connection?.remoteAddress || "unknown";
};

const isLocked = (ip) => {
  const rec = failedAttempts.get(ip);
  if (!rec) return false;
  if (Date.now() - rec.firstAt > LOCKOUT_WINDOW_MS + LOCKOUT_DURATION_MS) {
    failedAttempts.delete(ip);
    return false;
  }
  return rec.count >= LOCKOUT_THRESHOLD;
};

const noteFailure = (ip) => {
  const now = Date.now();
  const rec = failedAttempts.get(ip);
  if (!rec || now - rec.firstAt > LOCKOUT_WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, firstAt: now });
  } else {
    rec.count += 1;
  }
};

const clearFailure = (ip) => failedAttempts.delete(ip);

// 启动时把 token 推到环境变量,agent runtime 通过 $AIOS_API_TOKEN 使用.
const exposeTokenToEnv = () => {
  const t = getApiToken();
  if (t) process.env.AIOS_API_TOKEN = t;
};

// === Endpoints ===

const handleAuthApi = async (req, res, path) => {
  if (path === "/api/auth/state" && req.method === "GET") {
    return json(res, {
      configured: isConfigured(),
      authenticated: isAuthenticated(req),
    });
  }

  if (path === "/api/auth/setup" && req.method === "POST") {
    if (isConfigured()) {
      return json(res, { success: false, message: "已经设置过密码,无法重复设置" }, 409);
    }
    const body = await readBody(req);
    const password = String(body?.password || "");
    const language = String(body?.language || "").trim() === "en" ? "en" : "zh";
    if (password.length < 8) {
      return json(res, { success: false, message: "密码至少 8 位" }, 400);
    }
    setupAuth(password);
    saveSetting("language", language);
    exposeTokenToEnv();
    const session = createSession();
    res.setHeader("Set-Cookie", buildSessionCookie(session.id));
    return json(res, { success: true });
  }

  if (path === "/api/auth/login" && req.method === "POST") {
    const ip = peerIp(req);
    if (isLocked(ip)) {
      return json(res, {
        success: false,
        message: "登录尝试过多,请稍后再试",
        locked: true,
      }, 429);
    }
    if (!isConfigured()) {
      return json(res, { success: false, message: "尚未设置密码", needsSetup: true }, 409);
    }
    const body = await readBody(req);
    const password = String(body?.password || "");
    if (!verifyPassword(password)) {
      noteFailure(ip);
      return json(res, { success: false, message: "密码错误" }, 401);
    }
    clearFailure(ip);
    exposeTokenToEnv();
    const session = createSession();
    res.setHeader("Set-Cookie", buildSessionCookie(session.id));
    return json(res, { success: true });
  }

  if (path === "/api/auth/logout" && req.method === "POST") {
    const cookies = String(req.headers.cookie || "");
    const m = /(?:^|;\s*)AIOS_sess=([^;]+)/.exec(cookies);
    if (m) deleteSession(decodeURIComponent(m[1]));
    res.setHeader("Set-Cookie", buildClearCookie());
    return json(res, { success: true });
  }

  if (path === "/api/auth/change-password" && req.method === "POST") {
    if (!isAuthenticated(req)) {
      return json(res, { success: false, message: "未鉴权" }, 401);
    }
    const body = await readBody(req);
    const oldPassword = String(body?.oldPassword || "");
    const newPassword = String(body?.newPassword || "");
    if (newPassword.length < 8) {
      return json(res, { success: false, message: "新密码至少 8 位" }, 400);
    }
    if (!changePassword(oldPassword, newPassword)) {
      return json(res, { success: false, message: "原密码错误" }, 401);
    }
    return json(res, { success: true });
  }

  return json(res, { success: false, message: "API endpoint not found" }, 404);
};

export { handleAuthApi, exposeTokenToEnv };
