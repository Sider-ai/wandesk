// The Electron main process brings up the kernel: pick a free port, spawn the child process, wait for it to be ready.
//
// The kernel is a separate process, never run inside the Electron main process —— it needs to spawn
// workerd and open SQLite, and if it crashes it shouldn't take the window down with it.
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
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
};

/** Starts the kernel and returns its address. The window points here. */
export const startKernel = async (home: string): Promise<string> => {
  const port = await pickPort();
  child = spawn(process.execPath, [path.join(home, "dist/kernel/index.js")], {
    env: { ...process.env, WANDESK_PORT: String(port), WANDESK_HOME: home, ELECTRON_RUN_AS_NODE: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout?.on("data", (c) => process.stdout.write(`[kernel] ${c}`));
  child.stderr?.on("data", (c) => process.stderr.write(`[kernel] ${c}`));
  if (!(await waitHealthy(port))) throw new Error("Kernel failed to become ready");
  return `http://127.0.0.1:${port}`;
};

export const stopKernel = () => {
  if (child) { try { child.kill("SIGTERM"); } catch { /* already exited */ } child = null; }
};
