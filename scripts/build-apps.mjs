// Bulk-builds every preinstalled app that has a src/ directory: each app runs its own build.mjs
// in its own directory. esbuild / react live in the repo root's node_modules, and Node's upward
// module resolution finds them there —— resolving the same way it would after the user runs
// `npm install` in the workspace, with no changes needed to the build script itself.
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const APPS = path.resolve(import.meta.dirname, "../apps");
const ids = fs.readdirSync(APPS).filter((id) => fs.existsSync(path.join(APPS, id, "build.mjs"))).sort();
for (const id of ids) execFileSync(process.execPath, ["build.mjs"], { cwd: path.join(APPS, id), stdio: "inherit" });
console.log(`\nBuilt ${ids.length} app(s)`);
