import { json } from "../../../shared/http/json.js";
import { getProviderCatalog } from "../../llm/providers.js";

const handleLlmApi = async (_req, res, path) => {
  if (path === "/api/llm/providers") {
    return json(res, getProviderCatalog());
  }
  return json(res, { error: "API endpoint not found" }, 404);
};

export { handleLlmApi };
