import { readBody } from "../../../shared/http/readBody.js";
import { json } from "../../../shared/http/json.js";
import { getStatus } from "../service/status.js";
import { start } from "../service/start.js";
import { stop } from "../service/stop.js";
import { listDecisions } from "../service/decisions.js";
import { listEquity } from "../service/equity.js";
import { saveGoal } from "../service/goal.js";
import { saveExchange } from "../service/exchange.js";
import { testExchange } from "../service/exchangeTest.js";
const handleCryptobotApi = async (req, res, path) => {
  if (path === "/apps/cryptobot/status" && req.method === "GET") {
    return json(res, await getStatus());
  }
  if (path === "/apps/cryptobot/exchange" && req.method === "POST") {
    const body = await readBody(req);
    return json(res, saveExchange(body));
  }
  if (path === "/apps/cryptobot/exchange/test" && req.method === "POST") {
    const body = await readBody(req);
    return json(res, await testExchange(body));
  }
  if (path === "/apps/cryptobot/goal" && req.method === "POST") {
    const body = await readBody(req);
    return json(res, saveGoal(body));
  }
  if (path === "/apps/cryptobot/start" && req.method === "POST") {
    const body = await readBody(req);
    return json(res, await start(body));
  }
  if (path === "/apps/cryptobot/stop" && req.method === "POST") {
    return json(res, stop());
  }
  if (path === "/apps/cryptobot/decisions" && req.method === "GET") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const limit = Number(url.searchParams.get("limit") || 50);
    return json(res, listDecisions({ limit }));
  }
  if (path === "/apps/cryptobot/equity" && req.method === "GET") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const limit = Number(url.searchParams.get("limit") || 300);
    return json(res, listEquity({ limit }));
  }
  return false;
};
export {
  handleCryptobotApi
};
