import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

export type FetchState<T> = { loading: boolean; error: string; data: T | null };

export async function readJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...options });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || data?.message || `${res.status} ${res.statusText}`);
  return data;
}

export function useEndpoint<T>(url: string, deps: unknown[] = []) {
  const [state, setState] = useState<FetchState<T>>({ loading: true, error: "", data: null });
  const load = async () => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    try { setState({ loading: false, error: "", data: await readJson<T>(url) }); }
    catch (error) { setState({ loading: false, error: error instanceof Error ? error.message : String(error), data: null }); }
  };
  useEffect(() => { void load(); }, deps);
  return { ...state, reload: load };
}

export function PanelHeader({ icon, title, subtitle, onRefresh, refreshing }: { icon: React.ReactNode; title: string; subtitle: string; onRefresh?: () => void; refreshing?: boolean }) {
  return <div className="flex shrink-0 items-center gap-3 border-b px-4 py-3" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(247,244,239,0.92)" }}><div className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ background: "rgba(92,67,50,0.12)", color: "#5c4332" }}>{icon}</div><div className="min-w-0 flex-1"><div className="truncate text-[13px] font-bold" style={{ color: "#2a1f13" }}>{title}</div><div className="truncate text-[10.5px]" style={{ color: "rgba(120,80,40,0.58)" }}>{subtitle}</div></div>{onRefresh && <button className="flex h-8 w-8 items-center justify-center rounded-full border bg-white transition hover:bg-[rgba(140,100,60,0.08)]" style={{ borderColor: "rgba(0,0,0,0.08)", color: "#2a1f13" }} onClick={onRefresh}><RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} /></button>}</div>;
}

export function ErrorBox({ message }: { message: string }) { return message ? <div className="mx-4 mt-3 rounded-[10px] border px-3 py-2 text-[12px]" style={{ borderColor: "rgba(176,58,32,0.25)", background: "rgba(176,58,32,0.06)", color: "#b03a20" }}>{message}</div> : null; }
export function EmptyState({ label }: { label: string }) { return <div className="flex h-full flex-col items-center justify-center" style={{ color: "rgba(0,0,0,0.35)" }}><div className="mb-1.5 text-[32px] opacity-35">◇</div><div className="text-[12px]">{label}</div></div>; }
export function JsonPanel({ data }: { data: unknown }) { return <pre className="m-4 min-h-0 flex-1 overflow-auto rounded-[12px] border bg-white/70 p-3 text-[11px] leading-[1.55]" style={{ borderColor: "rgba(160,120,80,0.12)", color: "#3d2f1e" }}>{JSON.stringify(data || {}, null, 2)}</pre>; }
export function useSearch<T>(items: T[], query: string, toText: (item: T) => string) { return useMemo(() => { const q = query.trim().toLowerCase(); return q ? items.filter((item) => toText(item).toLowerCase().includes(q)) : items; }, [items, query]); }
