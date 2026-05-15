import { db } from "./client.js";
const recordDecision = ({ summary, taskId = 0, ok = true, error = "" }) => {
  db.prepare(`
    INSERT INTO cryptobot_decisions (summary, task_id, ok, error, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `).run(String(summary || ""), Number(taskId || 0), ok ? 1 : 0, String(error || ""));
};
const listDecisions = (limit = 50) => {
  const size = Math.min(200, Math.max(1, Number(limit) || 50));
  return db.prepare(`
    SELECT id, summary, task_id, ok, error, created_at
    FROM cryptobot_decisions
    ORDER BY id DESC
    LIMIT ?
  `).all(size);
};
const recentDecisions = (limit = 10) => {
  return db.prepare("SELECT * FROM cryptobot_decisions ORDER BY id DESC LIMIT ?").all(limit).reverse();
};
export {
  listDecisions,
  recentDecisions,
  recordDecision
};
