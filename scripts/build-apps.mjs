// 批量构建所有带 src/ 的预装应用:每个应用在自己目录里跑 build.mjs。
// 仓库根的 node_modules 里有 esbuild / react,Node 向上查找就能解析到 —— 和用户在工作区里
// `npm install` 后的解析结果一样,构建脚本本身一行不差。
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const APPS = path.resolve(import.meta.dirname, "../apps");
const ids = fs.readdirSync(APPS).filter((id) => fs.existsSync(path.join(APPS, id, "build.mjs"))).sort();
for (const id of ids) execFileSync(process.execPath, ["build.mjs"], { cwd: path.join(APPS, id), stdio: "inherit" });
console.log(`\n构建了 ${ids.length} 个应用`);
