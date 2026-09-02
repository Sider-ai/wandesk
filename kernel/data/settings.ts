// Settings: model connection + system prompt + shell preferences. A single KV table, values are always strings.
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

/** Read a snapshot once when an agent turn starts — changing settings mid-turn doesn't affect the turn already running. */
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

/** UI language: read from the settings table (key "language"); defaults to "en" for anything else. */
export type Language = "zh" | "en";

export const currentLanguage = (): Language => {
  const saved = readSettings().language;
  return saved === "zh" || saved === "en" ? saved : "en";
};
