import { handleFinanceApi } from "./api/index.js";
import { initFinanceDatabase } from "./repository/init.js";
var stdin_default = {
  name: "finance",
  match: (path) => path.startsWith("/apps/finance/"),
  initDb: initFinanceDatabase,
  handleApi: handleFinanceApi
};
export {
  stdin_default as default
};
