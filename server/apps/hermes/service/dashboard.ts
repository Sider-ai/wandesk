import { spawn } from "node:child_process";
import { ENHANCED_PATH, hermesEnv, runHermes } from "./exec.js";

const DASHBOARD_URL = "http://127.0.0.1:9119/";

const isDashboardRunning = async () => {
  try {
    const raw = await runHermes(["dashboard", "--status"], 7000);
    return /dashboard process/i.test(raw.stdout) && !/No hermes dashboard/i.test(raw.stdout);
  } catch {
    return false;
  }
};

const waitForDashboard = async () => {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${DASHBOARD_URL}api/status`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) return true;
    } catch {
      // Dashboard may still be building or binding.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
};

const startDashboard = async () => {
  if (await isDashboardRunning()) return { success: true, running: true, dashboardUrl: DASHBOARD_URL };

  const child = spawn("hermes", ["dashboard", "--no-open", "--port", "9119"], {
    detached: true,
    stdio: "ignore",
    env: { ...hermesEnv(), PATH: ENHANCED_PATH }
  });
  child.unref();

  const running = await waitForDashboard();
  return { success: true, running, dashboardUrl: DASHBOARD_URL };
};

export { startDashboard };
