// 会话面 —— AGENT 仓库的 web/server 原样搬进内核。
//
// `server/` 与 `shared/` 里的文件**一行没改**,连相对 import 都正好对得上
// (`../../ai/index.js` → kernel/ai,`../../agent/index.js` → kernel/agent)。
// 这里只做三件装配的事:
//   1. 拼一个 AGENT 形状的 config(工作目录、bash 策略、压缩水位从 wandesk 这边给);
//   2. 把它的 settings 表**桥到 wandesk 的 settings** —— 全产品只有一份模型配置,
//      用户在助理里改和在壳的设置里改是同一处;
//   3. 暴露一个 handle(req, res),挂在内核的 /api/conv/* 下。
//
// 应用经 env.AI.fetch() 打到这里(见 APP.md)。所以「助理」只是一个普通应用,
// 它没有任何特权 —— 换个 UI 照样能接同一套会话面。
import type { IncomingMessage, ServerResponse } from "http";
// server/ 与 shared/ 是纯 JS(与 AGENT 仓库双向同步),不给它们加类型
import path from "path";
import { openDatabase, createStore } from "./server/store.js";
import { createChannel } from "./server/sse.js";
import { createRuns } from "./server/runs.js";
import { createApi } from "./server/api.js";
import { createFiles } from "./server/files.js";
import { kernelDir, workspace } from "../paths.js";
import { readSettings, writeSettings } from "../data/settings.js";
import { AGENT_LIMITS } from "../config.js";

const WINDOWS = process.platform === "win32";

const buildConfig = () => ({
  driver: "responses",
  responsesUrl: "",
  apiKey: "",
  model: "",
  instructions: "你是一个编程 Agent。调用工具前用 summary 简短说明目的。",
  workdir: workspace(),
  maxRounds: AGENT_LIMITS.maxRounds,
  errorMaxChars: AGENT_LIMITS.errorMaxChars,
  retry: { enabled: true, maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 30000, retryAfterStream: false },
  modelOptions: {},
  compaction: {
    contextWindowTokens: 128000, foldRatio: 0.8, tailKeepChars: 40000,
    summaryMinChars: 80, callArgsMaxChars: 2000, callOutputMaxChars: 4000,
    mechanicalItemMaxChars: 160,
    prompt: [
      "你在压缩一段对话,让 Agent 能无缝继续工作。",
      "保留用户目标与约束、已完成的事、关键事实、路径、命令、错误、未完成部分和下一步。",
      "只输出连续的中文摘要正文,不要工具调用、标签或代码围栏。",
    ].join("\n"),
  },
  bash: {
    executable: WINDOWS ? "cmd.exe" : "/bin/zsh",
    args: WINDOWS ? ["/d", "/s", "/c"] : ["-lc"],
    minTimeoutMs: 100, defaultTimeoutMs: 120000, maxTimeoutMs: 600000, maxOutputChars: 40000,
  },
  web: { host: "127.0.0.1", port: 0, dataFile: path.join(kernelDir(), "conversations.db") },
  images: { maxBytes: 8 * 1024 * 1024, maxPerMessage: 10, maxLiveToolImages: 2, directory: path.join(kernelDir(), "files") },
});

// wandesk 的键名 ↔ AGENT 的键名。只有 apiUrl / instructions 两处不同名。
const TO_AGENT: Record<string, string> = { apiUrl: "responsesUrl", system: "instructions" };
const TO_WANDESK: Record<string, string> = { responsesUrl: "apiUrl", instructions: "system" };
const rename = (obj: Record<string, string>, map: Record<string, string>) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [map[k] || k, v]));

// 应用能经 env.AI.fetch("/api/settings") 读到这张表 —— key 不必真发出去。
// 与壳的设置面板同一套办法:读时遮成占位符,写时占位符原样回来就当没改。
const MASK = "********";
const maskKey = (s: Record<string, string>) => (s.apiKey ? { ...s, apiKey: MASK } : s);

let handler: ((req: IncomingMessage, res: ServerResponse, url: URL) => Promise<boolean>) | null = null;

export const convApi = () => {
  if (handler) return handler;
  const config = buildConfig();
  const store = createStore(openDatabase(config.web.dataFile));

  // 全产品一份模型配置:助理的设置页和壳的设置页写的是同一张表
  const bridged = {
    ...store,
    getSettings: () => rename(readSettings(), TO_AGENT),
    setSettings: (values: Record<string, string>) => {
      const patch = { ...values };
      if (patch.apiKey === MASK) delete patch.apiKey; // 占位符原样回来 = 没改
      writeSettings(rename(patch, TO_WANDESK));
      return rename(readSettings(), TO_AGENT);
    },
  };

  // 运行轮子要真 key;对外的接口层给遮过的。同一份数据,两个视角。
  const forApi = {
    ...bridged,
    getSettings: () => maskKey(bridged.getSettings()),
    setSettings: (values: Record<string, string>) => maskKey(bridged.setSettings(values)),
  };

  const channel = createChannel();
  const files = createFiles(config);
  const runs = createRuns({ config, store: bridged, files, broadcast: channel.broadcast });
  handler = createApi({ config, store: forApi, runs, files, channel, meta: { version: "2.0.0" } });
  return handler!;
};
