import { EmptyText, GenericShell } from "../components";

export function AgentsTab({ data, loading }: { data: any; loading?: boolean }) {
  return (
    <GenericShell title="Subagents" subtitle={`Data from claude agents · ${data?.total || ""}`}>
      {loading || !data ? <EmptyText text="Loading..." /> : !data.available ? <EmptyText text={data.error || "-"} bad /> : (
        <div className="space-y-2">
          {(data.agents || []).map((agent: any) => (
            <div key={agent.name} className="cc-chart-card grid items-center gap-3" style={{ gridTemplateColumns: "48px 1fr", padding: "12px 16px" }}>
              <div className="cc-icon">🤖</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold">{agent.name}</span>
                  <span className="cc-mono rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(92,67,50,0.12)", color: "#5c4332" }}>{agent.model}</span>
                </div>
                <div className="mt-0.5 text-[11px]" style={{ color: "#6b5a46" }}>{agent.group || "built-in"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GenericShell>
  );
}
