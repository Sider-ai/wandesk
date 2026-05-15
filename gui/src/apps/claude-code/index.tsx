import CodeWorkspace from "../codeworkspace";

const tabs = [
  { id: "chat", icon: "💬", label: "Chat" },
  { id: "projects", icon: "🗂", label: "Projects" },
  { id: "memory", icon: "🐙", label: "CLAUDE.md" },
  { id: "plans", icon: "🗺", label: "Plans" },
  { id: "history", icon: "🕐", label: "History" },
  { id: "skills", icon: "✨", label: "Skills" },
  { id: "plugins", icon: "🧩", label: "Plugins" },
  { id: "agents", icon: "🤖", label: "Agents" },
  { id: "mcp", icon: "🌐", label: "MCP" },
  { id: "stats", icon: "📊", label: "Stats" },
  { id: "settings", icon: "⚙️", label: "Settings" },
  { id: "account", icon: "👤", label: "Account" }
];

const permissionModes = [
  { id: "default", label: "default", description: "Standard permission mode. Claude requests permission according to its default policy." },
  { id: "plan", label: "plan", description: "Plan and analyze first. Best for discussing the approach before executing." },
  { id: "auto", label: "auto", description: "Automatically chooses between permission strategies to reduce manual intervention." },
  { id: "acceptEdits", label: "acceptEdits", description: "Prefer directly accepting code-editing operations." },
  { id: "dontAsk", label: "dontAsk", description: "Avoids asking for confirmation where possible and continues directly." },
  { id: "bypassPermissions", label: "bypass", description: "Bypasses permission checks. Highest risk; use only in fully trusted environments." }
];

export default function ClaudeCodeApp() {
  return <CodeWorkspace basePath="/apps/claude-code" title="Claude Code" emptyIcon="🐙" memoryLabel="Global Claude Code instructions" projectLabel="Subdirectories under ~/.claude/projects/" tabs={tabs} defaultPermissionMode="default" permissionModes={permissionModes} />;
}
