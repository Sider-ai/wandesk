/**
 * Run the desktop shell in development.
 *
 * Assembles the workspace template, then launches `tauri dev` (debug build).
 * The shell boots the Node services as sidecars; the app window loads the
 * local server once it is healthy. Requires a Rust toolchain and Node >= 22.5.
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
step(join(repoDir, "node_modules", ".bin", "tauri"), ["dev"]);
