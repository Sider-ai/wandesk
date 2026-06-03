import { httpServer } from "./service/runtime/http.js";
import { setupWebSocket } from "./service/runtime/ws.js";
import { initSystemDirs } from "./service/runtime/dir.js";
import { initDatabase } from "./repository/init.js";
import { exposeTokenToEnv } from "./api/auth/index.js";

const portArg = process.argv.find((arg) => arg.startsWith("--port="));
if (portArg && !/^\-\-port=\d+$/.test(portArg)) {
  throw new Error("Invalid port argument");
}
const PORT = portArg ? Number(portArg.slice("--port=".length)) : 9602;
process.env.AIOS_MAIN_PORT = String(PORT);

// 默认只绑 127.0.0.1,避免桌面版被同局域网其他设备访问。
// 云端 / Docker 部署可通过环境变量 AIOS_MAIN_HOST=0.0.0.0 暴露。
const HOST = process.env.AIOS_MAIN_HOST || "127.0.0.1";

initSystemDirs();
initDatabase();
exposeTokenToEnv();   // 启动时把 api_token 推到 process.env.AIOS_API_TOKEN
setupWebSocket(httpServer);

httpServer.listen(PORT, HOST, () => {
  console.log(`🌱  AIOS is growing`);
  console.log(`🌐  http://${HOST}:${PORT}`);
});
