// workerd 的进程管理:生成配置 → 拉起 → 健康检查 → 随内核退出。
//
//   内核(Node) ──spawn──▶ workerd(入口 worker = overseer)
//     ▲   NODE 外部服务绑定(回环 127.0.0.1:<kernelPort>,syscall 的执行端)
//     └── 壳的 iframe 直接指向 http://127.0.0.1:<runtimePort>/app/<token>/
//
// 起不来不拖垮内核 —— 只是应用不可用,壳照常显示并给出提示。
import { spawn, type ChildProcess } from "child_process";
import fs from "fs";
import net from "net";
import path from "path";
import { HOME } from "../kernel/paths.js";

let child: ChildProcess | null = null;
let origin: string | null = null;

const workerdBin = () => {
  if (process.env.WANDESK_WORKERD) return process.env.WANDESK_WORKERD;
  const platform = `${process.platform}-${process.arch}`;
  const packaged = path.join(HOME, "runtime/bin", process.platform === "win32" ? "workerd.exe" : "workerd");
  if (fs.existsSync(packaged)) return packaged;
  return path.join(HOME, `node_modules/@cloudflare/workerd-${platform}/bin/workerd`); // 开发态
};

const overseerBundle = () => process.env.WANDESK_OVERSEER || path.join(HOME, "dist/overseer.js");

const pickPort = () => new Promise<number>((resolve, reject) => {
  const probe = net.createServer();
  probe.once("error", reject);
  probe.listen(0, "127.0.0.1", () => {
    const address = probe.address();
    const port = typeof address === "object" && address ? address.port : 0;
    probe.close(() => resolve(port));
  });
});

const buildConfig = (kernelPort: number, runtimePort: number) => `# 由 Wandesk 启动时生成,勿手改(runtime/supervisor.ts)
using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    ( name = "overseer",
      worker = (
        modules = [ ( name = "overseer.js", esModule = embed "overseer.js" ) ],
        compatibilityDate = "2026-02-01",
        bindings = [
          ( name = "LOADER", workerLoader = ( id = "apps" ) ),
          ( name = "NODE", service = "node" ),
        ],
      )
    ),
    ( name = "node", external = ( address = "127.0.0.1:${kernelPort}" ) ),
  ],
  sockets = [ ( name = "http", address = "127.0.0.1:${runtimePort}", http = (), service = "overseer" ) ]
);
`;

const waitHealthy = async (port: number, timeoutMs = 10000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/health`, { signal: AbortSignal.timeout(1000) });
      if (res.ok) return true;
    } catch { /* 还没起来 */ }
    if (child && child.exitCode !== null) return false;
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
};

export const startRuntime = async (kernelPort: number) => {
  try {
    const bin = workerdBin();
    const bundle = overseerBundle();
    if (!fs.existsSync(bin)) { console.log(`[runtime] 未找到 workerd(${bin}),应用不可用`); return; }
    if (!fs.existsSync(bundle)) { console.log("[runtime] 未找到 overseer 产物,先跑 npm run build:overseer"); return; }

    const dir = path.join(HOME, "runtime/generated");
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(bundle, path.join(dir, "overseer.js"));

    const runtimePort = await pickPort();
    const configPath = path.join(dir, "workerd.capnp");
    fs.writeFileSync(configPath, buildConfig(kernelPort, runtimePort));

    child = spawn(bin, ["serve", configPath, "--experimental"], { stdio: ["ignore", "pipe", "pipe"] });
    child.stdout?.setEncoding("utf8");
    child.stderr?.setEncoding("utf8");
    child.stdout?.on("data", (c: string) => process.stdout.write(`[workerd] ${c}`));
    child.stderr?.on("data", (c: string) => process.stderr.write(`[workerd] ${c}`));
    child.on("exit", (code) => {
      if (origin) console.error(`[runtime] workerd 退出(code ${code}),应用不可用`);
      child = null; origin = null;
    });

    if (await waitHealthy(runtimePort)) {
      origin = `http://127.0.0.1:${runtimePort}`;
      console.log(`[runtime] 应用运行时就绪:${origin}`);
    } else {
      console.error("[runtime] workerd 启动失败,应用不可用");
      try { child?.kill("SIGTERM"); } catch { /* 已退出 */ }
    }
  } catch (e: any) {
    console.error("[runtime] 启动异常:", e?.message);
  }
};

/** 壳靠它拼出每个应用的 iframe URL。null = 运行时不可用。 */
export const runtimeOrigin = () => origin;

export const stopRuntime = () => {
  origin = null;
  if (child) { try { child.kill("SIGTERM"); } catch { /* 已退出 */ } child = null; }
};

process.on("exit", stopRuntime);
process.on("SIGTERM", () => { stopRuntime(); process.exit(0); });
process.on("SIGINT", () => { stopRuntime(); process.exit(0); });
