// 打 macOS 应用:构建 → 带上 workerd 二进制 → electron-builder 出 .app(发行模式再签名、公证、出 dmg)。
//
//   npm run dist:mac            自用:dir 目标,本机有 Developer ID 就顺手签,不公证
//   npm run dist:mac:release    发行:APPLE_SIGN_IDENTITY + APPLE_NOTARY_PROFILE,签名 + 公证 + dmg
//
// 环境变量名沿用 wandesk-client 的约定;这里把它们翻译成 electron-builder 认的 CSC_NAME / APPLE_KEYCHAIN_PROFILE。
// 图标与 entitlements 在 build/(见 build/README.md)。
import { execSync } from "child_process";
import fs from "fs";

const release = process.argv.includes("--release");
const run = (cmd, env = {}) => { console.log(`\n$ ${cmd}`); execSync(cmd, { stdio: "inherit", env: { ...process.env, ...env } }); };
const capture = (cmd) => execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString();

// ── 发行模式:先把签名与公证凭据验清楚,别等 electron-builder 跑完才发现 ──
const signEnv = {};
if (release) {
  const identity = process.env.APPLE_SIGN_IDENTITY;
  const profile = process.env.APPLE_NOTARY_PROFILE;
  if (!identity) throw new Error('缺 APPLE_SIGN_IDENTITY(如 "Developer ID Application: Your Team (TEAMID)")');
  if (!profile) throw new Error("缺 APPLE_NOTARY_PROFILE(xcrun notarytool store-credentials 存的 keychain profile 名)");
  if (!capture("security find-identity -v -p codesigning").includes(identity)) throw new Error(`钥匙串里没有签名证书:${identity}`);
  try { capture(`xcrun notarytool history --keychain-profile "${profile}"`); } catch { throw new Error(`notarytool 找不到配置:${profile}`); }
  signEnv.CSC_NAME = identity;
  signEnv.APPLE_KEYCHAIN_PROFILE = profile;
  console.log(`签名:${identity}\n公证:${profile}`);
}

run("npm run build");

// workerd 随包发:supervisor 优先找 runtime/bin/,找不到才回落 node_modules(开发态)
const src = "node_modules/@cloudflare/workerd-darwin-arm64/bin/workerd";
if (!fs.existsSync(src)) throw new Error(`没找到 workerd:${src}`);
fs.mkdirSync("runtime/bin", { recursive: true });
fs.copyFileSync(src, "runtime/bin/workerd");
fs.chmodSync("runtime/bin/workerd", 0o755);
console.log(`\nworkerd 已就位:${(fs.statSync("runtime/bin/workerd").size / 1024 / 1024).toFixed(0)}MB`);

// electron-builder 会给包里所有 Mach-O(含 workerd)签名;有 APPLE_KEYCHAIN_PROFILE 就顺带公证 + 装订
run(`electron-builder --mac --arm64 --config.mac.target=${release ? "dir,dmg" : "dir"}`, signEnv);

const app = "release/mac-arm64/Wandesk.app";
if (!fs.existsSync(app)) throw new Error("没有生成 .app");

if (release) {
  run(`codesign --verify --deep --strict --verbose=2 "${app}"`);
  run(`xcrun stapler validate "${app}"`);
  try { run(`spctl -a -vv "${app}"`); } catch { console.warn("spctl 未通过 —— 公证结果以 stapler validate 为准"); }
}

console.log(`\n✅ ${app}`);
console.log(`   ${capture(`du -sh "${app}"`).trim()}`);
for (const f of fs.readdirSync("release").filter((n) => n.endsWith(".dmg"))) console.log(`✅ release/${f}`);
