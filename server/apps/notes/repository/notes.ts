import { db } from "./client.js";

const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");
const SELECT = "id, title, body, pinned, created_at, updated_at";

const getNote = (id) => db.prepare(`SELECT ${SELECT} FROM apps_notes WHERE id = ?`).get(id);

const listNotes = () =>
  db.prepare(
    `SELECT ${SELECT} FROM apps_notes ORDER BY pinned DESC, updated_at DESC, id DESC`
  ).all();

const saveNote = (input) => {
  const title = String(input.title || "").slice(0, 200);
  const body = String(input.body || "");
  const pinned = input.pinned ? 1 : 0;
  const ts = now();
  if (input.id) {
    db.prepare(
      "UPDATE apps_notes SET title = ?, body = ?, pinned = ?, updated_at = ? WHERE id = ?"
    ).run(title, body, pinned, ts, input.id);
    return getNote(input.id);
  }
  if (!title.trim() && !body.trim()) throw new Error("note is empty");
  const info = db.prepare(
    "INSERT INTO apps_notes (title, body, pinned, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
  ).run(title, body, pinned, ts, ts);
  return getNote(info.lastInsertRowid);
};

const setPinned = (id, pinned) => {
  db.prepare("UPDATE apps_notes SET pinned = ?, updated_at = ? WHERE id = ?").run(pinned ? 1 : 0, now(), id);
  return getNote(id);
};

const deleteNote = (id) => {
  db.prepare("DELETE FROM apps_notes WHERE id = ?").run(id);
  return { ok: true };
};

export {
  deleteNote,
  listNotes,
  saveNote,
  setPinned
};
