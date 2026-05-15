import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type ChatSummary = {
  conversation_id: string;
  title?: string;
  created_at?: string;
};

const emptyStyle = { color: "rgba(0,0,0,0.35)" };
const activeRowStyle = { background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" };
const inputStyle = { borderColor: "rgba(160,120,80,0.3)", background: "#fff", color: "#2a1f13" };
const titleStyle = { color: "rgba(0,0,0,0.6)" };
const activeTitleStyle = { color: "#3d2f1e" };
const subtleStyle = { color: "rgba(0,0,0,0.3)" };
const actionColor = "rgba(0,0,0,0.3)";
const actionHoverBackground = "rgba(160,120,80,0.1)";
const actionHoverColor = "#5c4332";

const request = async <T,>(url: string, options: RequestInit = {}): Promise<T> => {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
  return data;
};

export default function HistoryPanel({
  activeId,
  refreshKey,
  onOpenChat
}: {
  activeId: string | null;
  refreshKey: number;
  onOpenChat: (chat: ChatSummary) => void;
}) {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const deleteTimerRef = useRef<number | null>(null);

  const fetchChats = async () => {
    setChats(await request<ChatSummary[]>("/api/chat/list"));
  };

  useEffect(() => {
    void fetchChats();
  }, [refreshKey]);

  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  useEffect(() => () => {
    if (deleteTimerRef.current) window.clearTimeout(deleteTimerRef.current);
  }, []);

  const startRename = (chat: ChatSummary) => {
    setEditingId(chat.conversation_id);
    setEditTitle(chat.title || "");
  };

  const cancelRename = () => setEditingId(null);

  const confirmRename = (conversationId: string) => {
    if (editingId !== conversationId) return;
    const title = editTitle.trim();
    if (title) {
      request("/api/chat/rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, title })
      }).then(fetchChats).catch(() => {});
    }
    setEditingId(null);
  };

  const confirmDelete = (conversationId: string) => {
    if (deletingId === conversationId) {
      if (deleteTimerRef.current) window.clearTimeout(deleteTimerRef.current);
      setDeletingId(null);
      request("/api/chat/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId })
      }).then(fetchChats).catch(() => {});
      return;
    }
    setDeletingId(conversationId);
    deleteTimerRef.current = window.setTimeout(() => setDeletingId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-0.5">
      {!chats.length && <div className="py-12 text-center text-sm" style={emptyStyle}>No chat history yet</div>}

      {chats.map((chat) => {
        const active = activeId === chat.conversation_id;
        return (
          <div
            key={chat.conversation_id}
            className="group flex items-center gap-2 rounded-[9px] px-3 py-2 transition-colors"
            style={active ? activeRowStyle : undefined}
            onMouseOver={(event) => {
              if (!active) event.currentTarget.style.background = "rgba(0,0,0,0.04)";
            }}
            onMouseLeave={(event) => {
              if (!active) event.currentTarget.style.background = "transparent";
            }}
          >
            {editingId === chat.conversation_id ? (
              <input
                ref={editInputRef}
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") confirmRename(chat.conversation_id);
                  if (event.key === "Escape") cancelRename();
                }}
                onBlur={() => confirmRename(chat.conversation_id)}
                className="min-w-0 flex-1 rounded-[8px] border px-2.5 py-1 text-[13px] outline-none"
                style={inputStyle}
              />
            ) : (
              <>
                <button onClick={() => onOpenChat(chat)} className="min-w-0 flex-1 cursor-pointer border-none bg-transparent p-0 text-left">
                  <div className="truncate text-[13px] font-medium" style={active ? activeTitleStyle : titleStyle}>{chat.title || chat.conversation_id.slice(0, 8)}</div>
                  <div className="mt-0.5 text-[10px]" style={subtleStyle}>{chat.created_at}</div>
                </button>

                <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  {deletingId !== chat.conversation_id && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        startRename(chat);
                      }}
                      title="Rename"
                      className="flex h-6 w-6 items-center justify-center rounded-[6px] border-none bg-transparent transition-all"
                      style={{ background: "transparent", color: actionColor }}
                      onMouseOver={(event) => {
                        event.currentTarget.style.background = actionHoverBackground;
                        event.currentTarget.style.color = actionHoverColor;
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.background = "transparent";
                        event.currentTarget.style.color = actionColor;
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                  )}
                  {deletingId === chat.conversation_id && <span className="px-1 text-[10px] text-red-500">Confirm delete?</span>}
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      confirmDelete(chat.conversation_id);
                    }}
                    title={deletingId === chat.conversation_id ? "Click to confirm" : "Delete"}
                    className="flex h-6 w-6 items-center justify-center rounded-[6px] border-none transition-all"
                    style={deletingId === chat.conversation_id ? { background: "#dc2626", color: "#fff" } : { background: "transparent", color: actionColor }}
                    onMouseOver={(event) => {
                      if (deletingId !== chat.conversation_id) {
                        event.currentTarget.style.background = "rgba(220,38,38,0.1)";
                        event.currentTarget.style.color = "#dc2626";
                      }
                    }}
                    onMouseLeave={(event) => {
                      if (deletingId !== chat.conversation_id) {
                        event.currentTarget.style.background = "transparent";
                        event.currentTarget.style.color = actionColor;
                      }
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
