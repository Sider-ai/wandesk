import { handleOpenclawApi } from "./api/index.js";

export default {
  name: "openclaw",
  match: (path) => path.startsWith("/apps/openclaw/"),
  handleApi: handleOpenclawApi
};
