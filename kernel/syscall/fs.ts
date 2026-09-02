// env.FS —— the user's real files.
//
// Always locked inside the workspace: a path from an app is relative to the workspace root, and
// any traversal (..) is flatly rejected. This isn't a permission gate (capabilities are fully
// open) — it's the convention that "an app's paths should never point outside the user's
// workspace." The AI's bash tool isn't bound by this — it's fully capable by design.
import fs from "fs";
import path from "path";
import { workspace } from "../paths.js";

const MAX_READ_BYTES = 20 * 1024 * 1024;

const resolve = (rel: string): string => {
  const root = workspace();
  const abs = path.normalize(path.join(root, String(rel || "").replace(/^\/+/, "")));
  if (abs !== root && !abs.startsWith(root + path.sep)) throw new Error("Path escapes the workspace");
  return abs;
};

export const fsList = (rel = "") => {
  const abs = resolve(rel);
  return fs.readdirSync(abs, { withFileTypes: true }).map((e) => {
    const full = path.join(abs, e.name);
    let size = 0, mtime = "";
    try { const st = fs.statSync(full); size = st.size; mtime = st.mtime.toISOString(); } catch { /* broken link */ }
    return { name: e.name, dir: e.isDirectory(), size, mtime, path: path.relative(workspace(), full) };
  });
};

export const fsRead = (rel: string) => {
  const abs = resolve(rel);
  const st = fs.statSync(abs);
  if (!st.isFile()) throw new Error("Not a file");
  if (st.size > MAX_READ_BYTES) throw new Error("File too large (20MB limit)");
  return fs.readFileSync(abs, "utf8");
};

export const fsReadBase64 = (rel: string) => {
  const abs = resolve(rel);
  if (fs.statSync(abs).size > MAX_READ_BYTES) throw new Error("File too large (20MB limit)");
  return fs.readFileSync(abs).toString("base64");
};

export const fsWrite = (rel: string, content: string) => {
  const abs = resolve(rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, String(content ?? ""), "utf8");
  return { path: path.relative(workspace(), abs) };
};

export const fsMkdir = (rel: string) => {
  fs.mkdirSync(resolve(rel), { recursive: true });
  return { ok: true };
};

export const fsDelete = (rel: string) => {
  const abs = resolve(rel);
  if (abs === workspace()) throw new Error("Cannot delete the workspace root");
  fs.rmSync(abs, { recursive: true, force: true });
  return { ok: true };
};
