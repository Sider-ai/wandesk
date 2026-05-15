import { execFileSync } from "child_process";
import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readlinkSync, realpathSync, rmSync, symlinkSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { buildFrontend, restartAppsProcess, scheduleServerRestart, withBundledNodePath } from "./reload.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, "..", "..", "..", "..");

const ROOT_EXCLUDES = new Set([
  ".git",
  "node_modules",
  "database",
  "files",
  ".aios",
  "apps",
  "dist",
  ".DS_Store",
]);

const LANGUAGES = new Set(["zh", "en"]);

const isSamePath = (a, b) => {
  try {
    return realpathSync(a) === realpathSync(b);
  } catch {
    return false;
  }
};

const hasPackage = (dir) => existsSync(join(dir, "package.json"));

const resolveSourceDir = () => {
  const candidates = [
    process.env.AIOS_SOURCE_DIR,
    join(ROOT_DIR, "..", "repo"),
    join(ROOT_DIR, "..", "..", "AIOS"),
  ].filter(Boolean).map((item) => resolve(item));

  for (const dir of candidates) {
    if (!hasPackage(dir)) continue;
    if (isSamePath(dir, ROOT_DIR)) continue;
    if (!existsSync(join(dir, "language"))) continue;
    return dir;
  }
  return "";
};

const copyTree = (src, dst, { root = false }: any = {}) => {
  mkdirSync(dst, { recursive: true });

  const sourceNames = new Set(readdirSync(src));
  if (existsSync(dst)) {
    for (const name of readdirSync(dst)) {
      if (root && ROOT_EXCLUDES.has(name)) continue;
      if (!sourceNames.has(name)) rmSync(join(dst, name), { recursive: true, force: true });
    }
  }

  for (const name of sourceNames) {
    if (root && ROOT_EXCLUDES.has(name)) continue;
    const from = join(src, name);
    const to = join(dst, name);
    const st = lstatSync(from);
    if (st.isSymbolicLink()) {
      rmSync(to, { recursive: true, force: true });
      symlinkSync(readlinkSync(from), to);
    } else if (st.isDirectory()) {
      copyTree(from, to);
    } else if (st.isFile()) {
      mkdirSync(dirname(to), { recursive: true });
      copyFileSync(from, to);
    }
  }
};

const clearBakeMarker = () => {
  rmSync(join(ROOT_DIR, ".aios", "settings.json"), { force: true });
};

const removeRuntimeLanguageSources = () => {
  rmSync(join(ROOT_DIR, "language"), { recursive: true, force: true });
};

const prepareLanguage = (language) => {
  const locale = String(language || "").trim();
  if (!LANGUAGES.has(locale)) {
    throw new Error(`Unsupported language: ${locale || "(empty)"}`);
  }
  const sourceDir = resolveSourceDir();
  if (!sourceDir) {
    throw new Error("Cannot find clean AIOS source directory. Set AIOS_SOURCE_DIR to the source checkout.");
  }

  copyTree(sourceDir, ROOT_DIR, { root: true });
  clearBakeMarker();
  buildFrontend({ env: { AIOS_LANG: locale } });

  // Installed runtime does not need language sources after baking. Future language
  // switches resync from the clean source directory before baking again.
  removeRuntimeLanguageSources();
};

const restartAfterLanguageApply = async () => {
  await restartAppsProcess();
  await scheduleServerRestart();
};

const applyLanguage = async (language) => {
  prepareLanguage(language);
  await restartAfterLanguageApply();
};

export {
  applyLanguage,
  prepareLanguage,
  restartAfterLanguageApply,
  resolveSourceDir,
};
