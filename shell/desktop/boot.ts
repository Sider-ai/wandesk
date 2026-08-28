// Electron 主进程拉起内核:挑一个空闲端口,起子进程,等它就绪。
//
// 内核是独立进程,不跑在 Electron 主进程里 —— 它要 spawn workerd、要开 SQLite,
// 崩了不该带走窗口。
import { spawn, type ChildProcess } from "child_process";
import net from "net";
import path from "path";

let child: ChildProcess | null = null;

const pickPort = () => new Promise<number>((resolve, reject) => {
  const probe = net.createServer();
  probe.once("error", reject);
  probe.listen(0, "127.0.0.1", () => {
    const address = probe.address();
    const port = typeof address === "object" && address ? address.port : 0;
    probe.close(() => resolve(port));
  });
});

const waitHealthy = async (port: number, timeoutMs = 20000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/health`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) return true;
    } catch { /* 还没起来 */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
};

/** 起内核,返回它的地址。窗口指向这里。 */
export const startKernel = async (home: string): Promise<string> => {
  const port = await pickPort();
  child = spawn(process.execPath, [path.join(home, "dist/kernel/index.js")], {
    env: { ...process.env, WANDESK_PORT: String(port), WANDESK_HOME: home, ELECTRON_RUN_AS_NODE: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout?.on("data", (c) => process.stdout.write(`[kernel] ${c}`));
  child.stderr?.on("data", (c) => process.stderr.write(`[kernel] ${c}`));
  if (!(await waitHealthy(port))) throw new Error("内核未能就绪");
  return `http://127.0.0.1:${port}`;
};

export const stopKernel = () => {
  if (child) { try { child.kill("SIGTERM"); } catch { /* 已退出 */ } child = null; }
};
