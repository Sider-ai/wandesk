import { readBody } from "../../../shared/http/readBody.js";
import { json } from "../../../shared/http/json.js";
import { deleteNote, listNotes, saveNote, setPinned } from "../repository/notes.js";

const handleNotesApi = async (req, res, path) => {
  if (path === "/apps/notes/list" && req.method === "GET") {
    return json(res, { items: listNotes() });
  }
  if (path === "/apps/notes/save" && req.method === "POST") {
    const body = await readBody(req);
    try { return json(res, { item: saveNote(body) }); }
    catch (e) { return json(res, { error: e.message }, 400); }
  }
  if (path === "/apps/notes/pin" && req.method === "POST") {
    const body = await readBody(req);
    if (!body.id) return json(res, { error: "Missing id" }, 400);
    return json(res, { item: setPinned(body.id, body.pinned) });
  }
  if (path === "/apps/notes/delete" && req.method === "POST") {
    const body = await readBody(req);
    if (!body.id) return json(res, { error: "Missing id" }, 400);
    return json(res, deleteNote(body.id));
  }
  return false;
};

export { handleNotesApi };
