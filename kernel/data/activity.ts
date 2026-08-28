// 活动流水:应用调 env.AI 必须带 summary,落这里 —— 用户能看见哪个应用在烧 token。
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
