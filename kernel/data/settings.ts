// 设置:模型连接 + 系统提示词 + 壳的偏好。KV 一张表,值一律是字符串。
import { all, run } from "./db.js";

export type Settings = Record<string, string>;

export const readSettings = (): Settings => {
  const out: Settings = {};
  for (const row of all<{ key: string; value: string }>("SELECT key, value FROM settings")) out[row.key] = row.value;
  return out;
};

export const writeSettings = (patch: Settings) => {
  for (const [key, value] of Object.entries(patch)) {
    run("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", key, String(value ?? ""));
  }
};

/** 起一轮 agent 时读一次快照 —— 跑到一半改设置不影响正在跑的那轮。 */
export type ModelConfig = {
  driver: string;
  url: string;
  apiKey: string;
  model: string;
  system: string;
};

export const modelConfig = (): ModelConfig => {
  const s = readSettings();
  return {
    driver: s.driver || "responses",
    url: s.apiUrl || "",
    apiKey: s.apiKey || "",
    model: s.model || "",
    system: s.system || "",
  };
};
