import { useEffect, useRef, useState } from "react";

type ChatMeta = { provider?: string; model?: string; transport?: string; fallbackFrom?: string; durationMs?: number; sessionKey?: string };
type Message = { id?: number | string; role: "user" | "assistant"; content: string; meta?: ChatMeta; error?: boolean; createdAt?: string };

const BASE = "/apps/openclaw";

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [sessionKey, setSessionKey] = useState("wandesk");
  const boxRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => requestAnimationFrame(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  });

  useEffect(() => { scrollBottom(); }, [messages, busy]);

  const loadHistory = async (key = sessionKey, signal?: AbortSignal) => {
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

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => loadHistory(sessionKey, controller.signal), 240);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [sessionKey]);

  const clearSession = async () => {
    if (busy || clearing) return;
    setClearing(true);
    setHistoryError("");
    try {
      const res = await fetch(`${BASE}/chat/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionKey })
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
    if (!msg || busy || loadingHistory) return;
    const history = [...messages, { id: `local-${Date.now()}`, role: "user" as const, content: msg }];
    setMessages(history);
    setInput("");
    setBusy(true);
    setHistoryError("");
    try {
      const res = await fetch(`${BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionKey })
      });
      const data = await res.json().catch(() => ({}));
      const reply = data.success ? data.reply : `Error: ${data.message || res.status}`;
      if (data.userMessage && data.assistantMessage) {
        setMessages([...messages, data.userMessage, data.assistantMessage]);
      } else {
        setMessages([...history, { id: `local-reply-${Date.now()}`, role: "assistant", content: reply, meta: data.meta, error: !data.success }]);
      }
    } catch (err) {
      setMessages([...history, { id: `local-error-${Date.now()}`, role: "assistant", content: `Error: ${(err as Error).message}`, error: true }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-2 px-4 pb-1.5 pt-2" style={{ background: "linear-gradient(180deg,rgba(35,22,12,0.32),rgba(25,16,9,0.08))", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
        <div className="text-[9px] font-bold tracking-wider text-[rgba(245,218,160,0.42)]">__T_OPENCLAW_SESSION_KEY__</div>
        <input
          value={sessionKey}
          onChange={(event) => setSessionKey(event.target.value)}
          className="min-w-0 flex-1 rounded px-2 py-1 font-mono text-[10px] outline-none"
          style={{ background: "rgba(0,0,0,0.22)", border: "1px solid rgba(110,80,40,0.2)", color: "rgba(220,200,160,0.82)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.35)" }}
        />
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
          <div className="py-12 text-center text-xs text-[rgba(255,230,180,0.25)]">{"__T_OPENCLAW_CHAT_EMPTY__"}</div>
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
