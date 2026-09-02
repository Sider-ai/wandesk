// Packages the macOS app: build → bundle the workerd binary → electron-builder produces the .app
// (release mode also signs, notarizes, and produces a dmg).
//
//   npm run dist:mac            For personal use: dir target, signs opportunistically if this machine has a Developer ID, no notarization
//   npm run dist:mac:release    For release: APPLE_SIGN_IDENTITY + APPLE_NOTARY_PROFILE, sign + notarize + dmg
//
// The environment variable names follow wandesk-client's convention; here they're translated into
// the CSC_NAME / APPLE_KEYCHAIN_PROFILE names electron-builder expects.
// Icons and entitlements live under build/ (see build/README.md).
import { execSync } from "child_process";
import fs from "fs";

const release = process.argv.includes("--release");
const run = (cmd, env = {}) => { console.log(`\n$ ${cmd}`); execSync(cmd, { stdio: "inherit", env: { ...process.env, ...env } }); };
const capture = (cmd) => execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString();

// ── Release mode: verify signing and notarization credentials up front, don't wait for electron-builder to finish and find out then ──
const signEnv = {};
if (release) {
  const identity = process.env.APPLE_SIGN_IDENTITY;
  const profile = process.env.APPLE_NOTARY_PROFILE;
  if (!identity) throw new Error('Missing APPLE_SIGN_IDENTITY (e.g. "Developer ID Application: Your Team (TEAMID)")');
  if (!profile) throw new Error("Missing APPLE_NOTARY_PROFILE (the keychain profile name stored via xcrun notarytool store-credentials)");
  if (!capture("security find-identity -v -p codesigning").includes(identity)) throw new Error(`No signing certificate in the keychain: ${identity}`);
  try { capture(`xcrun notarytool history --keychain-profile "${profile}"`); } catch { throw new Error(`notarytool can't find the profile: ${profile}`); }
  signEnv.CSC_NAME = identity.replace(/^Developer ID Application:\s*/, ""); // electron-builder doesn't want the prefix
  signEnv.APPLE_KEYCHAIN_PROFILE = profile;
  console.log(`Signing: ${identity}\nNotarizing: ${profile}`);
}

run("npm run build");

// workerd ships with the package: supervisor looks in runtime/bin/ first, falling back to node_modules only in dev mode
const src = "node_modules/@cloudflare/workerd-darwin-arm64/bin/workerd";
if (!fs.existsSync(src)) throw new Error(`workerd not found: ${src}`);
fs.mkdirSync("runtime/bin", { recursive: true });
fs.copyFileSync(src, "runtime/bin/workerd");
fs.chmodSync("runtime/bin/workerd", 0o755);
console.log(`\nworkerd is in place: ${(fs.statSync("runtime/bin/workerd").size / 1024 / 1024).toFixed(0)}MB`);

// electron-builder signs every Mach-O in the bundle (including workerd); with APPLE_KEYCHAIN_PROFILE set it also notarizes + staples
run(`electron-builder --mac ${release ? "dir dmg" : "dir"} --arm64`, signEnv);

const app = "release/mac-arm64/Wandesk.app";
if (!fs.existsSync(app)) throw new Error("No .app was produced");

if (release) {
  run(`codesign --verify --deep --strict --verbose=2 "${app}"`);
  run(`xcrun stapler validate "${app}"`);
  try { run(`spctl -a -vv "${app}"`); } catch { console.warn("spctl did not pass —— trust stapler validate's result for notarization status"); }
}

// The dmg itself also gets signed + notarized + stapled: Gatekeeper checks the dmg first when a user
// downloads it, and without a staple it'll say "cannot be verified"
if (release) {
  for (const f of fs.readdirSync("release").filter((n) => n.endsWith(".dmg"))) {
    const dmg = `release/${f}`;
    run(`codesign --sign "${process.env.APPLE_SIGN_IDENTITY}" --timestamp --force "${dmg}"`);
    run(`xcrun notarytool submit "${dmg}" --keychain-profile "${process.env.APPLE_NOTARY_PROFILE}" --wait`);
    run(`xcrun stapler staple "${dmg}"`);
    run(`spctl -a -t open --context context:primary-signature -vv "${dmg}"`);
  }
}

console.log(`\n✅ ${app}`);
console.log(`   ${capture(`du -sh "${app}"`).trim()}`);
for (const f of fs.readdirSync("release").filter((n) => n.endsWith(".dmg"))) console.log(`✅ release/${f}`);
