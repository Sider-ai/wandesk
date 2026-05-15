import { EmptyText, GenericShell } from "../components";
import { formatTime } from "../utils";

export function HistoryTab({ basePath, data, loading }: { basePath: string; data: any; loading?: boolean }) {
  const isCodex = basePath.includes("codex");
  const items = data?.items || [];
  return (
    <GenericShell title="Prompt History" subtitle={`From ${isCodex ? "~/.codex/history.jsonl" : "~/.claude/history.jsonl"} · ${data?.total || 0} entries`}>
      {loading || !data ? <EmptyText text="Loading..." /> : !items.length ? <EmptyText text="No history yet" /> : (
        <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: "rgba(140,100,60,0.12)" }}>
          {items.map((item: any, index: number) => (
            <div key={`${item.sessionId || ""}-${index}`} className="flex gap-3 px-3 py-2" style={index < items.length - 1 ? { borderBottom: "1px solid rgba(140,100,60,0.06)" } : undefined}>
              <div className="cc-mono shrink-0 text-[10.5px]" style={{ color: "#8a7965", minWidth: 110 }}>{formatTime(item.timestamp)}</div>
              <div className="min-w-0">
                <div className="text-[12.5px]" style={{ color: "#2a1f13" }}>{item.display || "(empty)"}</div>
                <div className="cc-mono truncate text-[10px]" style={{ color: "#8a7965" }}>{isCodex ? (item.sessionId ? `${String(item.sessionId).slice(0, 8)}...` : "") : item.project}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GenericShell>
  );
}
