#!/usr/bin/env node

// 干净运行 Wandesk OSS,不污染源码。
//
// 为什么需要这个:`npm run dev` 会就地烤(把 __T_ token 替换成字面量),
// 直接在仓库根跑会把 tracked 源码改脏。这里把仓库根 rsync 到一次性副本
// wandesk-test/run/(已 gitignore),在副本里烤 + 跑,源码保持干净的 token 态。
//
// 用法(在 wandesk-test/ 下):
//   node test.js r1        # 同步 -> run/,保 db/deps,起 dev(默认 en)
//   node test.js r2        # 同步 + 清 db,保 deps,起 dev
//   node test.js r3        # 同步 + 清 db + npm install,起 dev
//   AIOS_LANG=zh node test.js r1   # 烤中文

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname;
const sourceDir = path.resolve(rootDir, "..");        // OSS 仓库根 = 源
const targetDir = path.join(rootDir, "run");          // 一次性运行副本(gitignored)
const databaseDir = path.join(targetDir, "database");
const runtimeDirs = [
  path.join(targetDir, "files", "tmp"),
  path.join(targetDir, "files", "uploads"),
  path.join(targetDir, "files", "exports")
];
const ports = ["5173", "9502", "9503"];

const typeAliases = new Map([
  ["r1", "run"], ["run", "run"], ["start", "run"],
  ["r2", "clean"], ["clean", "clean"], ["reset", "clean"],
  ["r3", "install"], ["install", "install"], ["deps", "install"]
]);

function printHelp() {
  console.log(`Usage (run inside wandesk-test/):
  node test.js r1     sync repo -> run/, keep data/deps, start dev
  node test.js r2     sync, clear database/runtime, keep deps, start dev
  node test.js r3     sync, clear database/runtime, npm install, start dev

Default bakes English. Set AIOS_LANG=zh to bake Chinese.
The repo source stays clean (tokens intact); only run/ gets baked.`);
}

function readArgs(argv) {
  const options = { type: "run", lang: process.env.AIOS_LANG || "en" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") { options.help = true; continue; }
    if (arg === "--lang" || arg === "-l") { options.lang = argv[index + 1] || ""; index += 1; continue; }
    if (arg.startsWith("--lang=")) { options.lang = arg.slice("--lang=".length); continue; }
    if (!arg.startsWith("-")) { options.type = arg; continue; }
    console.error(`[wandesk-test] unknown option: ${arg}`);
    process.exit(1);
  }
  options.type = typeAliases.get(String(options.type || "").trim()) || "";
  if (!options.type) {
    console.error("[wandesk-test] invalid type. Use r1 / r2 / r3 (run / clean / install).");
    process.exit(1);
  }
  if (!options.lang) options.lang = "en";
  return options;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function ensureSource() {
  if (fs.existsSync(path.join(sourceDir, "package.json"))) return;
  console.error(`[wandesk-test] source repo not found: ${sourceDir}`);
  process.exit(1);
}

function ensureTarget() { fs.mkdirSync(targetDir, { recursive: true }); }

function stopDevPorts() {
  for (const port of ports) {
    run("bash", ["-lc", `lsof -ti tcp:${port} 2>/dev/null | xargs -r kill -9 || true`]);
  }
}

function clearDirectoryContents(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  for (const entry of fs.readdirSync(dirPath)) {
    fs.rmSync(path.join(dirPath, entry), { recursive: true, force: true });
  }
}

function clearDatabaseFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) { clearDatabaseFiles(fullPath); continue; }
    if (entry.name.endsWith(".db") || entry.name.includes(".db-")) {
      fs.rmSync(fullPath, { force: true });
    }
  }
}

function clearRuntimeState() {
  clearDatabaseFiles(databaseDir);
  for (const dir of runtimeDirs) clearDirectoryContents(dir);
}

function syncProject() {
  run("rsync", [
    "-a", "--delete",
    "--exclude", "/.git",
    "--exclude", "/node_modules",
    "--exclude", "/wandesk-test",   // 排除自己,避免递归
    "--exclude", "/database",
    "--exclude", "/files",
    "--exclude", "/dist",
    "--exclude", "/gui/dist",
    "--exclude", "/.aios",
    "--exclude", ".DS_Store",
    "--exclude", "model*.json",
    `${sourceDir}/`,
    `${targetDir}/`
  ]);
}

function installDeps() { run("npm", ["install"], { cwd: targetDir }); }

function runDev(language) {
  const script = String(language).toLowerCase() === "zh" ? "dev:zh" : "dev";
  run("npm", ["run", script], { cwd: targetDir, env: { ...process.env, AIOS_LANG: language } });
}

const options = readArgs(process.argv.slice(2));
if (options.help) { printHelp(); process.exit(0); }

ensureSource();
ensureTarget();
stopDevPorts();
if (options.type === "clean" || options.type === "install") clearRuntimeState();
syncProject();
if (options.type === "install") installDeps();
runDev(options.lang);
