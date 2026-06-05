import { useEffect, useRef, useState } from "react";

type ChatMeta = { provider?: string; model?: string; transport?: string; fallbackFrom?: string; durationMs?: number; sessionKey?: string };
type Message = { id?: number | string; role: "user" | "assistant"; content: string; meta?: ChatMeta; error?: boolean; createdAt?: string };
type Session = {
  key: string;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
  model?: string;
  updatedAt?: number | string | null;
  totalTokens?: number;
};

const BASE = "/apps/openclaw";

const newSessionKey = () => {
  const stamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
  return `wandesk-${stamp}`;
};

const shortModel = (model?: string) => String(model || "").replace(/^claude-cli\//, "").replace(/^openai\//, "");

const formatTime = (value?: number | string | null) => {
  if (!value) return "";
  const ms = typeof value === "number" && value < 100000000000 ? value * 1000 : Number(value);
  const date = Number.isFinite(ms) ? new Date(ms) : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

const sessionTitle = (session?: Session | null, key?: string) => {
  const raw = session?.sessionKey || key || "";
  if (!raw) return "__T_OPENCLAW_NEW_CONVERSATION__";
  return raw.replace(/^wandesk-?/, "") || raw;
};

export default function ChatView({ initialSessionKey = "" }: { initialSessionKey?: string }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [clearing, setClearing] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => requestAnimationFrame(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  });

  useEffect(() => { scrollBottom(); }, [messages, busy, activeKey]);

  const loadSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await fetch(`${BASE}/sessions`);
      const data = await res.json().catch(() => ({}));
      setSessions(Array.isArray(data.sessions) ? data.sessions : []);
    } catch {
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const loadHistory = async (key: string, signal?: AbortSignal) => {
    setLoadingHistory(true);
    setHistoryError("");
    try {
      const params = new URLSearchParams({ sessionKey: key });
      const res = await fetch(`${BASE}/chat/history?${params}`, { signal });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || String(res.status));
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setHistoryError((err as Error).message);
      setMessages([]);
    } finally {
      if (!signal?.aborted) setLoadingHistory(false);
    }
  };

  const openSession = (session: Session) => {
    const key = session.sessionKey || session.key || session.sessionId || "";
    setActiveKey(key);
    setActiveSession(session);
  };

  const startNew = () => {
    setActiveKey(newSessionKey());
    setActiveSession(null);
    setMessages([]);
    setHistoryError("");
  };

  const backToList = async () => {
    setActiveKey("");
    setActiveSession(null);
    setMessages([]);
    setInput("");
    setHistoryError("");
    await loadSessions();
  };

  useEffect(() => { loadSessions(); }, []);

  useEffect(() => {
    if (!initialSessionKey) return;
    setActiveKey(initialSessionKey);
    setActiveSession(null);
  }, [initialSessionKey]);

  useEffect(() => {
    if (!activeKey) return;
    const controller = new AbortController();
    loadHistory(activeKey, controller.signal);
    return () => controller.abort();
  }, [activeKey]);

  const clearSession = async () => {
    if (busy || clearing || !activeKey) return;
    setClearing(true);
    setHistoryError("");
    try {
      const res = await fetch(`${BASE}/chat/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionKey: activeKey })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || String(res.status));
      setMessages([]);
    } catch (err) {
      setHistoryError((err as Error).message);
    } finally {
      setClearing(false);
    }
  };

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    const msg = input.trim();
    if (!msg || busy || loadingHistory || !activeKey) return;
    const history = [...messages, { id: `local-${Date.now()}`, role: "user" as const, content: msg }];
    setMessages(history);
    setInput("");
    setBusy(true);
    setHistoryError("");
    try {
      const res = await fetch(`${BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionKey: activeKey })
      });
      const data = await res.json().catch(() => ({}));
      const reply = data.success ? data.reply : `Error: ${data.message || res.status}`;
      if (data.userMessage && data.assistantMessage) {
        setMessages([...messages, data.userMessage, data.assistantMessage]);
      } else {
        setMessages([...history, { id: `local-reply-${Date.now()}`, role: "assistant", content: reply, meta: data.meta, error: !data.success }]);
      }
      await loadSessions();
    } catch (err) {
      setMessages([...history, { id: `local-error-${Date.now()}`, role: "assistant", content: `Error: ${(err as Error).message}`, error: true }]);
    } finally {
      setBusy(false);
    }
  };

  if (!activeKey) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="grid gap-3">
          <div className="rounded-sm p-3" style={{ background: "linear-gradient(180deg,#f8efd8,#ead8b4 58%,#dec398)", border: "1px solid rgba(70,40,10,0.32)", boxShadow: "0 2px 0 rgba(80,48,14,0.22),0 10px 22px rgba(30,18,8,0.24),inset 0 1px 0 rgba(255,250,220,0.72)" }}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <div className="text-[15px] font-bold text-[#3a2810]">__T_OPENCLAW_CONVERSATIONS_TITLE__</div>
                <div className="mt-0.5 text-[10px] text-[#8b7650]">__T_OPENCLAW_CONVERSATIONS_DESC__</div>
              </div>
              <button
                onClick={startNew}
                className="shrink-0 cursor-pointer rounded px-3 py-1.5 text-[10px] font-bold transition-transform active:translate-y-0.5"
                style={{ background: "linear-gradient(180deg,#d8b868,#b89838,#a08028)", border: "1px solid #8a6a20", color: "#3a2008", boxShadow: "0 2px 0 rgba(60,30,0,0.4),inset 0 1px 1px rgba(255,255,200,0.35)" }}
              >__T_OPENCLAW_NEW_CONVERSATION__</button>
            </div>
            {loadingSessions ? (
              <div className="rounded-sm border border-dashed border-[#9a875d]/45 py-5 text-center text-[11px] text-[#8b7650]">__T_OPENCLAW_LOADING__</div>
            ) : !sessions.length ? (
              <div className="rounded-sm border border-dashed border-[#9a875d]/45 py-5 text-center text-[11px] text-[#8b7650]">__T_OPENCLAW_SESSIONS_EMPTY__</div>
            ) : (
              <div className="grid gap-2">
                {sessions.map((item) => (
                  <button
                    key={item.key || item.sessionId}
                    onClick={() => openSession(item)}
                    className="w-full cursor-pointer rounded-sm border border-[#7a5a22]/20 bg-[#fff7df]/45 px-2.5 py-2 text-left transition-transform active:translate-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-[12px] font-bold text-[#3a2810]">{sessionTitle(item)}</div>
                      <span className="shrink-0 rounded-full border border-[#8a6a20]/20 px-2 py-0.5 text-[9px] text-[#8b7650]">{item.agentId || "main"}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-[#8b7650]">
                      <span className="truncate">{shortModel(item.model)}</span>
                      <span className="shrink-0 tabular-nums">{item.totalTokens || 0} __T_OPENCLAW_TOKEN_UNIT__</span>
                    </div>
                    {formatTime(item.updatedAt) && <div className="mt-0.5 text-[9px] text-[#a08a5f]">{formatTime(item.updatedAt)}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-2 px-4 pb-1.5 pt-2" style={{ background: "linear-gradient(180deg,rgba(35,22,12,0.32),rgba(25,16,9,0.08))", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
        <button
          type="button"
          onClick={backToList}
          className="shrink-0 cursor-pointer rounded px-2.5 py-1 text-[9px] font-bold text-[rgba(245,218,160,0.62)] transition-transform active:translate-y-0.5"
          style={{ background: "linear-gradient(180deg,rgba(90,62,32,0.55),rgba(42,28,14,0.55))", border: "1px solid rgba(145,104,48,0.22)", boxShadow: "0 1px 0 rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,224,160,0.06)" }}
        >
          __T_OPENCLAW_BACK_TO_CONVERSATIONS__
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[11px] font-bold text-[rgba(245,218,160,0.72)]">{sessionTitle(activeSession, activeKey)}</div>
          <div className="truncate text-[9px] text-[rgba(245,218,160,0.3)]">{shortModel(activeSession?.model) || "__T_OPENCLAW_NEW_CONVERSATION__"}</div>
        </div>
        <button
          type="button"
          onClick={clearSession}
          disabled={busy || clearing || loadingHistory || !messages.length}
          className="shrink-0 cursor-pointer rounded px-2.5 py-1 text-[9px] font-bold text-[rgba(245,218,160,0.56)] transition-transform active:translate-y-0.5 disabled:cursor-default disabled:opacity-30"
          style={{ background: "linear-gradient(180deg,rgba(90,62,32,0.55),rgba(42,28,14,0.55))", border: "1px solid rgba(145,104,48,0.22)", boxShadow: "0 1px 0 rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,224,160,0.06)" }}
        >
          {clearing ? "__T_OPENCLAW_CLEARING__" : "__T_OPENCLAW_CLEAR_SESSION__"}
        </button>
      </div>
      <div ref={boxRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loadingHistory && (
          <div className="py-12 text-center text-xs text-[rgba(255,230,180,0.28)]">{"__T_OPENCLAW_LOADING_HISTORY__"}</div>
        )}
        {!loadingHistory && historyError && (
          <div className="py-12 text-center text-xs text-[rgba(255,180,140,0.55)]">{historyError}</div>
        )}
        {!loadingHistory && !historyError && !messages.length && (
          <div className="mx-auto my-10 max-w-[320px] rounded-sm border border-dashed border-[rgba(180,140,80,0.18)] px-4 py-6 text-center text-xs leading-relaxed text-[rgba(255,230,180,0.28)]">
            {activeSession ? "__T_OPENCLAW_NO_LOCAL_TRANSCRIPT__" : "__T_OPENCLAW_CHAT_EMPTY__"}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={m.id || i} className="mb-3">
            {m.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-[14px_14px_4px_14px] px-3.5 py-2.5 text-[13px] leading-relaxed text-[#f0e8d8]" style={{ background: "linear-gradient(135deg,#5a3828,#3a2018)", border: "1px solid rgba(100,70,40,0.3)" }}>{m.content}</div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px]" style={{ background: "radial-gradient(circle at 42% 38%,#6a4a28,#3a2810)", border: "1px solid rgba(100,70,40,0.3)" }}>🦞</div>
                <div className="max-w-[82%]">
                  <div className={`whitespace-pre-wrap rounded-[14px_14px_14px_4px] px-3.5 py-2.5 text-[13px] leading-relaxed ${m.error ? "text-[#f0b090]" : "text-[#d0c0a0]"}`} style={{ background: "rgba(0,0,0,0.12)", border: m.error ? "1px solid rgba(210,90,50,0.28)" : "1px solid rgba(160,140,100,0.1)" }}>{m.content}</div>
                  {m.meta && (
                    <div className="mt-1 flex flex-wrap gap-1.5 pl-1 text-[9px] text-[rgba(235,210,160,0.28)]">
                      {[m.meta.provider && m.meta.model ? `${m.meta.provider}/${m.meta.model}` : "", m.meta.transport, m.meta.fallbackFrom ? `${"__T_OPENCLAW_FALLBACK__"} ${m.meta.fallbackFrom}` : "", m.meta.durationMs ? `${Math.round(m.meta.durationMs / 1000)}s` : ""].filter(Boolean).map((item) => (
                        <span key={item} className="rounded-full border border-[rgba(180,140,80,0.12)] px-2 py-0.5">{item}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {busy && (
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px]" style={{ background: "radial-gradient(circle at 42% 38%,#6a4a28,#3a2810)", border: "1px solid rgba(100,70,40,0.3)" }}>🦞</div>
            <div className="py-2 text-[13px] text-[rgba(255,230,180,0.4)]">{"__T_OPENCLAW_THINKING__"}<span className="animate-pulse">...</span></div>
          </div>
        )}
      </div>
      <div className="shrink-0 px-4 pb-3 pt-2.5" style={{ background: "linear-gradient(180deg,rgba(50,35,20,0.4),rgba(40,28,16,0.6))", borderTop: "1px solid rgba(0,0,0,0.2)", boxShadow: "0 -1px 0 rgba(255,220,150,0.03)" }}>
        <form onSubmit={send} className="flex items-center gap-2 rounded-lg p-1.5" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(80,60,30,0.3)", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4),inset 0 -1px 0 rgba(255,220,150,0.02)" }}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="__T_OPENCLAW_CHAT_PH__"
            disabled={busy}
            rows={1}
            className="oc-chat-input max-h-24 min-h-9 min-w-0 flex-1 resize-none rounded-md px-3.5 py-2 text-[13px] outline-none disabled:opacity-50"
            style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(100,80,40,0.15)", color: "rgba(220,200,160,0.85)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)", fontFamily: "Georgia,'PingFang SC',serif" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || busy || loadingHistory}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-[14px] font-bold text-[#3a2008] transition-all active:translate-y-0.5 disabled:opacity-30"
            style={{ background: "linear-gradient(180deg,#d8b868,#b89838,#a08028)", border: "1px solid #8a6a20", boxShadow: "0 2px 0 rgba(60,30,0,0.4),inset 0 1px 1px rgba(255,255,200,0.3)", textShadow: "0 1px 0 rgba(255,230,160,0.3)" }}
          >↑</button>
        </form>
      </div>
    </div>
  );
}
