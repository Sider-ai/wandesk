import CodeWorkspace from "../codeworkspace";

const tabs = [
  { id: "chat", icon: "💬", label: "Chat" },
  { id: "projects", icon: "🗂", label: "Sessions" },
  { id: "memory", icon: "🤖", label: "AGENTS.md" },
  { id: "history", icon: "🕐", label: "History" },
  { id: "skills", icon: "✨", label: "Skills" },
  { id: "mcp", icon: "🌐", label: "MCP" },
  { id: "settings", icon: "⚙️", label: "Settings" },
  { id: "account", icon: "👤", label: "Account" }
];

const permissionModes = [
  { id: "workspaceWrite", label: "workspace", description: "Workspace-write mode. Requests confirmation when needed; suitable for most coding changes." },
  { id: "readOnly", label: "readOnly", description: "Read-only mode for inspection and analysis. It does not modify files directly." },
  { id: "fullAuto", label: "fullAuto", description: "Low-friction automatic execution, equivalent to Codex --full-auto." },
  { id: "neverAsk", label: "neverAsk", description: "Workspace-write mode with approval disabled where possible." },
  { id: "dangerFullAccess", label: "danger", description: "Full disk write access. High risk; use only in fully controlled environments." },
  { id: "bypassPermissions", label: "bypass", description: "Bypasses approvals and sandboxing. Highest risk." }
];

export default function CodexApp() {
  return <CodeWorkspace basePath="/apps/codex" title="Codex" emptyIcon="🤖" memoryLabel="Global Codex instructions" projectLabel="Codex session directories" tabs={tabs} defaultPermissionMode="workspaceWrite" permissionModes={permissionModes} />;
}
