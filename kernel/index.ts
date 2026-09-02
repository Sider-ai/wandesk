// Kernel entry point.
//
// Startup order matters: start listening first (workerd's NODE external-service binding needs
// to be able to loop back immediately), then bring up workerd.
// Doing it the other way round deadlocks —— overseer comes up and immediately wants a token from
// the kernel, but the kernel isn't listening yet.
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

// A long-running service needs to be resilient to stay alive —— these two handlers were carried
// over from AGENT's web/server/index.js.
// The conversation surface's run loop spins in the background; one uncaught rejection in there
// would otherwise take down the entire kernel process (Node's default unhandledRejection behavior
// is to exit), and once the kernel dies every app window goes blank along with it.
process.on("uncaughtException", (error) => console.error("[kernel] Uncaught exception:", error));
process.on("unhandledRejection", (reason) => console.error("[kernel] Unhandled promise rejection:", reason));

server.listen(KERNEL_PORT, "127.0.0.1", async () => {
  db();                 // Create the database / apply missing tables
  seedPresetApps();     // Land the preinstalled apps in the workspace
  watchApps();          // apps/ directory changes → notify the shell to reload
  console.log(`[kernel] Workspace: ${workspace()}`);
  console.log(`[kernel] Ready: http://127.0.0.1:${KERNEL_PORT}`);
  await startRuntime(KERNEL_PORT);
});
