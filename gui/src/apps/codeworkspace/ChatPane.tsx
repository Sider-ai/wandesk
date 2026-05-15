import { useEffect, useMemo, useRef, useState } from "react";
import type { PermissionMode, Session } from "./types";
import { eventToMessage, fetchJson, formatTime } from "./utils";

export function ChatPane({ basePath, title, emptyIcon, installed, defaultPermissionMode, permissionModes }: {
  basePath: string;
  title: string;
  emptyIcon: string;
  installed: boolean;
  defaultPermissionMode: string;
  permissionModes: PermissionMode[];
}) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentId, setCurrentId] = useState("");
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [live, setLive] = useState<any[]>([]);
  const [cwd, setCwd] = useState("~/Desktop");
  const [permissionMode, setPermissionMode] = useState(defaultPermissionMode);
  const [modeOpen, setModeOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const activeMode = permissionModes.find((mode) => mode.id === permissionMode) || permissionModes[0];
  const rendered = useMemo(() => [...messages.map(eventToMessage), ...live.map((payload, index) => eventToMessage(payload, index))], [messages, live]);

  const loadSessions = async () => {
    try {
      const data = await fetchJson(`${basePath}/conversations`);
      setSessions(data.items || []);
    } catch {}
  };

  useEffect(() => {
    loadSessions();
  }, [basePath]);

  const reset = () => {
    abortRef.current?.abort();
    setCurrentId("");
    setCurrentSession(null);
    setMessages([]);
    setLive([]);
    setError("");
  };

  const openConversation = async (sessionId: string) => {
    abortRef.current?.abort();
    setCurrentId(sessionId);
    const found = sessions.find((item) => item.sessionId === sessionId) || null;
    setCurrentSession(found);
    setPermissionMode(found?.permissionMode || permissionMode);
    setLive([]);
    setError("");
    try {
      const data = await fetchJson(`${basePath}/messages?conversationId=${encodeURIComponent(sessionId)}`);
      setMessages(data.items || []);
    } catch {
      setMessages([]);
    }
  };

  const removeConversation = async (sessionId: string) => {
    if (!window.confirm("Delete this session?")) return;
    await fetch(`${basePath}/conversations/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sessionId })
    });
    if (currentId === sessionId) reset();
    await loadSessions();
  };

  const ensureSession = async () => {
    if (currentId) return currentId;
    const data = await fetchJson(`${basePath}/conversations/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cwd, permissionMode })
    });
    const item = data.item;
    setCurrentId(item.sessionId);
    setCurrentSession(item);
    await loadSessions();
    return item.sessionId;
  };

  const send = async () => {
    const message = input.trim();
    if (!message || busy || !installed) return;
    setBusy(true);
    setError("");
    setInput("");
    setLive((items) => [...items, { type: "user", message: { role: "user", content: message } }]);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const conversationId = await ensureSession();
      const res = await fetch(`${basePath}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message, permissionMode }),
        signal: controller.signal
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const evt = JSON.parse(line);
          if (evt.type === "event") setLive((items) => [...items, evt.payload]);
          if (evt.type === "error") setError(evt.message || "Request failed");
        }
      }
      await openConversation(conversationId);
      await loadSessions();
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError((err as Error).message || "Send failed");
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-row bg-[#f5f3ef]">
      <aside className="flex w-56 shrink-0 flex-col border-r bg-[#ede9e2]" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
        <div className="border-b px-3 py-2.5" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
          <button className="flex w-full items-center justify-center gap-1.5 rounded-[9px] border px-3 py-2 text-[13px] font-semibold" style={{ borderColor: "rgba(92,67,50,0.14)", background: "rgba(255,255,255,0.58)", color: "rgba(61,47,30,0.82)" }} onClick={reset}>+ New Session</button>
        </div>
        <div className="flex-1 overflow-y-auto px-1.5 py-1.5 [scrollbar-width:thin]">
          {!sessions.length && <div className="px-3 py-4 text-center text-[11px] text-black/35">No sessions yet</div>}
          {sessions.map((session) => (
            <div key={session.sessionId} className="group mb-1 cursor-pointer rounded-lg px-2.5 py-2" style={currentId === session.sessionId ? { background: "rgba(255,255,255,0.85)", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" } : undefined} onClick={() => openConversation(session.sessionId)}>
              <div className="flex items-center gap-1">
                <div className="flex-1 truncate text-[12.5px] text-[#2a1f13]">{session.title?.trim() || `Session ${session.sessionId.slice(0, 8)}`}</div>
                <button className="shrink-0 px-1 text-[11px] opacity-0 group-hover:opacity-60 hover:!opacity-100" onClick={(event) => { event.stopPropagation(); removeConversation(session.sessionId); }}>✕</button>
              </div>
              <div className="cc-mono mt-0.5 truncate text-[10.5px] text-black/40">{session.cwd}</div>
              <div className="truncate text-[10px] text-black/35">{session.messageCount || 0} events · {formatTime(session.updatedAt)}</div>
            </div>
          ))}
        </div>
      </aside>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]" style={{ scrollbarColor: "rgba(160,120,80,0.2) transparent" }}>
          <div className="mx-auto flex max-w-[720px] flex-col gap-0 px-5 py-6">
            {!rendered.length ? (
              <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 text-[40px]">{emptyIcon}</div>
                <h2 className="mb-2 text-xl font-bold text-[#2a1f13]">{title}</h2>
                <p className="max-w-[320px] text-[13px] leading-relaxed text-black/40">Pick a directory below and start typing.</p>
              </div>
            ) : rendered.map((message) => (
              <div key={message.key} className="mb-5">
                {String(message.role).includes("user") ? (
                  <div className="flex justify-end"><div className="max-w-[85%] overflow-x-auto rounded-[18px_18px_4px_18px] bg-[#e8e0d4] px-4 py-3 text-sm leading-relaxed text-[#2a1f13] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"><div className="whitespace-pre-wrap break-words">{message.content}</div></div></div>
                ) : String(message.role).includes("error") ? (
                  <div className="rounded-lg bg-[#fde2e2] px-3 py-2 text-[12px] text-[#8b1a1a]">{message.content}</div>
                ) : (
                  <div className="flex items-start"><pre className="min-w-0 flex-1 whitespace-pre-wrap rounded-[18px_18px_18px_4px] border bg-white px-4 py-3 text-sm leading-relaxed text-[#3d2f1e] shadow-[0_1px_3px_rgba(0,0,0,0.06)]" style={{ borderColor: "rgba(160,120,80,0.15)", fontFamily: "inherit" }}>{message.content}</pre></div>
                )}
              </div>
            ))}
            {busy && <div className="py-2 text-sm text-[rgba(160,120,80,0.6)]">Thinking<span className="animate-pulse">...</span></div>}
          </div>
        </div>
        <div className="shrink-0 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-0" style={{ background: "linear-gradient(to top,#f5f3ef 60%,transparent)" }}>
          <div className="mx-auto max-w-[720px]">
            <form className="relative flex flex-col rounded-2xl border bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]" style={{ borderColor: "rgba(160,120,80,0.18)" }} onSubmit={(event) => { event.preventDefault(); send(); }}>
              <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={1} disabled={busy || !installed} placeholder={busy ? "Replying..." : currentId ? "Continue the conversation..." : `Start in ${cwd}...`} className="min-h-[52px] max-h-[200px] w-full resize-none overflow-y-auto border-none bg-transparent px-4 pb-3 pr-[176px] pt-3.5 text-sm leading-relaxed text-[#2a1f13] outline-none disabled:opacity-50" onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} />
              {error && <div className="px-3.5 pb-2 text-[11px] text-[#b03a20]">{error}</div>}
              <div className="flex items-center gap-2 px-3.5 pb-2.5">
                {!currentId ? (
                  <input value={cwd} onChange={(event) => setCwd(event.target.value)} className="cc-mono h-7 min-w-[320px] max-w-[420px] rounded-lg px-2.5 text-[12px] outline-none" style={{ border: "1px solid rgba(160,120,80,0.3)", background: "#fff", color: "#2a1f13" }} placeholder="~/Desktop" />
                ) : (
                  <div className="inline-flex h-7 max-w-[420px] items-center gap-1.5 rounded-lg px-2.5 text-xs text-[rgba(160,120,80,0.6)]"><span>📁</span><span className="cc-mono truncate">{currentSession?.cwd}</span></div>
                )}
              </div>
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                <div className="relative">
                  <button type="button" className="inline-flex h-[28px] items-center rounded-md border-none px-2 text-[11px] font-semibold text-[rgba(160,120,80,0.82)] hover:bg-[rgba(160,120,80,0.08)]" onClick={() => setModeOpen((open) => !open)}>
                    <span className="cc-mono">{activeMode.label}</span>
                  </button>
                  {modeOpen && <div className="absolute bottom-[calc(100%+8px)] right-0 z-20 w-[320px] overflow-hidden rounded-xl border bg-[#fffaf2] shadow-[0_16px_40px_rgba(0,0,0,0.14)]" style={{ borderColor: "rgba(160,120,80,0.16)" }}>
                    {permissionModes.map((mode) => <button key={mode.id} type="button" className="block w-full px-3 py-2.5 text-left hover:bg-[rgba(160,120,80,0.08)]" onClick={() => { setPermissionMode(mode.id); setModeOpen(false); }}>
                      <div className="flex items-center justify-between gap-3"><span className="cc-mono text-[11px] font-semibold text-[#2a1f13]">{mode.label}</span>{permissionMode === mode.id && <span className="text-[10px] text-[#5c4332]">Current</span>}</div>
                      <div className="mt-1 text-[11px] leading-relaxed text-[#6b5a46]">{mode.description}</div>
                    </button>)}
                  </div>}
                </div>
                {busy ? <button type="button" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#5c4332] text-white" onClick={() => abortRef.current?.abort()}>■</button> : <button type="submit" disabled={!input.trim() || !installed} className="flex h-[34px] w-[34px] items-center justify-center rounded-full border transition-all disabled:cursor-default disabled:opacity-40" style={input.trim() && installed ? { borderColor: "transparent", background: "#5c4332", color: "#fff", boxShadow: "0 2px 8px rgba(92,67,50,0.3)" } : { borderColor: "rgba(160,120,80,0.2)", background: "rgba(160,120,80,0.06)", color: "rgba(160,120,80,0.35)" }}>↑</button>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
