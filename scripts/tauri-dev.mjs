#!/usr/bin/env node
/**
 * Tauri dev helper — starts Node.js servers before `tauri dev` opens the webview.
 *
 * This is the `beforeDevCommand` in tauri.conf.json.
 * It bakes i18n tokens, starts the main server + apps server on fixed ports,
 * and exits so Tauri can proceed to open the webview.
 *
 * Usage: node scripts/tauri-dev.mjs
 */

import { spawn, execSync } from "child_process";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const PORT_MAIN = 9502;
const PORT_APPS = 9503;

console.log("[tauri-dev] Baking i18n tokens...");
try {
  execSync(`node --import tsx ${join(ROOT, "scripts/start.ts")} en --force`, {
    cwd: ROOT,
    stdio: "inherit",
    timeout: 30_000,
  });
} catch {
  console.warn("[tauri-dev] i18n bake failed or already baked, continuing...");
}

console.log("[tauri-dev] Starting main server on :" + PORT_MAIN);
const mainProc = spawn("node", ["--import", "tsx", "server/main/index.ts", `--port=${PORT_MAIN}`], {
  cwd: ROOT,
  stdio: "inherit",
  env: {
    ...process.env,
    AIOS_MAIN_PORT: String(PORT_MAIN),
    AIOS_APPS_PORT: String(PORT_APPS),
  },
});

console.log("[tauri-dev] Starting apps server on :" + PORT_APPS);
const appsProc = spawn("node", ["--import", "tsx", "server/apps/index.ts", `--port=${PORT_APPS}`], {
  cwd: ROOT,
  stdio: "inherit",
  env: {
    ...process.env,
    AIOS_MAIN_PORT: String(PORT_MAIN),
    AIOS_APPS_PORT: String(PORT_APPS),
  },
});

// Wait for servers to be ready
const waitFor = (url, maxRetries = 30) =>
  new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      fetch(url)
        .then((r) => {
          if (r.ok) {
            console.log(`[tauri-dev] ${url} ready`);
            resolve();
          } else {
            throw new Error("not ok");
          }
        })
        .catch(() => {
          attempts++;
          if (attempts >= maxRetries) {
            reject(new Error(`${url} not ready after ${maxRetries} attempts`));
          } else {
            setTimeout(check, 500);
          }
        });
    };
    check();
  });

await waitFor(`http://127.0.0.1:${PORT_MAIN}/api/health`);
await waitFor(`http://127.0.0.1:${PORT_APPS}/apps/health`);

console.log("[tauri-dev] All servers ready. Tauri webview will connect to http://127.0.0.1:" + PORT_MAIN);

// Keep alive — parent process (tauri dev) will kill this when it exits
// We need to stay alive so the Node servers keep running
process.on("SIGTERM", () => {
  console.log("[tauri-dev] SIGTERM received, shutting down servers...");
  mainProc.kill("SIGTERM");
  appsProc.kill("SIGTERM");
  process.exit(0);
});

process.on("exit", () => {
  mainProc.kill();
  appsProc.kill();
});

// Block the event loop so this script stays alive
await new Promise(() => {});
