// 记忆 —— 「env.AI 知道一切」的那个「一切」里的一部分。
//
// 关键约定:**应用读不到原文**。没有 /api/memory 这种域 API 给应用调,
// 记忆只在 env.AI 组装请求的那一刻由内核注入 instructions。
// 这是「内核不长领域概念、应用之间不共享数据、但共享同一个知道一切的 agent」的落点。
import { all, run } from "../data/db.js";

export type Memory = { id: number; kind: string; text: string; source: string; created_at: string };

export const remember = (text: string, kind = "fact", source = "") => {
  const clean = String(text || "").trim();
  if (!clean) return;
  run("INSERT INTO memory (kind, text, source) VALUES (?, ?, ?)", kind, clean.slice(0, 2000), source);
};

export const forget = (id: number) => run("DELETE FROM memory WHERE id = ?", id);

export const listMemory = (): Memory[] => all<Memory>("SELECT * FROM memory ORDER BY id DESC");

/** 注入给模型的那一段。给个上限,记忆再多也不能把上下文挤爆。 */
export const memoryBlock = (limit = 40): string => {
  const rows = all<Memory>("SELECT kind, text FROM memory ORDER BY id DESC LIMIT ?", limit);
  if (!rows.length) return "";
  const lines = rows.map((r) => `- [${r.kind}] ${r.text}`).join("\n");
  return `\n\n# 关于这位用户(内核注入,来自长期记忆)\n${lines}`;
};
