import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import HistoryPanel, { type ChatSummary } from "./History";
import ChatCore, { type ChatCoreHandle, type ChatIntentRequest } from "./chat";

export default function ChatApp({
  windowId: _windowId,
  pendingMessage = null,
  intentRequest = null
}: {
  windowId?: string;
  pendingMessage?: string | null;
  intentRequest?: ChatIntentRequest | null;
}) {
  const chatRef = useRef<ChatCoreHandle | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const refreshHistory = () => setHistoryRefreshKey((key) => key + 1);

  const openChatFromHistory = (chat: ChatSummary) => {
    setCurrentConversationId(chat.conversation_id);
  };

  const newChat = () => {
    setCurrentConversationId(null);
    chatRef.current?.newChat();
  };

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden" style={{ background: "#f5f3ef" }}>
      <div className="flex w-56 shrink-0 flex-col border-r" style={{ background: "#ede9e2", borderColor: "rgba(0,0,0,0.07)" }}>
        <div className="border-b px-3 py-2.5" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
          <button
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[9px] border px-3 py-2 text-[13px] font-semibold transition-all"
            style={{ borderColor: "rgba(92,67,50,0.14)", background: "rgba(255,255,255,0.58)", color: "rgba(61,47,30,0.82)" }}
            onMouseOver={(event) => { event.currentTarget.style.background = "rgba(255,255,255,0.78)"; }}
            onMouseLeave={(event) => { event.currentTarget.style.background = "rgba(255,255,255,0.58)"; }}
            onClick={newChat}
          >
            <Plus className="h-3.5 w-3.5" />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-1.5 py-1.5 [scrollbar-width:thin]">
          <HistoryPanel activeId={currentConversationId} refreshKey={historyRefreshKey} onOpenChat={openChatFromHistory} />
        </div>
      </div>

      <ChatCore
        ref={chatRef}
        variant="desktop"
        conversationId={currentConversationId}
        pendingMessage={pendingMessage}
        intentRequest={intentRequest}
        onConversationChange={(conversationId) => setCurrentConversationId(conversationId || null)}
        onHistoryChange={refreshHistory}
      />
    </div>
  );
}
