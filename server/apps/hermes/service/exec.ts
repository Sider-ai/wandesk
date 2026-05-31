import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

const ENHANCED_PATH = [
  path.join(os.homedir(), ".local", "bin"),
  path.join(os.homedir(), ".npm-global", "bin"),
  "/opt/homebrew/bin",
  "/usr/local/bin",
  process.env.PATH || ""
].filter(Boolean).join(":");

const hermesEnv = () => ({ ...process.env, PATH: ENHANCED_PATH });

type RunResult = { ok: boolean; stdout: string; stderr: string; code: number };

const runCmd = (cmd: string, args: string[], opts: any = {}) =>
  new Promise<RunResult>((resolve) => {
    let stdout = "";
    let stderr = "";
    const timeout = opts.timeout ?? 10000;
    const child = spawn(cmd, args, { shell: false, windowsHide: true, env: hermesEnv(), ...opts });
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

const runHermes = async (args: string[], timeout = 15000) => {
  const result = await runCmd("hermes", args, { timeout });
  if (!result.ok) {
    const detail = result.stderr.trim() || result.stdout.trim() || `hermes ${args.join(" ")} failed`;
    throw new Error(detail);
  }
  return result;
};

export { ENHANCED_PATH, hermesEnv, runCmd, runHermes };
