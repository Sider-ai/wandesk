import { execFileSync, execSync, spawn } from "child_process";
import { delimiter, dirname, join } from "path";
import { broadcast } from "./ws.js";
const ROOT_DIR = process.cwd();
const APPS_ENTRY = "dist/server/apps/index.js";
const SERVER_ENTRY = "dist/server/main/index.js";
const NODE_BIN = process.execPath;
const TSX_CLI = join(ROOT_DIR, "node_modules", "tsx", "dist", "cli.mjs");
const TSC_CLI = join(ROOT_DIR, "node_modules", "typescript", "bin", "tsc");
const VITE_CLI = join(ROOT_DIR, "node_modules", "vite", "bin", "vite.js");
const wait = (ms) => new Promise<any>((resolve) => setTimeout(resolve, ms));
const HEALTHCHECK_TIMEOUT_MS = 1000;

const withBundledNodePath = (extra: any = {}) => {
  const nodeDir = dirname(NODE_BIN);
  const currentPath = process.env.PATH || "";
  return {
    ...process.env,
    ...extra,
    PATH: currentPath ? `${nodeDir}${delimiter}${currentPath}` : nodeDir,
    npm_config_scripts_prepend_node_path: "true"
  };
};

const probeHealth = async (url) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HEALTHCHECK_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
};

const stopProbe = async (probe) => {
  if (!probe || probe.exitCode !== null) return;
  probe.kill("SIGTERM");
  for (let i = 0; i < 10; i++) {
    if (probe.exitCode !== null) return;
    await wait(100);
  }
  if (probe.exitCode === null) {
    probe.kill("SIGKILL");
  }
};

const buildFrontend = (options: any = {}) => {
  const env = withBundledNodePath(options.env || {});
  const locale = options.env?.AIOS_LANG || process.env.AIOS_LANG || "en";
  execFileSync(NODE_BIN, [TSX_CLI, "scripts/start.ts", locale, "--force"], {
    cwd: ROOT_DIR,
    timeout: 12e4,
    stdio: "pipe",
    env
  });
  execFileSync(NODE_BIN, [VITE_CLI, "build", "--config", "gui/vite.config.ts", "gui"], {
    cwd: ROOT_DIR,
    timeout: 12e4,
    stdio: "pipe",
    env
  });
};
const buildServer = (options: any = {}) => {
  const env = withBundledNodePath(options.env || {});
  execFileSync(NODE_BIN, [TSC_CLI, "-p", "tsconfig.server.json"], {
    cwd: ROOT_DIR,
    timeout: 12e4,
    stdio: "pipe",
    env
  });
};
const probeProcess = async (entry, probePort, healthPath) => {
  const probe = spawn(NODE_BIN, [entry, `--port=${probePort}`], {
    cwd: ROOT_DIR,
    stdio: "ignore",
    env: withBundledNodePath({
      AIOS_PORT: String(probePort),
      AIOS_APPS_PORT: String(probePort)
    })
  });
  const healthUrl = `http://127.0.0.1:${probePort}${healthPath}`;
  let alive = false;
  for (let i = 0; i < 30; i++) {
    await wait(500);
    if (probe.exitCode !== null) {
      break;
    }
    if (await probeHealth(healthUrl)) {
      alive = true;
      break;
    }
  }
  await stopProbe(probe);
  try {
    execSync(`lsof -ti:${probePort} | xargs kill 2>/dev/null || true`, { stdio: "pipe" });
  } catch {
  }
  if (!alive) {
    throw new Error(`${entry} health check failed. Existing service remains running.`);
  }
};
const startDetachedNode = (entry) => {
  const child = spawn(NODE_BIN, [entry], {
    cwd: ROOT_DIR,
    detached: true,
    stdio: "ignore",
    env: withBundledNodePath()
  });
  child.unref();
};
const restartAppsProcess = async (options: any = {}) => {
  if (options.skipBuild !== true) buildServer();
  await probeProcess(APPS_ENTRY, 9511, "/apps/health");
  try {
    const appsPort = process.env.AIOS_APPS_PORT || "9503";
    execSync(`lsof -ti:${appsPort} | xargs kill 2>/dev/null || true`, { stdio: "pipe" });
  } catch {
  }
  startDetachedNode(APPS_ENTRY);
};
const scheduleServerRestart = async (options: any = {}) => {
  if (options.skipBuild !== true) buildServer();
  await probeProcess(SERVER_ENTRY, 9510, "/api/health");
  setTimeout(() => {
    const child = spawn(NODE_BIN, [SERVER_ENTRY], {
      cwd: ROOT_DIR,
      detached: true,
      stdio: "ignore",
      env: withBundledNodePath()
    });
    child.unref();
    process.exit(0);
  }, 300);
};
const requestReload = (options: any = {}) => {
  const payload = {
    type: "reload_request",
    build: options.build ?? false,
    restartApps: options.restartApps === true,
    restartServer: options.restartServer === true,
    message: options.message || ""
  };
  console.log("[reload.broadcast]", JSON.stringify(payload));
  broadcast(payload);
};
const runReload = async (build, restartApps, restartServer, options: any = {}) => {
  if (build) {
    buildFrontend();
  }
  if (restartApps || restartServer) {
    buildServer();
  }
  if (restartApps) {
    if (options.defer === true) {
      setTimeout(() => {
        restartAppsProcess({ skipBuild: true }).catch((error) => {
          console.error("[reload] apps restart failed:", error);
        });
      }, Number(options.delayMs || 300));
    } else {
      await restartAppsProcess({ skipBuild: true });
    }
  }
  if (restartServer) {
    if (options.defer === true) {
      setTimeout(() => {
        scheduleServerRestart({ skipBuild: true }).catch((error) => {
          console.error("[reload] server restart failed:", error);
        });
      }, Number(options.delayMs || 300));
      return true;
    }
    await scheduleServerRestart({ skipBuild: true });
  }
  return false;
};
export {
  APPS_ENTRY,
  SERVER_ENTRY,
  buildServer,
  buildFrontend,
  probeProcess,
  requestReload,
  restartAppsProcess,
  runReload,
  scheduleServerRestart,
  withBundledNodePath
};
