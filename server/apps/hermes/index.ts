import { handleHermesApi } from "./api/index.js";

export default {
  name: "hermes",
  match: (path) => path.startsWith("/apps/hermes/"),
  handleApi: handleHermesApi
};
