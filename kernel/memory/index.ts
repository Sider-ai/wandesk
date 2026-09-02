// Memory — part of the "everything" that "env.AI knows everything" refers to.
//
// Key convention: **applications can never read the raw text**. There's no domain API like
// /api/memory for apps to call — memory is injected into instructions by the kernel only at
// the moment env.AI assembles a request.
// This is where the principle lands: the kernel carries no domain concepts, apps share no
// data with each other, but they all share the same agent that knows everything.
import { all, run } from "../data/db.js";

export type Memory = { id: number; kind: string; text: string; source: string; created_at: string };

export const remember = (text: string, kind = "fact", source = "") => {
  const clean = String(text || "").trim();
  if (!clean) return;
  run("INSERT INTO memory (kind, text, source) VALUES (?, ?, ?)", kind, clean.slice(0, 2000), source);
};

export const forget = (id: number) => run("DELETE FROM memory WHERE id = ?", id);

export const listMemory = (): Memory[] => all<Memory>("SELECT * FROM memory ORDER BY id DESC");

/** The block injected into the model's prompt. Capped, so no matter how much memory piles up
 *  it can never blow out the context. */
export const memoryBlock = (limit = 40): string => {
  const rows = all<Memory>("SELECT kind, text FROM memory ORDER BY id DESC LIMIT ?", limit);
  if (!rows.length) return "";
  const lines = rows.map((r) => `- [${r.kind}] ${r.text}`).join("\n");
  return `\n\n# About this user (injected by the kernel, from long-term memory)\n${lines}`;
};
