import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { db } from "./client.js";

// 单用户:auth 表用 id=1 单行 ((id = 1) CHECK 限制).
// sessions 表存浏览器登录后的会话 id,api_token 单独存在 auth.api_token.
// 表 DDL 在 repository/init.js 的 createTables() 里统一定义.

const hashPassword = (password, saltHex) => {
  const salt = Buffer.from(saltHex, "hex");
  return scryptSync(String(password), salt, 64).toString("hex");
};

const newSalt   = () => randomBytes(16).toString("hex");
const newToken  = () => randomBytes(32).toString("hex");
const newId     = () => randomBytes(32).toString("hex");

const getAuth = () => {
  return db.prepare("SELECT id, password_hash, password_salt, api_token FROM auth WHERE id = 1").get() || null;
};

const isConfigured = () => Boolean(getAuth());

const setupAuth = (password) => {
  if (isConfigured()) {
    throw new Error("auth already configured");
  }
  const salt  = newSalt();
  const hash  = hashPassword(password, salt);
  const token = newToken();
  db.prepare(
    "INSERT INTO auth (id, password_hash, password_salt, api_token) VALUES (1, ?, ?, ?)"
  ).run(hash, salt, token);
  return { token };
};

const verifyPassword = (password) => {
  const row = getAuth();
  if (!row) return false;
  const expected = Buffer.from(row.password_hash, "hex");
  const actual   = Buffer.from(hashPassword(password, row.password_salt), "hex");
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
};

const changePassword = (oldPassword, newPassword) => {
  if (!verifyPassword(oldPassword)) return false;
  const salt = newSalt();
  const hash = hashPassword(newPassword, salt);
  db.prepare(
    "UPDATE auth SET password_hash = ?, password_salt = ?, updated_at = datetime('now') WHERE id = 1"
  ).run(hash, salt);
  return true;
};

const getApiToken = () => {
  const row = getAuth();
  return row ? row.api_token : "";
};

// === Sessions ===

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 天

const createSession = () => {
  const id  = newId();
  const now = Date.now();
  const exp = now + SESSION_TTL_MS;
  db.prepare("INSERT INTO sessions (id, created_at, expires_at) VALUES (?, ?, ?)").run(id, now, exp);
  return { id, expiresAt: exp };
};

const verifySession = (id) => {
  if (!id || typeof id !== "string") return false;
  const row = db.prepare("SELECT expires_at FROM sessions WHERE id = ?").get(id);
  if (!row) return false;
  if (row.expires_at < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
    return false;
  }
  return true;
};

const deleteSession = (id) => {
  if (!id) return;
  db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
};

const verifyApiToken = (token) => {
  if (!token || typeof token !== "string") return false;
  const stored = getApiToken();
  if (!stored || token.length !== stored.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(stored));
};

export {
  isConfigured,
  setupAuth,
  verifyPassword,
  changePassword,
  getApiToken,
  createSession,
  verifySession,
  deleteSession,
  verifyApiToken,
};
