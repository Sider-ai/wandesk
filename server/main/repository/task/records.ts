import { db } from "../client.js";

const insertTaskRecord = ({
  conversationId,
  app,
  title,
  mode,
  payload,
  meta = null
}) => {
  const row = db.prepare(
    "INSERT INTO tasks (conversation_id, app, title, mode, payload, meta, status) VALUES (?, ?, ?, ?, ?, ?, 'pending') RETURNING id"
  ).get(
    conversationId,
    app,
    String(title || ""),
    mode,
    JSON.stringify(payload || {}),
    meta ? JSON.stringify(meta) : null
  );
  return { taskId: row.id };
};

const listTasksByLimit = (limit) => {
  return db.prepare("SELECT * FROM tasks ORDER BY id DESC LIMIT ?").all(limit);
};

const getTaskById = (id) => {
  return db.prepare("SELECT * FROM tasks WHERE id = ? LIMIT 1").get(id) || null;
};

const getTaskStatusById = (id) => {
  return db.prepare("SELECT id, status FROM tasks WHERE id = ? LIMIT 1").get(id) || null;
};

const updateTaskDone = ({ taskId, response }) => {
  db.prepare(
    "UPDATE tasks SET response = ?, status = 'done', finished_at = datetime('now') WHERE id = ?"
  ).run(response, taskId);
};

const updateTaskAborted = ({ taskId }) => {
  db.prepare(
    "UPDATE tasks SET error = '用户终止任务', status = 'aborted', finished_at = datetime('now') WHERE id = ?"
  ).run(taskId);
};

const updateTaskError = ({ taskId, message }) => {
  db.prepare(
    "UPDATE tasks SET error = ?, status = 'error', finished_at = datetime('now') WHERE id = ?"
  ).run(message, taskId);
};

export {
  getTaskById,
  getTaskStatusById,
  insertTaskRecord,
  listTasksByLimit,
  updateTaskAborted,
  updateTaskDone,
  updateTaskError
};
