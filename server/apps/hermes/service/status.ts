import { listSessions } from "./sessions.js";
import { runCmd, runHermes } from "./exec.js";

const DASHBOARD_URL = "http://127.0.0.1:9119/";

const lineValue = (text: string, label: string) => {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`^\\s*${escaped}:\\s*(.+)$`, "im"));
  return match?.[1]?.trim() || "";
};

const readDashboard = async () => {
  try {
    const raw = await runHermes(["dashboard", "--status"], 7000);
    const text = raw.stdout.trim();
    const pid = text.match(/PID\s+(\d+)/)?.[1] || "";
    return { running: /dashboard process/i.test(text) && !/No hermes dashboard/i.test(text), pid, text };
  } catch (err: any) {
    return { running: false, pid: "", text: err?.message || "" };
  }
};

const readGateway = async () => {
  try {
    const raw = await runHermes(["gateway", "status"], 7000);
    const text = raw.stdout.trim();
    return { running: !/not running|stopped/i.test(text) && /running/i.test(text), text };
  } catch (err: any) {
    return { running: false, text: err?.message || "" };
  }
};

const readCronStatus = async () => {
  try {
    const raw = await runHermes(["cron", "status"], 7000);
    const text = raw.stdout;
    const jobs = Number((text.match(/Jobs:\s*(\d+)/i) || [])[1] || 0);
    return { jobs, text: text.trim() };
  } catch {
    return { jobs: 0, text: "" };
  }
};

const getStatus = async () => {
  const ver = await runCmd("hermes", ["--version"], { timeout: 7000 });
  if (!ver.ok) return { online: false, version: null };

  const [statusRaw, dashboard, gateway, cron, sessions] = await Promise.all([
    runHermes(["status"], 12000).catch((err: any) => ({ stdout: "", stderr: err?.message || "" })),
    readDashboard(),
    readGateway(),
    readCronStatus(),
    listSessions(6)
  ]);

  const statusText = "stdout" in statusRaw ? statusRaw.stdout : "";
  const version = ver.stdout.split(/\r?\n/)[0]?.replace(/^Hermes Agent\s*/i, "").trim() || ver.stdout.trim();
  const updateAvailable = /Update available/i.test(ver.stdout);
  const sessionCount = "count" in sessions ? Number((sessions as any).count || 0) : 0;

  return {
    online: true,
    version,
    updateAvailable,
    project: lineValue(ver.stdout, "Project") || lineValue(statusText, "Project"),
    python: lineValue(ver.stdout, "Python") || lineValue(statusText, "Python"),
    model: lineValue(statusText, "Model"),
    provider: lineValue(statusText, "Provider"),
    dashboardRunning: dashboard.running,
    dashboardPid: dashboard.pid,
    dashboardUrl: DASHBOARD_URL,
    gateway: gateway.running,
    gatewayStatus: gateway.running ? "running" : "stopped",
    cronJobs: cron.jobs,
    sessionsCount: sessionCount,
    activeSessions: Number((statusText.match(/Active:\s*(\d+)/i) || [])[1] || 0),
    statusIssue: "stderr" in statusRaw ? statusRaw.stderr : ""
  };
};

export { getStatus };
