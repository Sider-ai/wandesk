import { httpServer } from "./service/runtime/http.js";
import { setupWebSocket } from "./service/runtime/ws.js";
import { initSystemDirs } from "./service/runtime/dir.js";
import { initDatabase } from "./repository/init.js";
import { exposeTokenToEnv } from "./api/auth/index.js";

const portArg = process.argv.find((arg) => arg.startsWith("--port="));
if (portArg && !/^\-\-port=\d+$/.test(portArg)) {
  throw new Error("Invalid port argument");
}
const PORT = portArg ? Number(portArg.slice("--port=".length)) : 9502;
process.env.AIOS_MAIN_PORT = String(PORT);

initSystemDirs();
initDatabase();
exposeTokenToEnv();   // 启动时把 api_token 推到 process.env.AIOS_API_TOKEN
setupWebSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🌱  AIOS is growing`);
  console.log(`🌐  http://localhost:${PORT}`);
});
