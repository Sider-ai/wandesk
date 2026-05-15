import { handleNotesApi } from "./api/index.js";
import { initNotesDatabase } from "./repository/init.js";

export default {
  name: "notes",
  match: (path) => path.startsWith("/apps/notes/"),
  initDb: initNotesDatabase,
  handleApi: handleNotesApi
};
