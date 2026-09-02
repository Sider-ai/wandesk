// 应用注册表 = 目录扫描。没有数组,没有 import 清单。
//
//   <workspace>/apps/<id>/
//     app.json    manifest —— 四个字段:id / name / icon / mounts
//     APP.md      给 AI 看的说明:第一段是一句话简介,内核把它注入每次 AI 调用的提示词
//     server.js   Worker:export default { async fetch(req, env) {…} }
//     public/     静态资源(env.ASSETS 读这里)
//     data.db     数据 —— 指向 .wandesk/store/ 里真实库的链接(env.DB 在 workerd 的 AppStore 里执行)
//
// 「安装」= 目录存在;「移除」= 删目录。AI 用 write 工具即可造应用,宿主零改动。
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { appsDir } from "../paths.js";

const APP_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;
const ROUTE = /^\/[\w./-]*$/;

export type AppInfo = {
  id: string;
  name: string;
  icon: string;
  description: string;
  /** 挂载点 = 应用内的路由路径,不是文件名。window 开窗口,panel 钉侧栏。 */
  mounts: { window?: string; panel?: string };
  dir: string;
  /** APP.md 全文(没有就是空串)。 */
  doc: string;
};

/** APP.md 的第一段正文(跳过标题与空行)—— 用作一句话简介。 */
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
    if (!fs.existsSync(path.join(dir, "server.js"))) return null; // 应用即网站:server.js 必备
    const mounts: AppInfo["mounts"] = {};
    for (const key of ["window", "panel"] as const) {
      const route = raw?.mounts?.[key];
      if (typeof route === "string" && ROUTE.test(route) && !route.includes("..")) mounts[key] = route;
    }
    if (!mounts.window && !mounts.panel) mounts.window = "/"; // 没写就默认开窗口、走根路径
    let doc = "";
    try { doc = fs.readFileSync(path.join(dir, "APP.md"), "utf8"); } catch { /* 没写说明 */ }
    return {
      id,
      name: String(raw?.name || id).slice(0, 32),
      icon: String(raw?.icon || "📦").slice(0, 8),
      description: String(raw?.description || firstParagraph(doc)).slice(0, 200),
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
 * 注入提示词的「已安装应用」清单 —— 像 SKILL.md 一样只给名字和一句话,
 * 详情让模型自己 read apps/<id>/APP.md。内核不认识任何应用,它只是把目录念一遍。
 */
export const appsBlock = (): string => {
  const apps = listApps();
  if (!apps.length) return "";
  const lines = apps.map((a) => `- ${a.icon} ${a.name}(${a.id})${a.description ? ":" + a.description : ""}`).join("\n");
  return `\n\n# 桌面上已安装的应用(内核注入)\n工作区 apps/<id>/ 一个目录一个应用;每个目录里的 APP.md 是它的完整说明,需要细节时 read 它。\n${lines}`;
};

export const getApp = (appId: string): AppInfo | null =>
  APP_ID.test(String(appId || "")) ? listApps().find((a) => a.id === appId) ?? null : null;

/** 应用后端代码 + 版本键(内容哈希 —— 改完 server.js,下次请求就是新版,不重启)。 */
export const appServerCode = (appId: string) => {
  const app = getApp(appId);
  if (!app) return null;
  try {
    const code = fs.readFileSync(path.join(app.dir, "server.js"), "utf8");
    return { code, version: createHash("sha256").update(code).digest("hex").slice(0, 16) };
  } catch { return null; }
};

/** env.ASSETS 的执行端:读 apps/<id>/public/,base64 回传(二进制安全)。 */
export const appAsset = (appId: string, rel: string): string | null => {
  const app = getApp(appId);
  if (!app) return null;
  const base = path.join(app.dir, "public");
  const abs = path.normalize(path.join(base, rel.replace(/^\/+/, "")));
  if (!abs.startsWith(base + path.sep) && abs !== base) return null; // 路径穿越防护
  try {
    const stat = fs.statSync(abs);
    if (!stat.isFile() || stat.size > 20 * 1024 * 1024) return null;
    return fs.readFileSync(abs).toString("base64");
  } catch { return null; }
};

/** 应用目录里的 data.db:指向 AppStore 真实文件的链接。 */
export const appDbPath = (appId: string): string | null => {
  const app = getApp(appId);
  return app ? path.join(app.dir, "data.db") : null;
};
