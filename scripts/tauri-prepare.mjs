/**
 * Assemble the workspace template the desktop shell bundles and boots from.
 *
 * The Tauri shell (tauri/) copies tauri/resources/aios into the per-user data
 * directory on first launch, then bakes i18n, builds the frontend and compiles
 * the server there. So the template only needs the source tree (tokens intact)
 * plus an installed node_modules — no pre-bake, no compiled output.
 *
 * Used by tauri-dev.mjs and tauri-build.mjs. Safe to run repeatedly.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoDir = resolve(scriptDir, "..");
const aiosDir = join(repoDir, "tauri", "resources", "aios");

// Top-level entries excluded from the template: VCS, installed deps (copied
// separately), build output, the shell itself, and user/runtime state.
const EXCLUDE_TOP = new Set([
  ".git",
  "node_modules",
  "dist",
  "tauri",
  "database",
  "files",
  "apps",
  ".aios",
  ".github",
  "contributions",
]);

// Per-entry filter for the source copy (dest lives inside repoDir, so the tree
// can't be copied wholesale — each allowed top-level entry is copied on its own).
const copyFilter = (src) => {
  const base = src.split(/[\\/]/).pop();
  if (base === ".DS_Store" || base.startsWith("._")) return false;
  return true;
};

const run = () => {
  if (!existsSync(join(repoDir, "node_modules"))) {
    throw new Error(
      "node_modules missing — run `npm install` in the repo root before building the desktop shell."
    );
  }

  console.log(`[tauri-prepare] resetting ${aiosDir}`);
  rmSync(aiosDir, { recursive: true, force: true });
  mkdirSync(aiosDir, { recursive: true });

  console.log("[tauri-prepare] copying source tree (tokens intact)");
  for (const entry of readdirSync(repoDir)) {
    if (EXCLUDE_TOP.has(entry)) continue;
    cpSync(join(repoDir, entry), join(aiosDir, entry), {
      recursive: true,
      filter: copyFilter,
    });
  }
  // gui/dist is build output — drop it if present in the copy.
  rmSync(join(aiosDir, "gui", "dist"), { recursive: true, force: true });

  console.log("[tauri-prepare] copying node_modules");
  cpSync(join(repoDir, "node_modules"), join(aiosDir, "node_modules"), {
    recursive: true,
    dereference: true,
  });

  console.log("[tauri-prepare] template ready");
};

run();
