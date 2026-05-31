import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

// Tauri 从 Dock 启动后,spawn 出来的 Node 拿到的 PATH 只有 /usr/bin:/bin,
// 用户实际装 openclaw 的位置(~/.npm-global、homebrew 等)都不在里面。
// 所以给所有 openclaw 子进程统一显式拼一份 PATH。
const ENHANCED_PATH = [
  path.join(os.homedir(), ".npm-global", "bin"),
  path.join(os.homedir(), ".local", "bin"),
  "/opt/homebrew/bin",
  "/usr/local/bin",
  process.env.PATH || ""
].filter(Boolean).join(":");

const openclawEnv = () => ({ ...process.env, PATH: ENHANCED_PATH });

type RunResult = { ok: boolean; stdout: string; stderr: string; code: number };

const runCmd = (cmd: string, args: string[], opts: any = {}) =>
  new Promise<RunResult>((resolve) => {
    let stdout = "";
    let stderr = "";
    const timeout = opts.timeout ?? 10000;
    const child = spawn(cmd, args, { shell: false, windowsHide: true, env: openclawEnv(), ...opts });
    const timer = setTimeout(() => child.kill(), timeout);
    child.stdout?.on("data", (d) => (stdout += d.toString()));
    child.stderr?.on("data", (d) => (stderr += d.toString()));
    child.on("error", () => {
      clearTimeout(timer);
      resolve({ ok: false, stdout, stderr, code: -1 });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0, stdout, stderr, code: code ?? -1 });
    });
  });

export { runCmd, openclawEnv, ENHANCED_PATH };
