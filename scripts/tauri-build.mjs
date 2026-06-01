/**
 * Build a distributable desktop app (.app / .dmg on macOS, equivalents else).
 *
 * Assembles the workspace template, builds the shell's static assets, then runs
 * `tauri build`. The result is UNSIGNED — signing, notarization and a bundled
 * private runtime are downstream packaging concerns kept out of this repo.
 * Requires a Rust toolchain and Node >= 22.5.
 */
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoDir = resolve(scriptDir, "..");

const step = (cmd, args) => {
  const res = spawnSync(cmd, args, { cwd: repoDir, stdio: "inherit" });
  if (res.status !== 0) process.exit(res.status ?? 1);
};

step(process.execPath, [join(scriptDir, "tauri-prepare.mjs")]);
step(join(repoDir, "node_modules", ".bin", "tauri"), ["build"]);
