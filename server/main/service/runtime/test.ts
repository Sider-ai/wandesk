import { buildFrontend, probeProcess } from "./reload.js";

const runReloadTest = async (build, restartApps, restartServer) => {
  if (build) {
    buildFrontend();
  }
  if (restartApps) {
    await probeProcess("server/apps/index.ts", 9511, "/apps/health");
  }
  if (restartServer) {
    await probeProcess("server/main/index.ts", 9510, "/api/health");
  }
  return true;
};

export {
  runReloadTest
};
