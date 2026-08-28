// 预装应用落地:随包的模板复制进工作区的 apps/。
// 落地之后它就是普通应用 —— 可改可删,与用户自己造的没有任何区别。
// 已存在就不覆盖(哪怕用户改过),否则每次启动都会抹掉用户的修改。
import fs from "fs";
import path from "path";
import { appsDir, presetAppsDir } from "../paths.js";

export const seedPresetApps = () => {
  const presets = presetAppsDir();
  let entries: fs.Dirent[];
  try { entries = fs.readdirSync(presets, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const target = path.join(appsDir(), entry.name);
    if (fs.existsSync(target)) continue;
    try {
      fs.cpSync(path.join(presets, entry.name), target, { recursive: true });
      console.log(`[apps] 预装应用已落地:apps/${entry.name}`);
    } catch (e: any) {
      console.error(`[apps] 落地失败 ${entry.name}:`, e?.message);
    }
  }
};
