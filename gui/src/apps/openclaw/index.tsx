import { useEffect, useState } from "react";
import ChatView from "./ChatView";
import ControlView from "./ControlView";
import TaskView from "./TaskView";

type Status = {
  online: boolean;
  version?: string | null;
  gateway?: boolean;
  gatewayUrl?: string;
  serviceStatus?: string;
  authCapability?: string;
  bind?: string;
  model?: string;
  modelConfigured?: boolean;
  sessionsCount?: number;
  gatewayIssue?: string;
  modelIssue?: string;
};
type Tab = "control" | "tasks" | "chat";

const BASE = "/apps/openclaw";

const TABS: { id: Tab; label: string }[] = [
  { id: "control", label: "__T_OPENCLAW_TAB_CONTROL__" },
  { id: "tasks", label: "__T_OPENCLAW_TAB_TASKS__" },
  { id: "chat", label: "__T_OPENCLAW_TAB_CHAT__" }
];

export default function OpenClawApp() {
  const [status, setStatus] = useState<Status>({ online: false, version: null, gateway: false });
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("control");

  const recheck = async () => {
    setChecking(true);
    try {
      const res = await fetch(`${BASE}/status`);
      setStatus(await res.json());
    } catch {
      setStatus({ online: false, version: null, gateway: false });
    } finally {
      setChecked(true);
      setChecking(false);
    }
  };

  useEffect(() => { recheck(); }, []);

  const statusLabel = checking
    ? "__T_OPENCLAW_DETECTING__"
    : status.online
    ? (status.gateway ? "__T_OPENCLAW_ONLINE__" : "__T_OPENCLAW_NO_GATEWAY__")
    : "__T_OPENCLAW_OFFLINE__";
  const dotBg = checking
    ? "radial-gradient(circle,#f1c75d,#9b7224)"
    : status.online
    ? (status.gateway ? "radial-gradient(circle,#60b848,#388020)" : "radial-gradient(circle,#d4a840,#a08020)")
    : "#6a4a3a";

  return (
    <div className="relative flex h-full flex-col overflow-hidden" style={{ background: "#2a1e14", fontFamily: "Georgia,'PingFang SC',serif" }}>
      <div className="absolute inset-0 z-0" style={{ background: "repeating-conic-gradient(rgba(160,120,70,0.03) 0% 25%,transparent 0% 50%) 0 0/18px 18px,repeating-linear-gradient(175deg,rgba(180,140,80,0.02) 0px,transparent 1px,transparent 4px),linear-gradient(160deg,#8a6a42,#7a5c38,#6a4e30,#5a4228)", boxShadow: "inset 0 0 80px rgba(0,0,0,0.3)" }} />
      <div className="relative z-[5] h-1.5 shrink-0" style={{ background: "linear-gradient(180deg,#4a3420,#3a2414)", boxShadow: "0 3px 6px rgba(0,0,0,0.4)" }} />

      <div className="relative z-[2] flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center gap-2.5 border-b border-[rgba(0,0,0,0.15)] px-4 pb-2 pt-2" style={{ background: "linear-gradient(180deg,rgba(60,42,24,0.6),rgba(50,35,20,0.3))", boxShadow: "0 1px 0 rgba(255,220,150,0.04)" }}>
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 border-[#6a4a18] text-base" style={{ background: "radial-gradient(circle at 42% 38%,#c8a060,#8a6a30)", boxShadow: "inset 0 2px 3px rgba(255,220,150,0.3),0 2px 4px rgba(0,0,0,0.4)" }}>🦞</div>
          <div className="flex-1">
            <div className="text-sm font-bold text-[#3a2810]">OpenClaw</div>
            <div className="mt-px flex items-center gap-1">
              <span className="h-1 w-1 rounded-full" style={{ background: dotBg }} />
              <span className="text-[8px] text-[rgba(60,40,20,0.4)]">{statusLabel}{status.version ? ` · ${status.version}` : ""}</span>
            </div>
          </div>
          <div className="flex overflow-hidden rounded-md p-[2px]" style={{ background: "linear-gradient(180deg,#2a1c10,#3a2818)", border: "1px solid #1a0e04", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5),0 1px 0 rgba(255,220,150,0.06)" }}>
            {TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="cursor-pointer rounded px-3.5 py-1 text-[9px] font-bold tracking-wider transition-all active:translate-y-px"
                style={tab === item.id
                  ? { background: "linear-gradient(180deg,#d8b868,#b89838,#a08028)", color: "#3a2008", border: "1px solid #8a6a20", boxShadow: "0 2px 0 rgba(60,30,0,0.4),inset 0 1px 1px rgba(255,255,200,0.35)", textShadow: "0 1px 0 rgba(255,230,160,0.3)", fontFamily: "Georgia,serif" }
                  : { background: "transparent", color: "#6a5a38", border: "1px solid transparent", fontFamily: "Georgia,serif" }}
              >{item.label}</button>
            ))}
          </div>
        </div>

        {!checked ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="relative mb-5 flex h-[72px] w-[96px] items-center justify-center rounded-sm" style={{ background: "linear-gradient(180deg,#4b3320,#2d1b10)", border: "1px solid #1a0e06", boxShadow: "inset 0 2px 7px rgba(0,0,0,0.55),0 1px 0 rgba(255,224,150,0.06)" }}>
              <div className="absolute left-3 top-3 h-2 w-2 rounded-full" style={{ background: "radial-gradient(circle,#f2d27b,#8a651f)", boxShadow: "0 0 10px rgba(242,210,123,0.42)" }} />
              <div className="absolute right-3 top-3 h-2 w-2 rounded-full" style={{ background: "radial-gradient(circle,#b99048,#4f3212)" }} />
              <div className="text-4xl">🦞</div>
              <div className="absolute bottom-3 flex gap-1">
                {[0, 1, 2].map((item) => (
                  <span key={item} className="h-1.5 w-1.5 rounded-full" style={{ background: item === 1 ? "#f0d99a" : "#8d7750", boxShadow: item === 1 ? "0 0 8px rgba(240,217,154,0.45)" : "none" }} />
                ))}
              </div>
            </div>
            <div className="mb-2 text-sm font-bold text-[#3a2810]">{"__T_OPENCLAW_DETECTING_TITLE__"}</div>
            <div className="max-w-[280px] text-xs leading-relaxed text-[rgba(60,40,20,0.5)]">{"__T_OPENCLAW_DETECTING_DESC__"}</div>
          </div>
        ) : !status.online ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 text-4xl">🦞</div>
            <div className="mb-2 text-sm font-bold text-[#3a2810]">{"__T_OPENCLAW_NOT_INSTALLED_TITLE__"}</div>
            <div className="mb-6 max-w-[260px] text-xs leading-relaxed text-[rgba(60,40,20,0.5)]">{"__T_OPENCLAW_NOT_INSTALLED_DESC__"}</div>
            <div className="mb-5 w-full max-w-[280px]">
              <div className="mb-1 text-[9px] uppercase tracking-wider text-[rgba(60,40,20,0.35)]">{"__T_OPENCLAW_INSTALL_HINT__"}</div>
              <div className="select-all rounded bg-[rgba(0,0,0,0.15)] px-3 py-2 font-mono text-[11px] text-[#3a2810]">npm i -g openclaw</div>
            </div>
            <button
              onClick={recheck}
              className="cursor-pointer rounded px-4 py-1.5 text-[10px] font-bold tracking-wider text-[#3a2008] transition-all active:translate-y-px"
              style={{ background: "linear-gradient(180deg,#d8b868,#b89838,#a08028)", border: "1px solid #8a6a20", boxShadow: "0 2px 0 rgba(60,30,0,0.4),inset 0 1px 1px rgba(255,255,200,0.35)", textShadow: "0 1px 0 rgba(255,230,160,0.3)" }}
            >{"__T_OPENCLAW_RECHECK__"}</button>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className={tab === "control" ? "flex min-h-0 flex-1 flex-col" : "hidden"}><ControlView status={status} onRefresh={recheck} /></div>
            <div className={tab === "tasks" ? "flex min-h-0 flex-1 flex-col" : "hidden"}><TaskView /></div>
            <div className={tab === "chat" ? "flex min-h-0 flex-1 flex-col" : "hidden"}><ChatView /></div>
          </div>
        )}
      </div>

      <div className="relative z-[5] h-1.5 shrink-0" style={{ background: "linear-gradient(0deg,#4a3420,#3a2414)", boxShadow: "0 -3px 6px rgba(0,0,0,0.4)" }} />
    </div>
  );
}
