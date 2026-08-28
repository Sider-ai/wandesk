// 生产态托管壳的前端产物。开发态由 vite 顶上,这里不会被走到。
import fs from "fs";
import path from "path";
import type { ServerResponse } from "http";
import { uiDistDir } from "./paths.js";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};

export const serveStatic = (urlPath: string, res: ServerResponse): boolean => {
  const root = uiDistDir();
  if (!fs.existsSync(root)) return false;
  let rel = decodeURIComponent(urlPath.split("?")[0]);
  if (rel.endsWith("/")) rel += "index.html";
  let abs = path.normalize(path.join(root, rel.replace(/^\/+/, "")));
  if (!abs.startsWith(root)) return false;
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) {
    abs = path.join(root, "index.html"); // SPA 兜底
    if (!fs.existsSync(abs)) return false;
  }
  res.writeHead(200, { "content-type": MIME[path.extname(abs)] || "application/octet-stream" });
  res.end(fs.readFileSync(abs));
  return true;
};
