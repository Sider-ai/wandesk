import { DatabaseSync } from "node:sqlite";
import { MAIN_DB_PATH } from "../paths.js";

let cached = null;

// 在 apps 进程里按需从主进程的 aios.db 读 auth.api_token。
// 主进程启动时把 token 推到 process.env.AIOS_API_TOKEN，但 apps 进程
// 是独立 spawn 的，不一定继承得到，所以这里直接读库做兜底。
const getApiToken = () => {
  if (cached) return cached;
  if (process.env.AIOS_API_TOKEN) {
    cached = process.env.AIOS_API_TOKEN;
    return cached;
  }
  try {
    const db = new DatabaseSync(MAIN_DB_PATH, { readOnly: true });
    const row: any = db.prepare("SELECT api_token FROM auth WHERE id = 1").get();
    db.close();
    cached = row?.api_token || "";
    return cached;
  } catch {
    return "";
  }
};

export { getApiToken };
