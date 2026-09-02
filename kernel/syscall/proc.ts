// env.PROC —— managed child processes.
//
// There's no such thing as a "process" inside a worker, and apps like claude-code / codex need
// some way to get one. The process is held by the kernel (not the app); the app only ever gets
// a pid and logs. If an app is uninstalled or its window is closed, the process stays alive ——
// that's deliberate: running a build or a dev server shouldn't get killed just because a window closed.
import { spawn, type ChildProcess } from "child_process";
import { randomUUID } from "crypto";
import { workspace } from "../paths.js";
import { broadcast } from "../realtime.js";

type Managed = {
  id: string;
  appId: string;
  pid: number;
  command: string;
  child: ChildProcess;
  log: string[];
  exitCode: number | null;
  startedAt: number;
};

const MAX_LOG_LINES = 2000;
const procs = new Map<string, Managed>();

const push = (p: Managed, chunk: string) => {
  for (const line of chunk.split(/\r?\n/)) {
    if (!line) continue;
    p.log.push(line);
    if (p.log.length > MAX_LOG_LINES) p.log.shift();
  }
  broadcast("proc.log", { id: p.id, appId: p.appId });
};

export const procSpawn = (appId: string, command: string, args: string[] = [], cwd?: string) => {
  const id = randomUUID();
  const child = spawn(command, args, {
    cwd: cwd || workspace(),
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const managed: Managed = {
    id, appId, pid: child.pid || 0, command: [command, ...args].join(" "),
    child, log: [], exitCode: null, startedAt: Date.now(),
  };
  child.stdout?.setEncoding("utf8");
  child.stderr?.setEncoding("utf8");
  child.stdout?.on("data", (c: string) => push(managed, c));
  child.stderr?.on("data", (c: string) => push(managed, c));
  child.on("exit", (code) => {
    managed.exitCode = code ?? -1;
    broadcast("proc.exit", { id, appId, code: managed.exitCode });
  });
  procs.set(id, managed);
  return { id, pid: managed.pid };
};

export const procList = (appId?: string) =>
  [...procs.values()]
    .filter((p) => !appId || p.appId === appId)
    .map((p) => ({ id: p.id, appId: p.appId, pid: p.pid, command: p.command, exitCode: p.exitCode, startedAt: p.startedAt }));

export const procLog = (id: string, tail = 200) => {
  const p = procs.get(id);
  if (!p) return null;
  return { id, exitCode: p.exitCode, lines: p.log.slice(-Math.min(2000, tail)) };
};

export const procKill = (id: string, signal: NodeJS.Signals = "SIGTERM") => {
  const p = procs.get(id);
  if (!p) return false;
  try { p.child.kill(signal); } catch { /* already exited */ }
  return true;
};

/** One-shot execution: wait for it to finish and grab stdout. Good for something like `git status` that just answers and is done. */
export const procExec = (appId: string, command: string, args: string[] = [], cwd?: string, timeoutMs = 120000) =>
  new Promise<{ code: number; stdout: string; stderr: string }>((resolve) => {
    const child = spawn(command, args, { cwd: cwd || workspace(), env: process.env });
    let stdout = "", stderr = "";
    const timer = setTimeout(() => { try { child.kill("SIGKILL"); } catch { /* already exited */ } }, timeoutMs);
    child.stdout?.on("data", (c) => { stdout += c; });
    child.stderr?.on("data", (c) => { stderr += c; });
    child.on("close", (code) => { clearTimeout(timer); resolve({ code: code ?? -1, stdout, stderr }); });
    child.on("error", (e) => { clearTimeout(timer); resolve({ code: -1, stdout, stderr: String(e?.message || e) }); });
  });

process.on("exit", () => { for (const p of procs.values()) { try { p.child.kill("SIGTERM"); } catch { /* ignore */ } } });
