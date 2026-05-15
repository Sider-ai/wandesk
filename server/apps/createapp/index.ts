import { handleCreateAppApi } from "./api/index.js";
import { initCreateAppDatabase } from "./repository/init.js";
var stdin_default = {
  name: "createapp",
  match: (path) => path.startsWith("/apps/createapp/"),
  initDb: initCreateAppDatabase,
  handleApi: handleCreateAppApi
};
export {
  stdin_default as default
};
