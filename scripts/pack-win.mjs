// Packages the Windows app: build → bundle workerd.exe → electron-builder produces an nsis
// installer + an unpacked directory.
//
//   npm run dist:win            Run this on a Windows machine; produces release/Wandesk_<version>_x64.exe and release/win-unpacked/
//
// Can only be packaged on Windows: workerd.exe comes from @cloudflare/workerd-windows-64, and npm
// only installs it on Windows.
// Code signing (optional): set CSC_LINK / CSC_KEY_PASSWORD and electron-builder will automatically sign every exe.
import { execSync } from "child_process";
import fs from "fs";

if (process.platform !== "win32") throw new Error("dist:win can only be run on Windows (workerd.exe can only be installed on Windows)");

const run = (cmd) => { console.log(`\n$ ${cmd}`); execSync(cmd, { stdio: "inherit" }); };

run("npm run build");

// workerd ships with the package: supervisor looks in runtime/bin/workerd.exe first, falling back to node_modules only in dev mode
const src = "node_modules/@cloudflare/workerd-windows-64/bin/workerd.exe";
if (!fs.existsSync(src)) throw new Error(`workerd.exe not found: ${src} (run npm install first)`);
fs.mkdirSync("runtime/bin", { recursive: true });
fs.copyFileSync(src, "runtime/bin/workerd.exe");
console.log(`\nworkerd is in place: ${(fs.statSync("runtime/bin/workerd.exe").size / 1024 / 1024).toFixed(0)}MB`);

run("electron-builder --win --x64");

const out = fs.readdirSync("release").filter((n) => n.endsWith(".exe"));
if (!out.length) throw new Error("No installer was produced");
for (const f of out) console.log(`✅ release/${f}`);
