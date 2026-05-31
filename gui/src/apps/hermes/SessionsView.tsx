import { useEffect, useState } from "react";
import { getSessions } from "./api";
import { brassButton, ledger, muted, paper } from "./materials";
import type { HermesSession } from "./types";

const formatTime = (value?: number | null) => {
  if (!value) return "__T_HERMES_NEVER__";
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return "__T_HERMES_NEVER__";
  return date.toLocaleString();
};

const totalTokens = (session: HermesSession) =>
  Number(session.inputTokens || 0) + Number(session.outputTokens || 0) + Number(session.cacheReadTokens || 0) + Number(session.reasoningTokens || 0);

export default function SessionsView({ onOpenChat }: { onOpenChat: (sessionId: string) => void }) {
  const [sessions, setSessions] = useState<HermesSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setSessions(await getSessions(40));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <section className="rounded-md p-3" style={ledger}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d6b15f]">__T_HERMES_SESSION_LEDGER__</div>
            <div className="mt-1 text-[12px]" style={{ color: muted }}>__T_HERMES_SESSION_LEDGER_DESC__</div>
          </div>
          <button className="cursor-pointer rounded px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={brassButton} onClick={load}>{loading ? "__T_HERMES_LOADING__" : "__T_HERMES_REFRESH__"}</button>
        </div>

        {error && <div className="mb-3 rounded border border-[#ffd279]/25 bg-[#2c1108]/55 px-3 py-2 text-[11px] text-[#ffd6a0]">{error}</div>}

        {!sessions.length ? (
          <div className="rounded border border-dashed border-[#ffe6cb]/20 px-3 py-12 text-center text-[12px] text-[#8fb5ad]">__T_HERMES_NO_SESSIONS__</div>
        ) : (
          <div className="grid gap-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onOpenChat(session.id)}
                className="grid cursor-pointer gap-2 rounded-sm px-3 py-2.5 text-left transition-transform active:translate-y-0.5 md:grid-cols-[1fr_128px_82px]"
                style={paper}
              >
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-bold text-[#2b1a08]">{session.title || session.preview || "__T_HERMES_UNTITLED_SESSION__"}</div>
                  <div className="mt-1 truncate font-mono text-[9.5px] text-[#7a603a]">{session.id}</div>
                </div>
                <div className="min-w-0 text-[10px] text-[#6c522e]">
                  <div className="truncate font-mono">{session.model || "__T_HERMES_UNSET__"}</div>
                  <div className="mt-1 truncate">{formatTime(session.lastActive)}</div>
                </div>
                <div className="text-right text-[10px] text-[#6c522e]">
                  <div className="font-mono font-bold text-[#472d0f]">{totalTokens(session).toLocaleString()}</div>
                  <div className="mt-1 uppercase tracking-[0.12em]">tokens</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
