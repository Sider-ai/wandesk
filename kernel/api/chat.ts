// Conversations: data belonging to the product itself, but **no API surface is exposed to apps**.
//
// These endpoints are for the shell's own use only (plus records produced indirectly by the chat app
// via env.AI). An app that wants AI calls env.AI — it never gets hold of anyone else's raw conversation
// content — see the "data ownership" section of CONTRACT.md.
import type { IncomingMessage, ServerResponse } from "http";
import { json, readJson } from "./http.js";
import {
  listConversations, createConversation, renameConversation,
  deleteConversation, listItems,
} from "../data/conversations.js";
import { listActivity } from "../data/activity.js";
import { listMemory, remember, forget } from "../memory/index.js";

export const handleChatApi = async (req: IncomingMessage, res: ServerResponse, rest: string): Promise<boolean> => {
  const url = new URL(req.url || "/", "http://x");

  if (rest === "/conversations") {
    if (req.method === "POST") {
      const body = await readJson(req);
      return json(res, 200, { conversation: createConversation(String(body.title || "New conversation")) });
    }
    return json(res, 200, { conversations: listConversations() });
  }

  if (rest === "/messages") {
    return json(res, 200, { items: listItems(url.searchParams.get("id") || "") });
  }

  if (rest === "/rename" && req.method === "POST") {
    const body = await readJson(req);
    renameConversation(String(body.id || ""), String(body.title || ""));
    return json(res, 200, { ok: true });
  }

  if (rest === "/delete" && req.method === "POST") {
    const body = await readJson(req);
    deleteConversation(String(body.id || ""));
    return json(res, 200, { ok: true });
  }

  if (rest === "/activity") return json(res, 200, { activity: listActivity(Number(url.searchParams.get("limit")) || 50) });

  if (rest === "/memory") {
    if (req.method === "POST") {
      const body = await readJson(req);
      if (body.forget) forget(Number(body.forget));
      else remember(String(body.text || ""), String(body.kind || "fact"), "shell");
      return json(res, 200, { ok: true });
    }
    return json(res, 200, { memory: listMemory() });
  }

  return false;
};
