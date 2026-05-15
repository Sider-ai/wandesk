import { execFileSync, execSync, spawn } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { broadcast } from "./ws.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..", "..", "..", "..");
const APPS_ENTRY = "server/apps/index.ts";
const SERVER_ENTRY = "server/main/index.ts";
const NODE_BIN = process.execPath;
const TSX_CLI = join(ROOT_DIR, "node_modules", "tsx", "dist", "cli.mjs");
const VITE_CLI = join(ROOT_DIR, "node_modules", "vite", "bin", "vite.js");
const wait = (ms) => new Promise<any>((resolve) => setTimeout(resolve, ms));
const HEALTHCHECK_TIMEOUT_MS = 1000;

const withBundledNodePath = (extra: any = {}) => {
  const nodeDir = dirname(NODE_BIN);
  const currentPath = process.env.PATH || "";
  return {
    ...process.env,
    ...extra,
    PATH: currentPath ? `${nodeDir}:${currentPath}` : nodeDir,
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
const probeProcess = async (entry, probePort, healthPath) => {
  const probe = spawn(NODE_BIN, [TSX_CLI, entry, `--port=${probePort}`], {
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
  const child = spawn(NODE_BIN, [TSX_CLI, entry], {
    cwd: ROOT_DIR,
    detached: true,
    stdio: "ignore",
    env: withBundledNodePath()
  });
  child.unref();
};
const restartAppsProcess = async () => {
  await probeProcess(APPS_ENTRY, 9511, "/apps/health");
  try {
    const appsPort = process.env.AIOS_APPS_PORT || "9503";
    execSync(`lsof -ti:${appsPort} | xargs kill 2>/dev/null || true`, { stdio: "pipe" });
  } catch {
  }
  startDetachedNode(APPS_ENTRY);
};
const scheduleServerRestart = async () => {
  await probeProcess(SERVER_ENTRY, 9510, "/api/health");
  setTimeout(() => {
    const child = spawn(NODE_BIN, [TSX_CLI, SERVER_ENTRY], {
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
  if (restartApps) {
    if (options.defer === true) {
      setTimeout(() => {
        restartAppsProcess().catch((error) => {
          console.error("[reload] apps restart failed:", error);
        });
      }, Number(options.delayMs || 300));
    } else {
      await restartAppsProcess();
    }
  }
  if (restartServer) {
    if (options.defer === true) {
      setTimeout(() => {
        scheduleServerRestart().catch((error) => {
          console.error("[reload] server restart failed:", error);
        });
      }, Number(options.delayMs || 300));
      return true;
    }
    await scheduleServerRestart();
  }
  return false;
};
export {
  buildFrontend,
  probeProcess,
  requestReload,
  restartAppsProcess,
  runReload,
  scheduleServerRestart,
  withBundledNodePath
};
