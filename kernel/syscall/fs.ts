// env.FS —— 用户的真实文件。
//
// 一律锁在工作区里:应用给的路径是相对工作区根的,穿越 (..) 直接拒。
// 这不是权限门(能力全开),是「应用的路径不该指到用户工作区之外」这条约定。
// AI 的 bash 工具不受这条约束 —— 它本来就是全功能的。
import fs from "fs";
import path from "path";
import { workspace } from "../paths.js";

const MAX_READ_BYTES = 20 * 1024 * 1024;

const resolve = (rel: string): string => {
  const root = workspace();
  const abs = path.normalize(path.join(root, String(rel || "").replace(/^\/+/, "")));
  if (abs !== root && !abs.startsWith(root + path.sep)) throw new Error("路径越出工作区");
  return abs;
};

export const fsList = (rel = "") => {
  const abs = resolve(rel);
  return fs.readdirSync(abs, { withFileTypes: true }).map((e) => {
    const full = path.join(abs, e.name);
    let size = 0, mtime = "";
    try { const st = fs.statSync(full); size = st.size; mtime = st.mtime.toISOString(); } catch { /* 断链 */ }
    return { name: e.name, dir: e.isDirectory(), size, mtime, path: path.relative(workspace(), full) };
  });
};

export const fsRead = (rel: string) => {
  const abs = resolve(rel);
  const st = fs.statSync(abs);
  if (!st.isFile()) throw new Error("不是文件");
  if (st.size > MAX_READ_BYTES) throw new Error("文件过大(上限 20MB)");
  return fs.readFileSync(abs, "utf8");
};

export const fsReadBase64 = (rel: string) => {
  const abs = resolve(rel);
  if (fs.statSync(abs).size > MAX_READ_BYTES) throw new Error("文件过大(上限 20MB)");
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
  if (abs === workspace()) throw new Error("不能删除工作区根");
  fs.rmSync(abs, { recursive: true, force: true });
  return { ok: true };
};
