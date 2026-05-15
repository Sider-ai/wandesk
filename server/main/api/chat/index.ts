import { readBody } from "../../../shared/http/readBody.js";
import { json } from "../../../shared/http/json.js";
import { mkdirSync, writeFileSync } from "fs";
import { extname, join, resolve } from "path";
import { hasChat, createChat, setChatPinned } from "../../service/chat/conversations.js";
import { listChats } from "../../service/chat/list.js";
import { getChatMessagesPaged } from "../../service/chat/messages.js";
import { renameChat } from "../../service/chat/rename.js";
import { deleteChat } from "../../service/chat/delete.js";
import { listAllRemarks } from "../../service/chat/remarks.js";
const CHAT_UPLOAD_BASE_DIR = resolve(process.cwd(), "files", "uploads", "chat");
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const UPLOADABLE_EXT = new Set([".txt", ".md", ".json", ".csv", ".log", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".pdf"]);
const safeName = (name = "") => String(name || "file").replace(/[\\/:*?"<>|]/g, "_").replace(/\s+/g, " ").trim().slice(0, 180) || "file";
const handleChatApi = async (req, res, path, url) => {
  if (path === "/api/chat/list" && req.method === "GET") {
    const scene = url.searchParams.get("scene") || null;
    return json(res, listChats(scene));
  }
  if (path === "/api/chat/create" && req.method === "POST") {
    const body = await readBody(req);
    return json(res, createChat(body.title || "新对话", body.scene || "chat", body.meta || null));
  }
  if (path === "/api/chat/attachments/upload" && req.method === "POST") {
    const body = await readBody(req);
    const name = safeName(body.name || `upload-${Date.now()}`);
    const ext = extname(name).toLowerCase();
    if (!UPLOADABLE_EXT.has(ext)) return json(res, { error: `file type not allowed: ${ext || "(none)"}` }, 400);
    let buffer;
    try {
      buffer = Buffer.from(String(body.data || "").replace(/^data:.*;base64,/, ""), "base64");
    } catch {
      return json(res, { error: "invalid base64 data" }, 400);
    }
    if (!buffer.length) return json(res, { error: "empty file data" }, 400);
    if (buffer.length > MAX_UPLOAD_BYTES) return json(res, { error: "file too large (max 10MB)" }, 400);
    mkdirSync(CHAT_UPLOAD_BASE_DIR, { recursive: true });
    const savedName = `${Date.now()}-${name}`;
    const filePath = join(CHAT_UPLOAD_BASE_DIR, savedName);
    writeFileSync(filePath, buffer);
    return json(res, {
      file: {
        type: "file",
        name,
        path: filePath,
        size: buffer.length
      }
    });
  }
  if (path === "/api/chat/messages" && req.method === "GET") {
    const conversationId = url.searchParams.get("conversationId");
    if (!conversationId) return json(res, { error: "Missing conversationId" }, 400);
    if (!hasChat(conversationId)) return json(res, { error: "Conversation not found" }, 404);
    const limit = Number(url.searchParams.get("limit") || 20);
    const offset = Number(url.searchParams.get("offset") || 0);
    return json(res, getChatMessagesPaged(conversationId, limit, offset));
  }
  if (path === "/api/chat/remarks" && req.method === "GET") {
    const conversationId = url.searchParams.get("conversationId");
    if (!conversationId) return json(res, { error: "Missing conversationId" }, 400);
    if (!hasChat(conversationId)) return json(res, { error: "Conversation not found" }, 404);
    return json(res, { items: listAllRemarks(conversationId) });
  }
  if (path === "/api/chat/rename" && req.method === "POST") {
    const body = await readBody(req);
    if (!body.conversationId) return json(res, { error: "Missing conversationId" }, 400);
    if (!body.title) return json(res, { error: "Missing title" }, 400);
    return json(res, renameChat(body.conversationId, body.title));
  }
  if (path === "/api/chat/delete" && req.method === "POST") {
    const body = await readBody(req);
    if (!body.conversationId) return json(res, { error: "Missing conversationId" }, 400);
    return json(res, deleteChat(body.conversationId));
  }
  if (path === "/api/chat/pin" && req.method === "POST") {
    const body = await readBody(req);
    if (!body.conversationId) return json(res, { error: "Missing conversationId" }, 400);
    return json(res, setChatPinned(body.conversationId, body.pinned));
  }
  return json(res, { error: "API endpoint not found" }, 404);
};
export {
  handleChatApi
};
