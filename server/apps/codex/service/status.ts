import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

// Tauri 从 Dock 启动后,spawn 出来的 Node 拿到的 PATH 只有 /usr/bin:/bin,
// 用户实际装 codex 的位置(~/.npm-global、homebrew 等)都不在里面。
// 所以给所有 codex 子进程统一显式拼一份 PATH。
const ENHANCED_PATH = [
  path.join(os.homedir(), ".npm-global", "bin"),
  path.join(os.homedir(), ".local", "bin"),
  "/opt/homebrew/bin",
  "/usr/local/bin",
  process.env.PATH || ""
].filter(Boolean).join(":");

const codexEnv = () => ({ ...process.env, PATH: ENHANCED_PATH });

const runCmd = (cmd, args, opts: any = {}) =>
  new Promise<any>((resolve) => {
    let stdout = "";
    let stderr = "";
    const child = spawn(cmd, args, { shell: false, windowsHide: true, env: codexEnv(), ...opts });
    child.stdout?.on("data", (d) => (stdout += d.toString()));
    child.stderr?.on("data", (d) => (stderr += d.toString()));
    child.on("error", () => resolve({ ok: false, stdout, stderr, code: -1 }));
    child.on("close", (code) => resolve({ ok: code === 0, stdout, stderr, code }));
  });

const getCodexStatus = async () => {
  const ver = await runCmd("codex", ["--version"]);
  return {
    installed: ver.ok,
    version: ver.ok ? ver.stdout.trim() : null,
    cliPath: null
  };
};

export { getCodexStatus, codexEnv, ENHANCED_PATH };
