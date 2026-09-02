// Preset app seeding: copies the bundled templates into the workspace's apps/ directory.
// Once seeded, it's just a regular app — editable, deletable, no different from one the user built themselves.
//
// Upgrade rule (only one): **untouched by the user follows the new bundled version; touched by the user, never touched again.**
// Judged by a content fingerprint: the fingerprint at the last seeding is recorded, and recomputed from disk on this boot.
//   Match = the user never changed it → replace it when the bundled version changes;
//   Mismatch = the user (or the AI) changed it → it's their app now, never overwrite it.
// data.db (the symlink to the database) is excluded from the fingerprint — data is always changing and shouldn't count as "modified".
// public/ (build output from source) and node_modules/ are also excluded — installing dependencies or rebuilding doesn't count as modifying the app.
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { appsDir, kernelDir, presetAppsDir } from "../paths.js";

const STAMP = () => path.join(kernelDir(), "preinstall.json");
const SKIP = /^data\.db$/;
const SKIP_DIR = /^(node_modules|public)$/;

/** Directory content fingerprint: relative path + content, sorted and hashed together. */
const fingerprint = (dir: string): string => {
  const hash = createHash("sha256");
  const walk = (rel: string) => {
    const abs = path.join(dir, rel);
    for (const entry of fs.readdirSync(abs, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (SKIP.test(entry.name)) continue;
      if (entry.isDirectory() && !rel && SKIP_DIR.test(entry.name)) continue; // only skip these two at the app root
      const next = rel ? path.join(rel, entry.name) : entry.name;
      if (entry.isDirectory()) walk(next);
      else { hash.update(next); hash.update(fs.readFileSync(path.join(dir, next))); }
    }
  };
  try { walk(""); } catch { return ""; }
  return hash.digest("hex").slice(0, 16);
};

const readStamp = (): Record<string, string> => {
  try { return JSON.parse(fs.readFileSync(STAMP(), "utf8")); } catch { return {}; }
};
const writeStamp = (data: Record<string, string>) => {
  try { fs.writeFileSync(STAMP(), JSON.stringify(data, null, 2)); } catch { /* only affects the next upgrade check */ }
};

export const seedPresetApps = () => {
  const presets = presetAppsDir();
  let entries: fs.Dirent[];
  try { entries = fs.readdirSync(presets, { withFileTypes: true }); } catch { return; }

  const stamp = readStamp();
  let changed = false;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const from = path.join(presets, entry.name);
    const to = path.join(appsDir(), entry.name);
    const shipped = fingerprint(from);

    if (!fs.existsSync(to)) {
      try {
        fs.cpSync(from, to, { recursive: true });
        stamp[entry.name] = shipped; changed = true;
        console.log(`[apps] preset app seeded: apps/${entry.name}`);
      } catch (e: any) {
        console.error(`[apps] failed to seed ${entry.name}:`, e?.message);
      }
      continue;
    }

    if (stamp[entry.name] === shipped) continue;              // already up to date
    if (stamp[entry.name] !== fingerprint(to)) continue;      // user modified it — leave it alone

    try {
      // Replace only code and assets; leave the data.db symlink in place (the user's data must not follow the version)
      for (const name of fs.readdirSync(to)) {
        if (SKIP.test(name) || name === "node_modules") continue; // keep the dependencies the user installed
        fs.rmSync(path.join(to, name), { recursive: true, force: true });
      }
      for (const name of fs.readdirSync(from)) {
        fs.cpSync(path.join(from, name), path.join(to, name), { recursive: true });
      }
      stamp[entry.name] = shipped; changed = true;
      console.log(`[apps] preset app updated: apps/${entry.name}`);
    } catch (e: any) {
      console.error(`[apps] failed to update ${entry.name}:`, e?.message);
    }
  }

  if (changed) writeStamp(stamp);
};
