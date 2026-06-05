import { useEffect, useState } from "react";
import { getRoutines, getSessions, startDashboard } from "./api";
import { brass, brassButton, darkButton, leather, ledger, muted, paper } from "./materials";
import type { HermesRoutine, HermesSession, HermesStatus } from "./types";

const formatTime = (value?: number | null) => {
  if (!value) return "__T_HERMES_NEVER__";
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return "__T_HERMES_NEVER__";
  return date.toLocaleString();
};

const compactModel = (value?: string) => String(value || "").replace(/^.*\//, "") || "__T_HERMES_UNSET__";

function Gauge({ label, value, detail, active }: { label: string; value: string; detail?: string; active?: boolean }) {
  return (
    <div className="relative min-w-0 rounded px-2.5 py-2.5" style={ledger}>
      <div className="absolute inset-x-2 top-1 h-px bg-[#ffe6cb]/10" />
      <div className="mb-2 flex items-center justify-between">
        <span className="truncate text-[9px] font-bold uppercase tracking-[0.18em] text-[#c8aa73]">{label}</span>
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{
            background: active ? "radial-gradient(circle,#fff4ba,#ffc94b 42%,#715012)" : "radial-gradient(circle,#756953,#2d2420)",
            boxShadow: active ? "0 0 12px rgba(255,201,75,0.55)" : "inset 0 1px 2px rgba(0,0,0,0.65)"
          }}
        />
      </div>
      <div className="truncate font-mono text-[17px] font-bold text-[#ffe6cb]">{value}</div>
      {detail && <div className="mt-1 truncate font-mono text-[9px] text-[#8fb5ad]">{detail}</div>}
    </div>
  );
}

function SessionSlip({ session, onPick }: { session: HermesSession; onPick: (id: string) => void }) {
  return (
    <button
      onClick={() => onPick(session.id)}
      className="group w-full cursor-pointer rounded-sm px-3 py-2 text-left transition-transform active:translate-y-0.5"
      style={paper}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="truncate text-[12px] font-bold text-[#2b1a08]">{session.title || session.preview || "__T_HERMES_UNTITLED_SESSION__"}</div>
        <div className="shrink-0 rounded-sm border border-[#6a4612]/25 bg-[#7c2e1d]/10 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[#7b3b21]">{session.source || "cli"}</div>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 text-[9px] text-[#7a603a]">
        <span className="truncate font-mono">{session.id}</span>
        <span className="shrink-0">{formatTime(session.lastActive)}</span>
      </div>
    </button>
  );
}

export default function DispatchView({
  status,
  onRefresh,
  onOpenChat,
  onOpenSessions
}: {
  status: HermesStatus;
  onRefresh: () => void;
  onOpenChat: (sessionId?: string) => void;
  onOpenSessions: () => void;
}) {
  const [sessions, setSessions] = useState<HermesSession[]>([]);
  const [routines, setRoutines] = useState<HermesRoutine[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const [sessionRows, routineRows] = await Promise.all([getSessions(5), getRoutines()]);
      setSessions(sessionRows);
      setRoutines(routineRows.routines || []);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => { load(); }, [status.sessionsCount, status.cronJobs]);

  const openDashboard = async () => {
    setBusy(true);
    setError("");
    try {
      const data = status.dashboardRunning ? { dashboardUrl: status.dashboardUrl || "http://127.0.0.1:9119/" } : await startDashboard();
      await onRefresh();
      window.open(data.dashboardUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-md p-3.5" style={leather}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: brass }}>__T_HERMES_DISPATCH_DESK__</div>
              <div className="mt-1 text-[22px] font-bold leading-none text-[#ffe6cb]">Hermes</div>
              <div className="mt-1 max-w-[360px] text-[11px] leading-relaxed" style={{ color: muted }}>__T_HERMES_DISPATCH_DESC__</div>
            </div>
            <div className="hidden h-14 w-14 shrink-0 rounded-full border border-[#ffe6cb]/20 bg-[#031413] shadow-[inset_0_0_18px_rgba(255,230,203,0.08)] sm:flex sm:items-center sm:justify-center">
              <span className="text-2xl text-[#ffd279]">✉</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <Gauge label="__T_HERMES_GAUGE_MODEL__" value={compactModel(status.model)} detail={status.provider || "__T_HERMES_PROVIDER__"} active={Boolean(status.model)} />
            <Gauge label="__T_HERMES_GAUGE_DASHBOARD__" value={status.dashboardRunning ? "__T_HERMES_RUNNING__" : "__T_HERMES_CLOSED__"} detail={status.dashboardPid ? `PID ${status.dashboardPid}` : status.dashboardUrl} active={Boolean(status.dashboardRunning)} />
            <Gauge label="__T_HERMES_GAUGE_GATEWAY__" value={status.gateway ? "__T_HERMES_RUNNING__" : "__T_HERMES_SLEEPING__"} detail={status.gatewayStatus || "__T_HERMES_GATEWAY__"} active={Boolean(status.gateway)} />
            <Gauge label="__T_HERMES_GAUGE_MEMORY__" value={String(status.sessionsCount || 0)} detail="__T_HERMES_SESSIONS__" active={Boolean(status.sessionsCount)} />
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <button className="cursor-pointer rounded px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] active:translate-y-0.5" style={brassButton} onClick={() => onOpenChat()}>__T_HERMES_NEW_MESSAGE__</button>
            <button className="cursor-pointer rounded px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] active:translate-y-0.5 disabled:opacity-55" style={brassButton} onClick={openDashboard} disabled={busy}>{busy ? "__T_HERMES_STARTING__" : (status.dashboardRunning ? "__T_HERMES_OPEN_DASHBOARD__" : "__T_HERMES_START_DASHBOARD__")}</button>
            <button className="cursor-pointer rounded px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] active:translate-y-0.5" style={darkButton} onClick={onRefresh}>__T_HERMES_REFRESH__</button>
          </div>

          {error && <div className="mt-3 rounded-sm border border-[#ffd279]/25 bg-[#2c1108]/55 px-3 py-2 text-[11px] leading-relaxed text-[#ffd6a0]">{error}</div>}

          <div className="mt-3 rounded-sm p-3" style={paper}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <div className="text-[13px] font-bold text-[#2b1a08]">__T_HERMES_ROUTINE_REGISTER__</div>
                <div className="mt-0.5 text-[10px] text-[#7a603a]">__T_HERMES_ROUTINE_DESC__</div>
              </div>
              <span className="rounded-full border border-[#6a4612]/25 bg-[#5e3213]/10 px-2 py-1 font-mono text-[10px] text-[#5e3213]">{status.cronJobs || routines.length || 0}</span>
            </div>
            {!routines.length ? (
              <div className="rounded border border-dashed border-[#7a603a]/35 py-4 text-center text-[11px] text-[#7a603a]">__T_HERMES_NO_ROUTINES__</div>
            ) : (
              <div className="space-y-1.5">
                {routines.slice(0, 4).map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded border border-[#7a603a]/18 bg-[#fff8e5]/45 px-2 py-1.5 font-mono text-[10px] text-[#3c2610]">{item}</div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-md p-3" style={ledger}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: brass }}>__T_HERMES_RECENT_LEDGER__</div>
              <div className="mt-1 text-[13px] text-[#ffe6cb]">__T_HERMES_RECENT_DESC__</div>
            </div>
            <button className="cursor-pointer rounded px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={darkButton} onClick={onOpenSessions}>__T_HERMES_VIEW_ALL__</button>
          </div>
          <div className="space-y-2">
            {!sessions.length ? (
              <div className="rounded border border-dashed border-[#ffe6cb]/20 px-3 py-8 text-center text-[12px] text-[#8fb5ad]">__T_HERMES_NO_SESSIONS__</div>
            ) : sessions.map((session) => (
              <SessionSlip key={session.id} session={session} onPick={onOpenChat} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
