/**
 * GET /welcome
 *
 * 给外部 agent(Claude Code / Codex / Antigravity 等)读的系统架构地图。
 * 不需要鉴权(/welcome 不在 /api/ 或 /apps/ 路径下)。
 *
 * 客户端版本(Wandesk)和 OSS 版本(Sider-ai/wandesk)都暴露此端点。
 * Cloud 版本(Sider-ai/wandesk-cloud)出于多租户/部署考虑不暴露,
 * 详见 wandesk-cloud 仓 AGENTS.md。
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { IncomingMessage, ServerResponse } from "http";

const ROOT_DIR = process.cwd();

const readLocale = (): string => {
  try {
    const settingsPath = join(ROOT_DIR, ".aios", "settings.json");
    if (!existsSync(settingsPath)) return "en";
    const settings = JSON.parse(readFileSync(settingsPath, "utf-8"));
    return settings.locale || "en";
  } catch { return "en"; }
};

const readVersion = (): string => {
  try {
    const pkg = JSON.parse(readFileSync(join(ROOT_DIR, "package.json"), "utf-8"));
    return pkg.version || "0.0.0";
  } catch { return "0.0.0"; }
};

const APPS = [
  { id: "chat",        name: "Chat",              icon: "💬", description: "Conversations with AI; the intent layer of the desktop." },
  { id: "tasks",       name: "Tasks",             icon: "⚡", description: "Track AI agent tasks running across the desktop." },
  { id: "memory",      name: "Memory",            icon: "💭", description: "Long-term user memory injected into AI system prompt." },
  { id: "files",       name: "Files",             icon: "🗂", description: "Browse and operate the local workspace files." },
  { id: "notebook",    name: "Notebook",          icon: "📓", description: "Notes that AI can read and write." },
  { id: "finance",     name: "Ledger",            icon: "💰", description: "Personal finance with AI auto-categorization." },
  { id: "ghtrending",  name: "Open Source Radar", icon: "💡", description: "Track and analyze trending GitHub projects." },
  { id: "createapp",   name: "App Workshop",      icon: "🪄", description: "Describe an app idea, AI builds a real local app." },
  { id: "claude-code", name: "Claude Code",       icon: "🐙", description: "Anthropic's coding workbench as a Wandesk app." },
  { id: "codex",       name: "Codex",             icon: "💻", description: "OpenAI Codex workbench, same form factor as Claude Code." },
  { id: "settings",    name: "Settings",          icon: "⚙️", description: "Model providers, language, theme, and tool settings." }
];

const SYSTEM_APIS = [
  { path: "/api/settings", methods: "GET, POST",         description: "Read or update model provider config (provider, apiUrl, apiKey, model)." },
  { path: "/api/memory",   methods: "GET, POST, DELETE", description: "List, create, update, or delete long-term memories." },
  { path: "/api/tasks",    methods: "GET, POST",         description: "List running tasks or create a new agent task." },
  { path: "/api/chat",     methods: "GET, POST",         description: "List conversations or send messages." }
];

const AGENT_GUIDANCE = [
  "Wandesk exposes both app-level and system-level endpoints under this same host.",
  "App endpoints: /apps/<id>/<action> — fetch /apps/<id>/APP.md for each app's intent, data model, and supported actions.",
  "System endpoints: /api/<resource> — see system_apis[] below for the most important ones.",
  "",
  "Typical workflow for an external agent:",
  "  1. GET /apps/<id>/APP.md for the apps relevant to the user's task",
  "  2. Pull recent context via /api/chat and /api/memory",
  "  3. Act through app endpoints (POST /apps/<id>/<action>) or create background work via /api/tasks",
  "",
  "Authentication: /api/* and /apps/* require Bearer token (process.env.AIOS_API_TOKEN) or a logged-in browser session.",
  "This /welcome endpoint itself is public and safe to fetch without auth."
];

export const handleWelcome = (_req: IncomingMessage, res: ServerResponse) => {
  const payload = {
    product: "Wandesk",
    version: readVersion(),
    locale: readLocale(),
    description: "Wandesk is an AI desktop. Apps share context, memory persists, and external agents can drive workflows here.",
    ports: {
      main: Number(process.env.AIOS_MAIN_PORT || 9502),
      apps: Number(process.env.AIOS_APPS_PORT || 9503)
    },
    apps: APPS,
    system_apis: SYSTEM_APIS,
    agent_guidance: AGENT_GUIDANCE
  };
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(JSON.stringify(payload, null, 2));
};
