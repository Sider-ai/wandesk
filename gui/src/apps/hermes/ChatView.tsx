import { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage } from "./api";
import { brassButton, darkButton, leather, muted, paper } from "./materials";
import type { HermesMessage } from "./types";

const localId = () => `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const roleLabel = (role: string) => {
  if (role === "assistant") return "Hermes";
  if (role === "user") return "__T_HERMES_YOU__";
  if (role === "tool") return "__T_HERMES_TOOL__";
  return role || "__T_HERMES_NOTE__";
};

function MessageCard({ message }: { message: HermesMessage }) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[86%] rounded-sm px-3 py-2.5"
        style={isAssistant ? paper : {
          background: isUser ? "linear-gradient(180deg,#174947,#0a2827)" : "linear-gradient(180deg,#1d2e2d,#101b1b)",
          border: "1px solid rgba(255,230,203,0.15)",
          color: "#ffe6cb",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.06)"
        }}
      >
        <div className="mb-1 flex items-center justify-between gap-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: isAssistant ? "#7a3b1c" : "#d6b15f" }}>{roleLabel(message.role)}</span>
          {message.timestamp ? <span className="font-mono text-[8px]" style={{ color: isAssistant ? "#967047" : "#8fb5ad" }}>{new Date(message.timestamp * 1000).toLocaleTimeString()}</span> : null}
        </div>
        <div className="whitespace-pre-wrap break-words text-[12px] leading-relaxed" style={{ color: isAssistant ? "#2b1a08" : "#ffe6cb" }}>{message.content || message.toolName}</div>
      </div>
    </div>
  );
}

export default function ChatView({
  sessionId,
  onSessionChange
}: {
  sessionId: string;
  onSessionChange: (sessionId: string) => void;
}) {
  const [messages, setMessages] = useState<HermesMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadSession = async () => {
    if (!sessionId) {
      setMessages([]);
      return;
    }
    setError("");
    try {
      setMessages(await getMessages(sessionId));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => { loadSession(); }, [sessionId]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, busy]);

  const submit = async () => {
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    setBusy(true);
    setError("");
    const userMessage: HermesMessage = { id: localId(), role: "user", content: text, timestamp: Date.now() / 1000 };
    setMessages((current) => [...current, userMessage]);
    try {
      const res = await sendMessage(text, sessionId || undefined);
      const nextSessionId = res.meta?.sessionId || sessionId;
      if (nextSessionId && nextSessionId !== sessionId) onSessionChange(nextSessionId);
      const assistantMessage: HermesMessage = { id: localId(), role: "assistant", content: res.reply || "", timestamp: Date.now() / 1000 };
      setMessages((current) => [...current, assistantMessage]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
      <div className="mb-3 rounded-md p-3" style={leather}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d6b15f]">__T_HERMES_MESSAGE_CHANNEL__</div>
            <div className="mt-1 text-[12px]" style={{ color: muted }}>__T_HERMES_MESSAGE_DESC__</div>
          </div>
          <button className="cursor-pointer rounded px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={darkButton} onClick={() => onSessionChange("")}>__T_HERMES_NEW_THREAD__</button>
        </div>
        <div className="flex items-center gap-2 rounded-sm border border-[#ffe6cb]/16 bg-[#031514]/75 px-2.5 py-2">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8fb5ad]">__T_HERMES_SESSION_ID__</span>
          <input
            value={sessionId}
            onChange={(event) => onSessionChange(event.target.value)}
            placeholder="20260531_..."
            className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-[#ffe6cb] outline-none placeholder:text-[#55706c]"
          />
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-md p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ background: "linear-gradient(180deg,rgba(2,18,18,0.72),rgba(2,14,14,0.88))", border: "1px solid rgba(255,230,203,0.12)", boxShadow: "inset 0 0 30px rgba(0,0,0,0.32)" }}>
        {!messages.length ? (
          <div className="flex h-full min-h-[220px] items-center justify-center text-center">
            <div className="max-w-[280px] rounded-sm px-5 py-5" style={paper}>
              <div className="mb-2 text-xl text-[#7a3b1c]">✉</div>
              <div className="text-[13px] font-bold text-[#2b1a08]">__T_HERMES_EMPTY_TITLE__</div>
              <div className="mt-1 text-[11px] leading-relaxed text-[#7a603a]">__T_HERMES_EMPTY_DESC__</div>
            </div>
          </div>
        ) : messages.map((message) => <MessageCard key={message.id} message={message} />)}
        {busy && <div className="font-mono text-[11px] text-[#d6b15f]">__T_HERMES_DELIVERING__</div>}
      </div>

      {error && <div className="mt-2 rounded border border-[#ffd279]/25 bg-[#2c1108]/55 px-3 py-2 text-[11px] text-[#ffd6a0]">{error}</div>}

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          placeholder="__T_HERMES_INPUT_PLACEHOLDER__"
          className="min-h-[74px] resize-none rounded-md px-3 py-2 text-[13px] leading-relaxed outline-none"
          style={{
            background: "linear-gradient(180deg,#fff1d0,#e2c28b)",
            border: "1px solid rgba(55,32,7,0.45)",
            color: "#2b1a08",
            boxShadow: "inset 0 2px 5px rgba(74,43,11,0.18),0 3px 0 rgba(0,0,0,0.25)",
            fontFamily: "Georgia,'PingFang SC',serif"
          }}
        />
        <button
          onClick={submit}
          disabled={busy || !draft.trim()}
          className="w-[92px] cursor-pointer rounded-md text-[11px] font-bold uppercase tracking-[0.13em] active:translate-y-0.5 disabled:cursor-default disabled:opacity-55"
          style={brassButton}
        >
          {busy ? "__T_HERMES_WAIT__" : "__T_HERMES_SEND__"}
        </button>
      </div>
    </div>
  );
}
