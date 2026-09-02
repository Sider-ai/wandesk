// workerd 的进程管理:生成配置 → 拉起 → 健康检查 → 随内核退出。
//
//   内核(Node) ──spawn──▶ workerd(入口 worker = overseer + AppStore DO)
//     ▲   NODE 外部服务绑定(回环 127.0.0.1:<kernelPort>,syscall 的执行端)
//     │   内核反过来调 workerd 的 /_wd/*(应用数据的内部路由),凭 WD_INTERNAL 令牌
//     └── 壳的 iframe 指向 http://<token>.localhost:<appPort>/ —— 每个应用一个真 origin
//
// 应用数据(env.DB)在 workerd 自己的 SQLite 里:<workspace>/.wandesk/store/<STORE_KEY>/<对象ID>.sqlite。
// 起不来不拖垮内核 —— 只是应用不可用,壳照常显示并给出提示。
import { spawn, type ChildProcess } from "child_process";
import { randomBytes } from "crypto";
import fs from "fs";
import net from "net";
import path from "path";
import { HOME, kernelDir } from "../kernel/paths.js";

let child: ChildProcess | null = null;
let origin: string | null = null;
let port: number | null = null;
let internalToken = "";

/** AppStore 命名空间的 uniqueKey:对象 ID 由它推导,**改了就找不到旧数据**。也是存储子目录名。 */
export const STORE_KEY = "wandesk-app-store-v1";

/** 应用数据的根目录(workerd 的 localDisk)。 */
export const storeDir = () => {
  const dir = path.join(kernelDir(), "store");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

/** 某个 AppStore 对象落盘的 SQLite 文件。对象 ID 问 overseer 要(/_wd/db/id)。 */
export const storeFile = (storeId: string) => path.join(storeDir(), STORE_KEY, `${storeId}.sqlite`);

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

const buildConfig = (kernelPort: number, runtimePort: number, store: string, token: string) => `# 由 Wandesk 启动时生成,勿手改(runtime/supervisor.ts)
using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [
    ( name = "overseer",
      worker = (
        modules = [ ( name = "overseer.js", esModule = embed "overseer.js" ) ],
        compatibilityDate = "2026-02-01",
        # env.DB 的家:每个应用一个 AppStore 对象,SQLite 落在 store 这个目录服务里
        durableObjectNamespaces = [ ( className = "AppStore", uniqueKey = "${STORE_KEY}", enableSql = true ) ],
        durableObjectStorage = ( localDisk = "store" ),
        bindings = [
          ( name = "LOADER", workerLoader = ( id = "apps" ) ),
          ( name = "NODE", service = "node" ),
          ( name = "STORE", durableObjectNamespace = "AppStore" ),
          ( name = "WD_INTERNAL", text = "${token}" ),
        ],
      )
    ),
    ( name = "node", external = ( address = "127.0.0.1:${kernelPort}" ) ),
    ( name = "store", disk = ( path = ${JSON.stringify(store)}, writable = true ) ),
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

    // 生成物写工作区,**不写安装目录** —— 打包后的 .app 可能在只读位置(/Applications、
    // 挂载的 dmg、被隔离的下载目录),往包里写会直接起不来。
    const dir = path.join(kernelDir(), "runtime");
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(bundle, path.join(dir, "overseer.js"));

    const appPort = await pickPort();
    internalToken = randomBytes(24).toString("hex"); // 每次启动一个新令牌,只活在内存和这份配置里
    const configPath = path.join(dir, "workerd.capnp");
    fs.writeFileSync(configPath, buildConfig(kernelPort, appPort, storeDir(), internalToken), { mode: 0o600 });

    child = spawn(bin, ["serve", configPath, "--experimental"], { stdio: ["ignore", "pipe", "pipe"] });
    child.stdout?.setEncoding("utf8");
    child.stderr?.setEncoding("utf8");
    child.stdout?.on("data", (c: string) => process.stdout.write(`[workerd] ${c}`));
    child.stderr?.on("data", (c: string) => process.stderr.write(`[workerd] ${c}`));
    child.on("exit", (code) => {
      if (origin) console.error(`[runtime] workerd 退出(code ${code}),应用不可用`);
      child = null; origin = null;
    });

    if (await waitHealthy(appPort)) {
      origin = `http://127.0.0.1:${appPort}`;
      port = appPort;
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
/** 应用的 origin 是 `<token>.localhost:<port>` —— 端口在这儿。 */
export const runtimePort = () => port;
/** 内核调 workerd 内部路由(/_wd/*)时带的令牌。 */
export const runtimeToken = () => internalToken;

export const stopRuntime = () => {
  origin = null; port = null;
  if (child) { try { child.kill("SIGTERM"); } catch { /* 已退出 */ } child = null; }
};

process.on("exit", stopRuntime);
process.on("SIGTERM", () => { stopRuntime(); process.exit(0); });
process.on("SIGINT", () => { stopRuntime(); process.exit(0); });
