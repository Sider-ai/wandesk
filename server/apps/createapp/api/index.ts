import { json } from "../../../shared/http/json.js";
const handleCreateAppApi = async (req, res, path) => {
  if (path === "/apps/createapp/status" && req.method === "GET") {
    return json(res, { status: "running", message: "CreateApp service is ready" });
  }
  return false;
};
export {
  handleCreateAppApi
};
