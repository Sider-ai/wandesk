import { handleOpenclawApi } from "./api/index.js";
import { initOpenClawDatabase } from "./repository/init.js";

export default {
  name: "openclaw",
  match: (path) => path.startsWith("/apps/openclaw/"),
  initDb: initOpenClawDatabase,
  handleApi: handleOpenclawApi
};
