// 盯着 apps/ 目录 —— 「安装 = 目录存在」意味着注册表随时会变:
// AI 用 write 造了个应用,壳应该立刻看到它,而不是等用户手动刷新。
import fs from "fs";
import { appsDir } from "../paths.js";
import { EV } from "../shared/events.js";
import { broadcast } from "../realtime.js";

export const watchApps = () => {
  let timer: NodeJS.Timeout | null = null;
  try {
    fs.watch(appsDir(), { recursive: true }, (_event, filename) => {
      // 用户在应用目录里 npm install 会刷出成千上万个事件,那不是应用变了
      if (String(filename || "").split(/[\\/]/).includes("node_modules")) return;
      // 应用的库在 workerd 手里(AppStore),内核这边没有句柄要作废
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => broadcast(EV.APPS_CHANGED, {}), 300); // 防抖:一次写入会触发多个事件
    });
  } catch (e: any) {
    console.error("[apps] 目录监听失败(需手动刷新):", e?.message);
  }
};
