// The app registry = a directory scan. No array, no import manifest.
//
//   <workspace>/apps/<id>/
//     app.json    manifest — four fields: id / name / icon / mounts
//     APP.md      description for the AI: the first paragraph is a one-line summary the kernel injects into every AI call's prompt
//     server.js   Worker: export default { async fetch(req, env) {…} }
//     public/     static assets (env.ASSETS reads from here)
//     data.db     data — a symlink to the real database in .wandesk/store/ (env.DB runs inside workerd's AppStore)
//
// "Installed" = the directory exists; "removed" = the directory is deleted. The AI can build an app with just the write tool — zero host changes needed.
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { appsDir } from "../paths.js";
import { currentLanguage } from "../data/settings.js";

const APP_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;
const ROUTE = /^\/[\w./-]*$/;

export type AppInfo = {
  id: string;
  name: string;
  icon: string;
  description: string;
  /** Mount point = a route path inside the app, not a filename. "window" opens a window, "panel" pins a sidebar panel. */
  mounts: { window?: string; panel?: string };
  dir: string;
  /** The full text of APP.md (empty string if there isn't one). */
  doc: string;
};

/** app.json's name / description may be a plain string, or a bilingual { zh, en } object.
 *  Picked by the current UI language; falls back to zh if missing, then to whichever language is present. */
const localize = (raw: unknown): string => {
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    const lang = currentLanguage();
    const picked = o[lang] ?? o.zh ?? Object.values(o)[0];
    if (typeof picked === "string") return picked;
  }
  return "";
};

/** The first paragraph of APP.md (skipping the heading and blank lines) — used as the one-line summary. */
const firstParagraph = (doc: string): string => {
  const lines = doc.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && (lines[i].trim() === "" || lines[i].startsWith("#"))) i++;
  const out: string[] = [];
  while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#")) out.push(lines[i].trim()), i++;
  return out.join("");
};

const readManifest = (dir: string): AppInfo | null => {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(dir, "app.json"), "utf8"));
    const id = String(raw?.id || path.basename(dir)).toLowerCase();
    if (!APP_ID.test(id)) return null;
    if (!fs.existsSync(path.join(dir, "server.js"))) return null; // an app is a website: server.js is mandatory
    const mounts: AppInfo["mounts"] = {};
    for (const key of ["window", "panel"] as const) {
      const route = raw?.mounts?.[key];
      if (typeof route === "string" && ROUTE.test(route) && !route.includes("..")) mounts[key] = route;
    }
    if (!mounts.window && !mounts.panel) mounts.window = "/"; // default to opening a window at the root route if unset
    // If the language is "en" and the directory has APP.en.md, read that; otherwise read APP.md
    let doc = "";
    const lang = currentLanguage();
    if (lang === "en") {
      try { doc = fs.readFileSync(path.join(dir, "APP.en.md"), "utf8"); } catch { /* no English version */ }
    }
    if (!doc) {
      try { doc = fs.readFileSync(path.join(dir, "APP.md"), "utf8"); } catch { /* no description written */ }
    }
    return {
      id,
      name: (localize(raw?.name) || id).slice(0, 32),
      icon: String(raw?.icon || "📦").slice(0, 8),
      description: (localize(raw?.description) || firstParagraph(doc)).slice(0, 200),
      mounts,
      dir,
      doc,
    };
  } catch {
    return null;
  }
};

export const listApps = (): AppInfo[] => {
  let entries: fs.Dirent[];
  try { entries = fs.readdirSync(appsDir(), { withFileTypes: true }); } catch { return []; }
  const out: AppInfo[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    const app = readManifest(path.join(appsDir(), entry.name));
    if (app) out.push(app);
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
};

/**
 * The "installed apps" list injected into the prompt — like SKILL.md, it gives only the name and a one-liner;
 * details are left for the model to read itself via apps/<id>/APP.md. The kernel doesn't know any app — it just reads the directory listing aloud.
 */
export const appsBlock = (): string => {
  const apps = listApps();
  if (!apps.length) return "";
  const lines = apps.map((a) => `- ${a.icon} ${a.name} (${a.id})${a.description ? ": " + a.description : ""}`).join("\n");
  return `\n\n# Installed apps on the desktop (injected by the kernel)\nEach directory under apps/<id>/ in the workspace is one app; APP.md in each directory is its full description — read it when you need detail.\n${lines}`;
};

/** The language note injected into the prompt — tells the model which language to reply in. */
export const languageBlock = (): string =>
  "\n\n# User interface language\nThe user's interface language is English. Reply in English unless the user writes in another language.";

export const getApp = (appId: string): AppInfo | null =>
  APP_ID.test(String(appId || "")) ? listApps().find((a) => a.id === appId) ?? null : null;

/** App backend code + a version key (content hash — after editing server.js, the next request gets the new version, no restart needed). */
export const appServerCode = (appId: string) => {
  const app = getApp(appId);
  if (!app) return null;
  try {
    const code = fs.readFileSync(path.join(app.dir, "server.js"), "utf8");
    return { code, version: createHash("sha256").update(code).digest("hex").slice(0, 16) };
  } catch { return null; }
};

/** The execution side of env.ASSETS: reads from apps/<id>/public/ and returns it base64-encoded (binary-safe). */
export const appAsset = (appId: string, rel: string): string | null => {
  const app = getApp(appId);
  if (!app) return null;
  const base = path.join(app.dir, "public");
  const abs = path.normalize(path.join(base, rel.replace(/^\/+/, "")));
  if (!abs.startsWith(base + path.sep) && abs !== base) return null; // path traversal guard
  try {
    const stat = fs.statSync(abs);
    if (!stat.isFile() || stat.size > 20 * 1024 * 1024) return null;
    return fs.readFileSync(abs).toString("base64");
  } catch { return null; }
};

/** data.db inside the app directory: a symlink to the real file in the AppStore. */
export const appDbPath = (appId: string): string | null => {
  const app = getApp(appId);
  return app ? path.join(app.dir, "data.db") : null;
};
