import { exec } from 'child_process';
import { existsSync } from 'fs';

const TIMEOUT_DEFAULT_MS = 30 * 1000;
const TIMEOUT_MIN_MS = 1 * 1000;
const TIMEOUT_MAX_MS = 5 * 60 * 1000;
const SHELL_CANDIDATES = [
  process.env.SHELL,
  '/bin/sh',
  '/system/bin/sh'
];

const resolveTimeoutMs = (timeout) => {
  if (timeout == null) return TIMEOUT_DEFAULT_MS;
  const seconds = Number(timeout);
  if (!Number.isFinite(seconds)) return TIMEOUT_DEFAULT_MS;
  return Math.min(Math.max(seconds * 1000, TIMEOUT_MIN_MS), TIMEOUT_MAX_MS);
};

const resolveShell = () => {
  for (const shell of SHELL_CANDIDATES) {
    const value = String(shell || '').trim();
    if (value && existsSync(value)) return value;
  }
  return undefined;
};

export const shell = ({ command, cwd, timeout }: any) => {
  return new Promise<any>((resolve) => {
    const options: any = {
      timeout: resolveTimeoutMs(timeout),
      maxBuffer: 1024 * 1024
    };
    const shellPath = resolveShell();
    if (shellPath) options.shell = shellPath;
    if (String(cwd || '').trim()) {
      options.cwd = String(cwd || '').trim();
    }
    exec(String(command || ''), options, (err, stdout, stderr) => {
      if (err) {
        resolve(`exit code ${err.code}\n${stderr || err.message}`);
        return;
      }
      resolve(stdout || stderr || '__T_TOOL_NO_OUTPUT__');
    });
  });
};
