// Activity log: any app calling env.AI must include a summary, logged here — so the user can see which app is burning tokens.
import { all, run, one } from "./db.js";

export type Activity = { id: number; app_id: string; summary: string; status: string; detail: string; created_at: string };

export const startActivity = (appId: string, summary: string): number => {
  const r = run("INSERT INTO activity (app_id, summary) VALUES (?, ?)", appId, summary.slice(0, 200));
  return Number(r.lastInsertRowid);
};

export const finishActivity = (id: number, status: "done" | "error", detail = "") =>
  run("UPDATE activity SET status = ?, detail = ? WHERE id = ?", status, detail.slice(0, 500), id);

export const listActivity = (limit = 50): Activity[] =>
  all<Activity>("SELECT * FROM activity ORDER BY id DESC LIMIT ?", Math.min(200, limit));

export const runningCount = () => one<{ n: number }>("SELECT COUNT(*) AS n FROM activity WHERE status = 'running'")?.n ?? 0;
