import type { AppDefinition } from "../types";
import ChatApp from "./chat";
import TasksApp from "./tasks";
import MemoryApp from "./memory";
import FilesApp from "./files";
import NotebookApp from "./notebook";
import FinanceApp from "./finance";
import GithubTrendingApp from "./ghtrending";
import CreateAppApp from "./createapp";
import ClaudeCodeApp from "./claude-code";
import CodexApp from "./codex";
import SettingsApp from "./settings";

export const apps: AppDefinition[] = [
  { id: "chat", name: "Chat", icon: "💬", component: ChatApp, defaultDesktopWindowSize: { w: 900, h: 640 } },
  { id: "tasks", name: "Tasks", icon: "⚡", component: TasksApp, defaultDesktopWindowSize: { w: 700, h: 500 } },
  { id: "memory", name: "Memory", icon: "💭", component: MemoryApp, defaultDesktopWindowSize: { w: 760, h: 680 }, minDesktopWindowSize: { w: 560, h: 560 } },
  { id: "files", name: "Files", icon: "🗂", component: FilesApp, defaultDesktopWindowSize: { w: 500, h: 360 } },
  { id: "notebook", name: "Notebook", icon: "📓", component: NotebookApp, defaultDesktopWindowSize: { w: 850, h: 600 } },
  { id: "finance", name: "Ledger", icon: "💰", component: FinanceApp, defaultDesktopWindowSize: { w: 980, h: 720 } },
  { id: "ghtrending", name: "Open Source Radar", icon: "💡", component: GithubTrendingApp, defaultDesktopWindowSize: { w: 960, h: 720 } },
  { id: "createapp", name: "App Workshop", icon: "🪄", component: CreateAppApp, defaultDesktopWindowSize: { w: 720, h: 640 } },
  { id: "claude-code", name: "Claude Code", icon: "🐙", component: ClaudeCodeApp, defaultDesktopWindowSize: { w: 1100, h: 720 } },
  { id: "codex", name: "Codex", icon: "💻", component: CodexApp, defaultDesktopWindowSize: { w: 1100, h: 720 } },
  { id: "settings", name: "Settings", icon: "⚙️", component: SettingsApp, defaultDesktopWindowSize: { w: 750, h: 520 } }
];

export const getApp = (appId: string) => apps.find((item) => item.id === appId) || null;
