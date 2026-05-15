import { getConfig, saveConfig } from "../repository/config.js";
import { fetchAccountTotalEq } from "../runtime/okx.js";
import { startBot } from "../runtime/index.js";
const start = async (body: any = {}) => {
  const cfg = getConfig();
  const equity = await fetchAccountTotalEq(cfg);
  saveConfig({
    initial_equity: equity,
    current_equity: equity
  });
  startBot(body.interval_sec);
  return { success: true };
};
export {
  start
};
