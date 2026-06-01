import { APPS_ENTRY, SERVER_ENTRY, buildFrontend, buildServer, probeProcess } from "./reload.js";

const runReloadTest = async (build, restartApps, restartServer) => {
  if (build) {
    buildFrontend();
  }
  if (restartApps || restartServer) {
    buildServer();
  }
  if (restartApps) {
    await probeProcess(APPS_ENTRY, 9511, "/apps/health");
  }
  if (restartServer) {
    await probeProcess(SERVER_ENTRY, 9510, "/api/health");
  }
  return true;
};

export {
  runReloadTest
};
