import { handleGhtrendingApi } from "./api/index.js";
import { initGhtrendingDatabase } from "./repository/init.js";
var stdin_default = {
  name: "ghtrending",
  match: (path) => path.startsWith("/apps/ghtrending/"),
  initDb: initGhtrendingDatabase,
  handleApi: handleGhtrendingApi
};
export { stdin_default as default };
