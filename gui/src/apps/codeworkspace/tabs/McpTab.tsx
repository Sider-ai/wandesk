import { EmptyText, GenericShell } from "../components";

export function McpTab({ basePath, data, loading }: { basePath: string; data: any; loading?: boolean }) {
  const isCodex = basePath.includes("codex");
  const items = data?.configured || [];
  return (
    <GenericShell title="MCP Servers" subtitle={`Data from ${isCodex ? "codex mcp list" : "claude mcp list"}`}>
      {loading || !data ? <EmptyText text="Loading..." /> : !data.available ? <EmptyText text={data.error || "-"} bad /> : data.empty ? (
        <div className="rounded-xl py-10 text-center" style={{ border: "1px dashed rgba(140,100,60,0.25)", background: "rgba(255,255,255,0.4)" }}>
          <div className="mb-2 text-[40px]">🌐</div>
          <div className="mb-1 text-[14px] font-bold">No MCP server connected yet</div>
          <div className="mx-auto max-w-md text-[11.5px]" style={{ color: "#6b5a46" }}>{isCodex ? "Use codex mcp add to add one." : "MCP lets Claude access external capabilities like browser, desktop, databases, and scheduled tasks."}</div>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item: any) => (
            <div key={item.name} className="cc-chart-card" style={{ padding: "12px 16px" }}>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold">{item.name}</span>
                {item.status && <span className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: item.status === "enabled" ? "rgba(31,138,92,.12)" : "rgba(140,100,60,.1)", color: item.status === "enabled" ? "#1f8a5c" : "#6b5a46" }}>{item.status}</span>}
                {item.auth && <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ background: "rgba(140,100,60,.1)", color: "#6b5a46" }}>{item.auth}</span>}
              </div>
              <div className="cc-mono mt-1 truncate text-[11px]" style={{ color: "#6b5a46" }}>{item.target || `${item.command || ""} ${item.args || ""}`}</div>
              {item.cwd && <div className="cc-mono mt-0.5 truncate text-[10px]" style={{ color: "#8a7965" }}>cwd: {item.cwd}</div>}
            </div>
          ))}
        </div>
      )}
    </GenericShell>
  );
}
