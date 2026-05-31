import { useEffect, useState } from "react";
import ChatView from "./ChatView";
import DispatchView from "./DispatchView";
import SessionsView from "./SessionsView";
import { getStatus } from "./api";
import { brassButton, grainStyle, ink, shellStyle } from "./materials";
import type { HermesStatus } from "./types";

type Tab = "dispatch" | "chat" | "sessions";

const TABS: { id: Tab; label: string }[] = [
  { id: "dispatch", label: "__T_HERMES_TAB_DISPATCH__" },
  { id: "chat", label: "__T_HERMES_TAB_CHAT__" },
  { id: "sessions", label: "__T_HERMES_TAB_SESSIONS__" }
];

export default function HermesApp() {
  const [status, setStatus] = useState<HermesStatus>({ online: false });
  const [tab, setTab] = useState<Tab>("dispatch");
  const [sessionId, setSessionId] = useState("");

  const refresh = async () => {
    try {
      setStatus(await getStatus());
    } catch {
      setStatus({ online: false });
    }
  };

  useEffect(() => { refresh(); }, []);

  const openChat = (nextSessionId = "") => {
    setSessionId(nextSessionId);
    setTab("chat");
  };

  const statusText = status.online
    ? (status.gateway ? "__T_HERMES_STATUS_RUNNING__" : "__T_HERMES_STATUS_READY__")
    : "__T_HERMES_STATUS_OFFLINE__";

  return (
    <div className="relative flex h-full flex-col overflow-hidden" style={shellStyle}>
      <div className="pointer-events-none absolute inset-0" style={grainStyle} />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.58)]" />

      <div className="relative z-[2] h-2 shrink-0 border-b border-[#ffe6cb]/10 bg-[#030d0d]" />

      <header className="relative z-[2] flex shrink-0 items-center gap-3 border-b border-[#ffe6cb]/12 px-4 py-3" style={{ background: "linear-gradient(180deg,rgba(4,28,28,0.92),rgba(3,16,16,0.78))" }}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: "radial-gradient(circle at 38% 30%,#ffe6a6,#d6a847 48%,#5b3510)", border: "1px solid rgba(22,11,2,0.8)", boxShadow: "0 3px 0 rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,250,209,0.56)" }}>
          <span className="text-[22px] text-[#251304]">✉</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-[18px] font-bold leading-none" style={{ color: ink }}>Hermes</div>
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: status.online ? "radial-gradient(circle,#fff2ad,#ffbf38 48%,#5c3c08)" : "radial-gradient(circle,#7b6b5d,#2b2420)",
                boxShadow: status.online ? "0 0 12px rgba(255,191,56,0.52)" : "none"
              }}
            />
          </div>
          <div className="mt-1 flex min-w-0 items-center gap-2 text-[10px] text-[#8fb5ad]">
            <span className="shrink-0">{statusText}</span>
            {status.version && <span className="truncate font-mono">{status.version}</span>}
            {status.model && <span className="hidden truncate font-mono sm:inline">{status.model}</span>}
          </div>
        </div>
        <nav className="flex shrink-0 overflow-hidden rounded-md p-[2px]" style={{ background: "linear-gradient(180deg,#010908,#09211f)", border: "1px solid rgba(255,230,203,0.15)", boxShadow: "inset 0 2px 5px rgba(0,0,0,0.55)" }}>
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="cursor-pointer rounded px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] transition-all active:translate-y-px"
              style={tab === item.id ? brassButton : { background: "transparent", border: "1px solid transparent", color: "#8fb5ad" }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {!status.online ? (
        <div className="relative z-[2] flex flex-1 items-center justify-center p-6 text-center">
          <div className="max-w-[340px] rounded-md p-5" style={{ background: "linear-gradient(180deg,#fff2d2,#d8ba82)", color: "#2b1a08", border: "1px solid rgba(51,31,8,0.5)", boxShadow: "0 20px 44px rgba(0,0,0,0.36),inset 0 1px 0 rgba(255,255,236,0.75)" }}>
            <div className="mb-2 text-3xl text-[#7a3b1c]">✉</div>
            <div className="text-[15px] font-bold">__T_HERMES_NOT_INSTALLED_TITLE__</div>
            <div className="mt-2 text-[12px] leading-relaxed text-[#735835]">__T_HERMES_NOT_INSTALLED_DESC__</div>
            <button className="mt-4 cursor-pointer rounded px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em]" style={brassButton} onClick={refresh}>__T_HERMES_RECHECK__</button>
          </div>
        </div>
      ) : (
        <main className="relative z-[2] flex min-h-0 flex-1 flex-col">
          <div className={tab === "dispatch" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
            <DispatchView status={status} onRefresh={refresh} onOpenChat={openChat} onOpenSessions={() => setTab("sessions")} />
          </div>
          <div className={tab === "chat" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
            <ChatView sessionId={sessionId} onSessionChange={setSessionId} />
          </div>
          <div className={tab === "sessions" ? "flex min-h-0 flex-1 flex-col" : "hidden"}>
            <SessionsView onOpenChat={openChat} />
          </div>
        </main>
      )}

      <div className="relative z-[2] h-2 shrink-0 border-t border-[#ffe6cb]/10 bg-[#030d0d]" />
    </div>
  );
}
