import { mkdirSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";

/**
 * Centralized data directory resolution for Wandesk.
 *
 * In desktop (Tauri) mode, `AIOS_DATA_DIR` is set by the Rust sidecar manager
 * to a platform-specific directory:
 *   macOS: ~/Library/Application Support/Wandesk/
 *   Windows: %APPDATA%/Wandesk/
 *   Linux: ~/.local/share/wandesk/
 *
 * In CLI / dev mode (no AIOS_DATA_DIR), falls back to the repo root (cwd).
 */
const __dirname = dirname(fileURLToPath(import.meta.url));

// Source root: 4 levels up from server/shared/paths.ts → repo root
const SOURCE_ROOT = resolve(__dirname, "..", "..", "..");

const getDataDir = (): string => {
  if (process.env.AIOS_DATA_DIR) {
    return process.env.AIOS_DATA_DIR;
  }
  return SOURCE_ROOT;
};

/** The writable data root — all persistent data lives here in desktop mode. */
export const DATA_DIR = getDataDir();

/** Database directory: <DATA_DIR>/database/ */
export const DB_DIR = join(DATA_DIR, "database");

/** Main database path: <DB_DIR>/aios.db */
export const MAIN_DB_PATH = join(DB_DIR, "aios.db");

/** App databases directory: <DB_DIR>/apps/ */
export const APPS_DB_DIR = join(DB_DIR, "apps");

/** Files directory: <DATA_DIR>/files/ */
export const FILES_DIR = join(DATA_DIR, "files");

/** Ensure all data subdirectories exist. */
export const ensureDataDirs = () => {
  mkdirSync(DB_DIR, { recursive: true });
  mkdirSync(APPS_DB_DIR, { recursive: true });
  mkdirSync(join(FILES_DIR, "uploads"), { recursive: true });
  mkdirSync(join(FILES_DIR, "exports"), { recursive: true });
  mkdirSync(join(FILES_DIR, "tmp"), { recursive: true });
};

/** Whether we're running inside the Tauri desktop wrapper. */
export const IS_DESKTOP = process.env.AIOS_DESKTOP_MODE === "1";

/** Source root (for serving gui/dist, loading language files, etc.) */
export { SOURCE_ROOT };
