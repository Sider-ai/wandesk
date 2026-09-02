// Global paths: defined once here, referenced everywhere else.
//
//   <workspace>/                 The user's workspace (defaults to ~/wandesk)
//     apps/<id>/                 An app's home —— one directory is one app
//     .wandesk/kernel.db         The kernel's own database (conversations/messages/compaction/settings/memory)
//     .wandesk/store/            App databases (where workerd's AppStore writes to disk, one .sqlite per app)
//
// apps/<id>/data.db is a link pointing at the real file inside store: `sqlite3 apps/notes/data.db`
// just works, which is what makes "the AI can manage the apps it built itself" hold true.
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repo root: the source directory in dev, the resources directory when packaged. */
export const HOME = process.env.WANDESK_HOME || path.join(__dirname, "..");

/** Workspace root —— the user's own territory. Apps, data, and files all live here. */
export const workspace = () => {
  const dir = process.env.WANDESK_WORKSPACE || path.join(os.homedir(), "wandesk");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

export const appsDir = () => {
  const dir = path.join(workspace(), "apps");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

export const kernelDir = () => {
  const dir = path.join(workspace(), ".wandesk");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

export const kernelDbFile = () => path.join(kernelDir(), "kernel.db");

/** Factory templates for preinstalled apps (shipped with the package, landed into the workspace on first launch). */
export const presetAppsDir = () => process.env.WANDESK_PRESETS || path.join(HOME, "apps");

/** The shell's frontend build output (served directly by the kernel in production). */
export const uiDistDir = () => process.env.WANDESK_UI_DIST || path.join(HOME, "dist/ui");
