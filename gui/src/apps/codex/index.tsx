import CodeWorkspace from "../codeworkspace";

const tabs = [
  { id: "takeover", icon: "🧭", label: "__T_AGENT_TAKEOVER_TAB__" },
  { id: "chat", icon: "💬", label: "__T_CODEX_TAB_CHAT__" },
  { id: "projects", icon: "🗂", label: "__T_CODEX_TAB_SESSIONS__" },
  { id: "memory", icon: "🤖", label: "AGENTS.md" },
  { id: "history", icon: "🕐", label: "__T_CODEX_TAB_HISTORY__" },
  { id: "skills", icon: "✨", label: "__T_CODEX_TAB_SKILLS__" },
  { id: "mcp", icon: "🌐", label: "MCP" },
  { id: "settings", icon: "⚙️", label: "__T_CODEX_TAB_SETTINGS__" },
  { id: "account", icon: "👤", label: "__T_CODEX_TAB_ACCOUNT__" }
];

const permissionModes = [
  { id: "workspaceWrite", label: "__T_CODEX_PERM_WORKSPACE_LABEL__", description: "__T_CODEX_PERM_WORKSPACE_DESC__" },
  { id: "readOnly", label: "__T_CODEX_PERM_READONLY_LABEL__", description: "__T_CODEX_PERM_READONLY_DESC__" },
  { id: "fullAuto", label: "__T_CODEX_PERM_FULLAUTO_LABEL__", description: "__T_CODEX_PERM_FULLAUTO_DESC__" },
  { id: "neverAsk", label: "__T_CODEX_PERM_NEVERASK_LABEL__", description: "__T_CODEX_PERM_NEVERASK_DESC__" },
  { id: "dangerFullAccess", label: "__T_CODEX_PERM_DANGER_LABEL__", description: "__T_CODEX_PERM_DANGER_DESC__" },
  { id: "bypassPermissions", label: "__T_CODEX_PERM_BYPASS_LABEL__", description: "__T_CODEX_PERM_BYPASS_DESC__" }
];

export default function CodexApp() {
  return <CodeWorkspace basePath="/apps/codex" title="Codex" emptyIcon="🤖" memoryLabel="__T_CODEX_MEMORY_LABEL__" projectLabel="__T_CODEX_PROJECT_LABEL__" tabs={tabs} defaultPermissionMode="workspaceWrite" permissionModes={permissionModes} />;
}
