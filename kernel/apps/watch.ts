// 盯着 apps/ 目录 —— 「安装 = 目录存在」意味着注册表随时会变:
// AI 用 write 造了个应用,壳应该立刻看到它,而不是等用户手动刷新。
import fs from "fs";
import { appsDir } from "../paths.js";
import { EV } from "../shared/events.js";
import { broadcast } from "../realtime.js";
import { closeAppDb } from "../syscall/db.js";

export const watchApps = () => {
  let timer: NodeJS.Timeout | null = null;
  try {
    fs.watch(appsDir(), { recursive: true }, (_event, filename) => {
      // 目录被删/改名后旧句柄还指着已删除的 inode,必须作废
      const id = String(filename || "").split("/")[0];
      if (id) closeAppDb(id);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => broadcast(EV.APPS_CHANGED, {}), 300); // 防抖:一次写入会触发多个事件
    });
  } catch (e: any) {
    console.error("[apps] 目录监听失败(需手动刷新):", e?.message);
  }
};
