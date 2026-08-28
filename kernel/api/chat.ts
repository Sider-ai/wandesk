// 会话:产品本体的数据,但**没有域 API 给应用**。
//
// 这些端点只给壳自己用(以及 chat 应用经 env.AI 间接产生的记录)。
// 应用要用 AI 就调 env.AI,拿不到别人的会话原文 —— 见 APP.md「数据产权」。
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
      return json(res, 200, { conversation: createConversation(String(body.title || "新对话")) });
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
      else remember(String(body.text || ""), String(body.kind || "fact"), "壳");
      return json(res, 200, { ok: true });
    }
    return json(res, 200, { memory: listMemory() });
  }

  return false;
};
