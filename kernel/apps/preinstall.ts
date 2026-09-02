// 预装应用落地:随包的模板复制进工作区的 apps/。
// 落地之后它就是普通应用 —— 可改可删,与用户自己造的没有任何区别。
//
// 升级规则(只有一条):**用户没动过的,跟着新版走;动过的,一个字都不碰。**
// 判据是内容指纹:上次落地时记下指纹,这次开机先算一遍磁盘上的。
//   一致 = 用户没改过 → 随包版本变了就替换;
//   不一致 = 用户(或 AI)改过 → 那是他的应用了,永不覆盖。
// data.db(指向库的链接)不进指纹 —— 数据本来就一直在变,不能当作「被改过」。
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { appsDir, kernelDir, presetAppsDir } from "../paths.js";

const STAMP = () => path.join(kernelDir(), "preinstall.json");
const SKIP = /^data\.db$/;

/** 目录内容指纹:相对路径 + 内容,排序后一起哈希。 */
const fingerprint = (dir: string): string => {
  const hash = createHash("sha256");
  const walk = (rel: string) => {
    const abs = path.join(dir, rel);
    for (const entry of fs.readdirSync(abs, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (SKIP.test(entry.name)) continue;
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
  try { fs.writeFileSync(STAMP(), JSON.stringify(data, null, 2)); } catch { /* 只影响下次升级判定 */ }
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
        console.log(`[apps] 预装应用已落地:apps/${entry.name}`);
      } catch (e: any) {
        console.error(`[apps] 落地失败 ${entry.name}:`, e?.message);
      }
      continue;
    }

    if (stamp[entry.name] === shipped) continue;              // 已是最新
    if (stamp[entry.name] !== fingerprint(to)) continue;      // 用户改过 —— 不碰

    try {
      // 只替换代码与资源,data.db 链接留在原地(用户的数据不能跟着版本走)
      for (const name of fs.readdirSync(to)) {
        if (SKIP.test(name)) continue;
        fs.rmSync(path.join(to, name), { recursive: true, force: true });
      }
      for (const name of fs.readdirSync(from)) {
        fs.cpSync(path.join(from, name), path.join(to, name), { recursive: true });
      }
      stamp[entry.name] = shipped; changed = true;
      console.log(`[apps] 预装应用已更新:apps/${entry.name}`);
    } catch (e: any) {
      console.error(`[apps] 更新失败 ${entry.name}:`, e?.message);
    }
  }

  if (changed) writeStamp(stamp);
};
