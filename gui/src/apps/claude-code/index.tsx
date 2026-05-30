import CodeWorkspace from "../codeworkspace";

const tabs = [
  { id: "chat", icon: "💬", label: "__T_CLAUDECODE_TAB_CHAT__" },
  { id: "projects", icon: "🗂", label: "__T_CLAUDECODE_TAB_PROJECTS__" },
  { id: "memory", icon: "🐙", label: "CLAUDE.md" },
  { id: "plans", icon: "🗺", label: "__T_CLAUDECODE_TAB_PLANS__" },
  { id: "history", icon: "🕐", label: "__T_CLAUDECODE_TAB_HISTORY__" },
  { id: "skills", icon: "✨", label: "__T_CLAUDECODE_TAB_SKILLS__" },
  { id: "plugins", icon: "🧩", label: "__T_CLAUDECODE_TAB_PLUGINS__" },
  { id: "agents", icon: "🤖", label: "__T_CLAUDECODE_TAB_AGENTS__" },
  { id: "mcp", icon: "🌐", label: "MCP" },
  { id: "stats", icon: "📊", label: "__T_CLAUDECODE_TAB_STATS__" },
  { id: "settings", icon: "⚙️", label: "__T_CLAUDECODE_TAB_SETTINGS__" },
  { id: "account", icon: "👤", label: "__T_CLAUDECODE_TAB_ACCOUNT__" }
];

const permissionModes = [
  { id: "default", label: "default", description: "__T_CLAUDECODE_PERM_DEFAULT_DESC__" },
  { id: "plan", label: "plan", description: "__T_CLAUDECODE_PERM_PLAN_DESC__" },
  { id: "auto", label: "auto", description: "__T_CLAUDECODE_PERM_AUTO_DESC__" },
  { id: "acceptEdits", label: "acceptEdits", description: "__T_CLAUDECODE_PERM_ACCEPTEDITS_DESC__" },
  { id: "dontAsk", label: "dontAsk", description: "__T_CLAUDECODE_PERM_DONTASK_DESC__" },
  { id: "bypassPermissions", label: "bypass", description: "__T_CLAUDECODE_PERM_BYPASS_DESC__" }
];

export default function ClaudeCodeApp() {
  return <CodeWorkspace basePath="/apps/claude-code" title="Claude Code" emptyIcon="🐙" memoryLabel="__T_CLAUDECODE_MEMORY_LABEL__" projectLabel="__T_CLAUDECODE_PROJECT_LABEL__" tabs={tabs} defaultPermissionMode="default" permissionModes={permissionModes} />;
}
