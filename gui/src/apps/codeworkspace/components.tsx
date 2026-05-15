import { useState } from "react";
import type { ReactNode } from "react";

export function JsonDetails({ data }: { data: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button className="rounded-md px-2 py-1 text-[11px] hover:bg-black/5" style={{ color: "#5c4332" }} onClick={() => setOpen((value) => !value)}>{open ? "Hide raw JSON" : "Show raw JSON"}</button>
      {open && <pre className="cc-mono mt-2 overflow-auto rounded-xl border bg-white/80 p-3 text-[11px]" style={{ borderColor: "rgba(140,100,60,0.12)", color: "#2a1f13" }}>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export function StatCard({ label, value, tone }: { label: string; value: any; tone?: "good" | "bad" }) {
  return (
    <div className="cc-stat-card">
      <div className="cc-stat-label">{label}</div>
      <div className="cc-stat-value" style={tone === "good" ? { color: "#1f8a5c" } : tone === "bad" ? { color: "#b03a20" } : undefined}>{value || "-"}</div>
    </div>
  );
}

export function GenericShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return <div className="h-full space-y-4 overflow-y-auto px-6 py-5 cc-thin-scroll"><div><div className="text-[17px] font-bold">{title}</div>{subtitle && <div className="text-[11.5px]" style={{ color: "#6b5a46" }}>{subtitle}</div>}</div>{children}</div>;
}

export function EmptyText({ text, bad }: { text: string; bad?: boolean }) {
  return <div className="text-[12px]" style={{ color: bad ? "#b03a20" : "#8a7965" }}>{text}</div>;
}

export function InfoBox({ label, value }: { label: string; value: any }) {
  return <div className="rounded-xl border p-3" style={{ borderColor: "rgba(160,120,80,0.16)", background: "rgba(255,248,238,0.55)" }}><div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#8a7965" }}>{label}</div><div className="mt-1 break-all text-[14px] font-medium" style={{ color: "#2c241c" }}>{value || "-"}</div></div>;
}

export function InfoCard({ item }: { item: any }) {
  const name = item.name || item.id || item.pluginId || item.title || item.path || "Item";
  const desc = item.description || item.summary || item.command || item.content || item.status || item.scope || "";
  return <div className="cc-card"><div className="flex items-start gap-3"><div className="cc-icon">{item.enabled === false ? "○" : "✓"}</div><div className="min-w-0 flex-1"><div className="truncate text-[12.5px] font-bold">{name}</div>{desc && <div className="mt-0.5 line-clamp-3 text-[11px] leading-snug" style={{ color: "#6b5a46" }}>{String(desc)}</div>}<div className="cc-mono mt-1 truncate text-[10.5px]" style={{ color: "#8a7965" }}>{item.version || item.type || item.modified || item.cwd || ""}</div></div></div></div>;
}
