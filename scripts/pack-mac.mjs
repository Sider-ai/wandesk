// 打 macOS 应用:构建 → 带上 workerd 二进制 → electron-builder 出 .app。
//
// 不签名、不公证 —— 自用双击即可(首次打开可能要在「系统设置 › 隐私与安全性」放行)。
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const run = (cmd) => { console.log(`\n$ ${cmd}`); execSync(cmd, { stdio: "inherit" }); };

run("npm run build");

// workerd 随包发:supervisor 优先找 runtime/bin/,找不到才回落 node_modules(开发态)
const src = "node_modules/@cloudflare/workerd-darwin-arm64/bin/workerd";
if (!fs.existsSync(src)) throw new Error(`没找到 workerd:${src}`);
fs.mkdirSync("runtime/bin", { recursive: true });
fs.copyFileSync(src, "runtime/bin/workerd");
fs.chmodSync("runtime/bin/workerd", 0o755);
console.log(`\nworkerd 已就位:${(fs.statSync("runtime/bin/workerd").size / 1024 / 1024).toFixed(0)}MB`);

run("electron-builder --mac --arm64 --config.mac.target=dir");

const app = "release/mac-arm64/Wandesk.app";
if (!fs.existsSync(app)) throw new Error("没有生成 .app");
console.log(`\n✅ ${app}`);
console.log(`   ${execSync(`du -sh ${app}`).toString().trim()}`);
