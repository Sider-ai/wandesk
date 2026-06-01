#!/usr/bin/env node
/**
 * Tauri build helper — prepares the application bundle for `cargo tauri build`.
 *
 * This is the `beforeBuildCommand` in tauri.conf.json.
 * It:
 *   1. Bakes i18n tokens (en)
 *   2. Builds the frontend (vite build)
 *   3. Copies the application to tauri/resources/aios/
 *   4. Installs production dependencies in the bundle
 *
 * Usage: node scripts/tauri-build.mjs
 */

import { execSync } from "child_process";
import { cpSync, mkdirSync, rmSync, existsSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const RESOURCES = join(ROOT, "tauri", "resources", "aios");

console.log("[tauri-build] Step 1/4: Baking i18n tokens...");
execSync(`node --import tsx ${join(ROOT, "scripts/start.ts")} en --force`, {
  cwd: ROOT,
  stdio: "inherit",
  timeout: 60_000,
});

console.log("[tauri-build] Step 2/4: Building frontend...");
execSync("node_modules/.bin/vite build --config gui/vite.config.ts gui", {
  cwd: ROOT,
  stdio: "inherit",
  timeout: 120_000,
});

console.log("[tauri-build] Step 3/4: Copying application bundle...");
// Clean previous bundle
if (existsSync(RESOURCES)) {
  rmSync(RESOURCES, { recursive: true });
}
mkdirSync(RESOURCES, { recursive: true });

// Copy essential directories and files
const copyList = [
  ["server", "server"],
  ["gui/dist", "gui/dist"],
  ["language", "language"],
  ["scripts", "scripts"],
  ["skills", "skills"],
  ["package.json", "package.json"],
  ["package-lock.json", "package-lock.json"],
  ["tsconfig.json", "tsconfig.json"],
];

for (const [src, dest] of copyList) {
  const srcPath = join(ROOT, src);
  const destPath = join(RESOURCES, dest);
  if (existsSync(srcPath)) {
    cpSync(srcPath, destPath, { recursive: true });
    console.log(`  ✓ ${src} → ${dest}`);
  } else {
    console.warn(`  ⚠ ${src} not found, skipping`);
  }
}

console.log("[tauri-build] Step 4/4: Installing production dependencies...");
execSync("npm install --omit=dev", {
  cwd: RESOURCES,
  stdio: "inherit",
  timeout: 120_000,
});

console.log("[tauri-build] Bundle prepared at", RESOURCES);
console.log("[tauri-build] Ready for `cargo tauri build`");
