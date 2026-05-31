import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const BASE = "/apps/openclaw";

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => requestAnimationFrame(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  });

  useEffect(scrollBottom, [messages, busy]);

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    const msg = input.trim();
    if (!msg || busy) return;
    const history = [...messages, { role: "user" as const, content: msg }];
    setMessages(history);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch(`${BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: messages })
      });
      const data = await res.json().catch(() => ({}));
      const reply = data.success ? data.reply : `Error: ${data.message || res.status}`;
      setMessages([...history, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([...history, { role: "assistant", content: `Error: ${(err as Error).message}` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={boxRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {!messages.length && (
          <div className="py-12 text-center text-xs text-[rgba(255,230,180,0.25)]">{"__T_OPENCLAW_CHAT_EMPTY__"}</div>
        )}
        {messages.map((m, i) => (
          <div key={i} className="mb-3">
            {m.role === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-[14px_14px_4px_14px] px-3.5 py-2.5 text-[13px] leading-relaxed text-[#f0e8d8]" style={{ background: "linear-gradient(135deg,#5a3828,#3a2018)", border: "1px solid rgba(100,70,40,0.3)" }}>{m.content}</div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px]" style={{ background: "radial-gradient(circle at 42% 38%,#6a4a28,#3a2810)", border: "1px solid rgba(100,70,40,0.3)" }}>🦞</div>
                <div className="max-w-[80%] whitespace-pre-wrap rounded-[14px_14px_14px_4px] px-3.5 py-2.5 text-[13px] leading-relaxed text-[#d0c0a0]" style={{ background: "rgba(0,0,0,0.12)", border: "1px solid rgba(160,140,100,0.1)" }}>{m.content}</div>
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
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="__T_OPENCLAW_CHAT_PH__"
            disabled={busy}
            className="oc-chat-input min-w-0 flex-1 rounded-md px-3.5 py-2 text-[13px] outline-none disabled:opacity-50"
            style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(100,80,40,0.15)", color: "rgba(220,200,160,0.85)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)", fontFamily: "Georgia,'PingFang SC',serif" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || busy}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-[14px] font-bold text-[#3a2008] transition-all active:translate-y-0.5 disabled:opacity-30"
            style={{ background: "linear-gradient(180deg,#d8b868,#b89838,#a08028)", border: "1px solid #8a6a20", boxShadow: "0 2px 0 rgba(60,30,0,0.4),inset 0 1px 1px rgba(255,255,200,0.3)", textShadow: "0 1px 0 rgba(255,230,160,0.3)" }}
          >↑</button>
        </form>
      </div>
    </div>
  );
}
