// 打 Windows 应用:构建 → 带上 workerd.exe → electron-builder 出 nsis 安装包 + 免安装目录。
//
//   npm run dist:win            在 Windows 机器上跑;出 release/Wandesk_<版本>_x64.exe 与 release/win-unpacked/
//
// 只能在 Windows 上打:workerd.exe 来自 @cloudflare/workerd-windows-64,npm 只会在 Windows 上装它。
// 代码签名(可选):设 CSC_LINK / CSC_KEY_PASSWORD,electron-builder 会自动签所有 exe。
import { execSync } from "child_process";
import fs from "fs";

if (process.platform !== "win32") throw new Error("dist:win 只能在 Windows 上跑(workerd.exe 只在 Windows 上可装)");

const run = (cmd) => { console.log(`\n$ ${cmd}`); execSync(cmd, { stdio: "inherit" }); };

run("npm run build");

// workerd 随包发:supervisor 优先找 runtime/bin/workerd.exe,找不到才回落 node_modules(开发态)
const src = "node_modules/@cloudflare/workerd-windows-64/bin/workerd.exe";
if (!fs.existsSync(src)) throw new Error(`没找到 workerd.exe:${src}(先 npm install)`);
fs.mkdirSync("runtime/bin", { recursive: true });
fs.copyFileSync(src, "runtime/bin/workerd.exe");
console.log(`\nworkerd 已就位:${(fs.statSync("runtime/bin/workerd.exe").size / 1024 / 1024).toFixed(0)}MB`);

run("electron-builder --win --x64");

const out = fs.readdirSync("release").filter((n) => n.endsWith(".exe"));
if (!out.length) throw new Error("没有生成安装包");
for (const f of out) console.log(`✅ release/${f}`);
