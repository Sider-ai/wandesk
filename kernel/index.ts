// 内核入口。
//
// 起顺序有讲究:先监听(workerd 的 NODE 外部服务绑定要能立刻回环),再拉 workerd。
// 反过来会死锁 —— overseer 起来就想问内核要 token,而内核还没在听。
import http from "http";
import { KERNEL_PORT } from "./config.js";
import { handleApi } from "./api/index.js";
import { handleUpgrade } from "./realtime.js";
import { serveStatic } from "./static.js";
import { db } from "./data/db.js";
import { seedPresetApps } from "./apps/preinstall.js";
import { watchApps } from "./apps/watch.js";
import { startRuntime } from "../runtime/supervisor.js";
import { workspace } from "./paths.js";

const server = http.createServer(async (req, res) => {
  try {
    if (await handleApi(req, res)) return;
    if (req.method === "GET" && serveStatic(new URL(req.url || "/", "http://x").pathname, res)) return;
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("not found");
  } catch (e: any) {
    console.error("[kernel]", e?.message || e);
    if (!res.headersSent) res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: String(e?.message || e) }));
  }
});

server.on("upgrade", (req, socket) => handleUpgrade(req, socket as never));

server.listen(KERNEL_PORT, "127.0.0.1", async () => {
  db();                 // 建库 / 补表
  seedPresetApps();     // 预装应用落地工作区
  watchApps();          // apps/ 目录变化 → 通知壳重拉
  console.log(`[kernel] 工作区:${workspace()}`);
  console.log(`[kernel] 就绪:http://127.0.0.1:${KERNEL_PORT}`);
  await startRuntime(KERNEL_PORT);
});
