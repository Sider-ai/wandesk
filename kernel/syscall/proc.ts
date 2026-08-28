// env.PROC —— 受管子进程。
//
// worker 里没有「进程」这个东西,claude-code / codex 那一类应用必须有个口子。
// 进程由内核持有(不是应用),应用只拿到 pid 与日志。应用被卸载/窗口关掉,进程还活着 ——
// 这是刻意的:跑构建、跑 dev server 不该因为关个窗口就被杀。
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
  try { p.child.kill(signal); } catch { /* 已退出 */ }
  return true;
};

/** 一次性执行:等它跑完,拿 stdout。适合 `git status` 这种问一句就完的。 */
export const procExec = (appId: string, command: string, args: string[] = [], cwd?: string, timeoutMs = 120000) =>
  new Promise<{ code: number; stdout: string; stderr: string }>((resolve) => {
    const child = spawn(command, args, { cwd: cwd || workspace(), env: process.env });
    let stdout = "", stderr = "";
    const timer = setTimeout(() => { try { child.kill("SIGKILL"); } catch { /* 已退出 */ } }, timeoutMs);
    child.stdout?.on("data", (c) => { stdout += c; });
    child.stderr?.on("data", (c) => { stderr += c; });
    child.on("close", (code) => { clearTimeout(timer); resolve({ code: code ?? -1, stdout, stderr }); });
    child.on("error", (e) => { clearTimeout(timer); resolve({ code: -1, stdout, stderr: String(e?.message || e) }); });
  });

process.on("exit", () => { for (const p of procs.values()) { try { p.child.kill("SIGTERM"); } catch { /* 忽略 */ } } });
