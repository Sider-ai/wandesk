import { ArrowUp, ChevronRight, Paperclip, Square } from "lucide-react";
import { marked } from "marked";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { connect, ensureConnected, on, send, useWsStatus } from "../../system/ws";

marked.setOptions({ breaks: true, gfm: true });

const LAST_CHAT_KEY = "lastConversationId";

type Attachment = {
  type: "file" | "context";
  name?: string;
  path?: string;
  size?: number;
  label?: string;
  scene?: string;
};

type MessageItem = {
  role?: "user" | "assistant" | "tool" | string;
  type?: "tool_call" | "tool_result" | "confirm" | string;
  content?: string;
  result?: string;
  title?: string;
  command?: string;
  detail?: string;
  shell?: boolean;
  expanded?: boolean;
  streaming?: boolean;
  attachments?: Attachment[];
  toolCall?: any;
  _key?: string;
};

export type ChatIntentRequest = {
  requestId: string;
  intent: "new" | "new_and_send" | "load_conversation" | string;
  payload?: Record<string, any>;
};

export type ChatCoreHandle = {
  newChat: () => void;
  openConversation: (conversationId: string) => Promise<void>;
};

type ChatCoreProps = {
  variant?: string;
  conversationId?: string | null;
  pendingMessage?: string | null;
  intentRequest?: ChatIntentRequest | null;
  contextLabel?: string;
  contextScene?: string;
  quickMessages?: string[];
  onConversationChange: (conversationId: string | null) => void;
  onHistoryChange: () => void;
};

const request = async <T,>(url: string, options: RequestInit = {}): Promise<T> => {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || `${res.status} ${res.statusText}`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data;
};

const parseToolArgs = (raw: unknown) => {
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const mapToolCallMessage = (toolCall: any, key?: string): MessageItem => {
  const name = toolCall?.function?.name || "";
  const args = parseToolArgs(toolCall?.function?.arguments);
  if (name === "shell" && args) {
    return { type: "tool_call", shell: true, toolCall, title: args.reason || "shell", command: args.command || "", _key: key, expanded: false };
  }
  return { type: "tool_call", toolCall, title: name || "Tool Call", detail: args ? JSON.stringify(args, null, 2) : "", _key: key, expanded: false };
};

const buildChatTitleFromFirstMessage = (text = "") => String(text).replace(/\s+/g, " ").trim().slice(0, 20) || "New Chat";

const fileExtFromMime = (type = "") => {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "png";
};

const toDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ""));
  reader.onerror = () => reject(new Error("Failed to read file"));
  reader.readAsDataURL(file);
});

const ChatCore = forwardRef<ChatCoreHandle, ChatCoreProps>(function ChatCore({
  conversationId = null,
  pendingMessage = null,
  intentRequest = null,
  contextScene = "chat",
  quickMessages = [],
  onConversationChange,
  onHistoryChange
}, ref) {
  const wsStatus = useWsStatus();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const currentConversationIdRef = useRef<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const messagesRef = useRef<MessageItem[]>([]);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const busyIdsRef = useRef<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const hasMoreRef = useRef(false);
  const [loadedOffset, setLoadedOffset] = useState(0);
  const loadedOffsetRef = useRef(0);
  const [input, setInput] = useState("");
  const [composing, setComposing] = useState(false);
  const composingRef = useRef(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [pendingFiles, setPendingFiles] = useState<Attachment[]>([]);
  const pendingFilesRef = useRef<Attachment[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const dragCounterRef = useRef(0);
  const seenKeysRef = useRef<Set<string>>(new Set());
  const streamingAssistantKeyRef = useRef("");
  const lastIntentRequestIdRef = useRef<string | null>(null);
  const msgBoxRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const busy = useMemo(() => isSending || (!!currentConversationId && busyIds.has(currentConversationId)), [busyIds, currentConversationId, isSending]);
  const canSend = !!input.trim() || pendingFiles.length > 0;

  const setMessagesSynced = useCallback((updater: MessageItem[] | ((items: MessageItem[]) => MessageItem[])) => {
    setMessages((items) => {
      const next = typeof updater === "function" ? updater(items) : updater;
      messagesRef.current = next;
      return next;
    });
  }, []);

  const updateCurrentConversationId = useCallback((id: string | null) => {
    currentConversationIdRef.current = id;
    setCurrentConversationId(id);
  }, []);

  const saveLastChatId = useCallback((id: string) => {
    if (!id) return;
    updateCurrentConversationId(id);
    localStorage.setItem(LAST_CHAT_KEY, String(id));
    onConversationChange(id);
  }, [onConversationChange, updateCurrentConversationId]);

  const setBusy = useCallback((cid: string | null | undefined, value: boolean) => {
    if (!cid) return;
    const next = new Set(busyIdsRef.current);
    if (value) next.add(cid);
    else next.delete(cid);
    busyIdsRef.current = next;
    setBusyIds(next);
  }, []);

  const addUniqueMessages = useCallback((items: MessageItem[], { prepend = false } = {}) => {
    const uniq: MessageItem[] = [];
    for (const item of items) {
      const key = item?._key;
      if (key && seenKeysRef.current.has(key)) continue;
      if (key) seenKeysRef.current.add(key);
      uniq.push(item);
    }
    setMessagesSynced((current) => prepend ? [...uniq, ...current] : uniq);
  }, [setMessagesSynced]);

  const parseMessages = useCallback((raw: any[]) => {
    const list: MessageItem[] = [];
    for (const message of raw || []) {
      const base = message && message._id != null ? `db:${message._id}` : null;
      if (message.role === "assistant" && message.tool_calls?.length) {
        if (message.content) list.push({ role: "assistant", content: message.content, _key: base ? `${base}:assistant` : undefined });
        let toolIdx = 0;
        for (const toolCall of message.tool_calls) {
          list.push(mapToolCallMessage(toolCall, base ? `${base}:tool_call:${toolIdx}` : undefined));
          toolIdx += 1;
        }
        continue;
      }
      if (message.role === "tool") {
        for (let i = list.length - 1; i >= 0; i -= 1) {
          if ((list[i].type === "tool_call" || list[i].type === "confirm") && !list[i].result) {
            list[i].result = message.content;
            break;
          }
        }
        continue;
      }
      if (message.role === "assistant" && message.content) {
        list.push({ role: "assistant", content: message.content, _key: base ? `${base}:assistant` : undefined });
        continue;
      }
      if (message.role === "user" && message.content) {
        const attachments = Array.isArray(message._meta?.attachments) ? message._meta.attachments : [];
        list.push({ role: "user", content: message.content, attachments, _key: base ? `${base}:user` : undefined });
      }
    }
    return list;
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    const doScroll = () => {
      const el = msgBoxRef.current;
      if (!el) return;
      if (smooth) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      else el.scrollTop = el.scrollHeight;
    };
    queueMicrotask(() => {
      doScroll();
      requestAnimationFrame(doScroll);
      window.setTimeout(doScroll, 80);
    });
  }, []);

  const isNearBottom = useCallback(() => {
    const el = msgBoxRef.current;
    if (!el) return true;
    return el.scrollHeight - (el.scrollTop + el.clientHeight) < 140;
  }, []);

  const loadChatPage = useCallback(async (id: string, offset = 0, limit = 20) => {
    const params = new URLSearchParams({ conversationId: id, offset: String(offset), limit: String(limit) });
    const data = await request<{ hasMore: boolean; offset: number; messages: any[] }>(`/api/chat/messages?${params.toString()}`);
    setHasMore(data.hasMore);
    hasMoreRef.current = data.hasMore;
    const nextOffset = (data.offset || 0) + data.messages.length;
    setLoadedOffset(nextOffset);
    loadedOffsetRef.current = nextOffset;
    const parsed = parseMessages(data.messages);
    if (offset <= 0) {
      seenKeysRef.current = new Set();
      addUniqueMessages(parsed, { prepend: false });
    } else {
      addUniqueMessages(parsed, { prepend: true });
    }
  }, [addUniqueMessages, parseMessages]);

  const resetState = useCallback(() => {
    updateCurrentConversationId(null);
    setMessagesSynced([]);
    setHasMore(false);
    hasMoreRef.current = false;
    setLoadedOffset(0);
    loadedOffsetRef.current = 0;
    seenKeysRef.current = new Set();
    streamingAssistantKeyRef.current = "";
  }, [setMessagesSynced, updateCurrentConversationId]);

  const createNewChat = useCallback(async (title = "New Chat") => {
    const data = await request<{ conversationId: string }>("/api/chat/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, scene: contextScene })
    });
    setMessagesSynced([]);
    setHasMore(false);
    hasMoreRef.current = false;
    setLoadedOffset(0);
    loadedOffsetRef.current = 0;
    seenKeysRef.current = new Set();
    saveLastChatId(data.conversationId);
    onHistoryChange();
    return data.conversationId;
  }, [contextScene, onHistoryChange, saveLastChatId, setMessagesSynced]);

  const ensureChatId = useCallback(async (text: string) => {
    if (currentConversationIdRef.current) return currentConversationIdRef.current;
    return createNewChat(buildChatTitleFromFirstMessage(text));
  }, [createNewChat]);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const openConversation = useCallback(async (id: string) => {
    if (!id) {
      resetState();
      onConversationChange(null);
      return;
    }
    saveLastChatId(id);
    setMessagesSynced([]);
    setHasMore(false);
    hasMoreRef.current = false;
    setLoadedOffset(0);
    loadedOffsetRef.current = 0;
    seenKeysRef.current = new Set();
    streamingAssistantKeyRef.current = "";
    try {
      await loadChatPage(id, 0, 20);
      scrollToBottom(false);
    } catch (error: any) {
      if (error?.status === 404) {
        resetState();
        onConversationChange(null);
        return;
      }
      setMessagesSynced((items) => [...items, { role: "assistant", content: `Error: ${error.message}` }]);
    }
  }, [loadChatPage, onConversationChange, resetState, saveLastChatId, scrollToBottom, setMessagesSynced]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!canSend || busy) return;
    setIsSending(true);

    try {
      await ensureConnected();
    } catch {
      setMessagesSynced((items) => [...items, { role: "assistant", content: "Error: WebSocket is not connected. Check whether the service has started." }]);
      setIsSending(false);
      return;
    }

    const content = text || "Please read the attachment first and summarize the key information.";
    const outgoingAttachments = pendingFilesRef.current.map((file) => ({ type: "file", name: file.name, path: file.path, size: file.size }));

    ensureChatId(text).then((id) => {
      setBusy(id, true);
      const key = `client:${Date.now()}:user`;
      seenKeysRef.current.add(key);
      setMessagesSynced((items) => [...items, { role: "user", content: text, attachments: outgoingAttachments as Attachment[], _key: key }]);
      send({ type: "message", conversationId: id, content, attachments: outgoingAttachments });
      setInput("");
      setPendingFiles([]);
      pendingFilesRef.current = [];
      queueMicrotask(() => {
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        scrollToBottom();
        onHistoryChange();
      });
    }).catch((error) => {
      setMessagesSynced((items) => [...items, { role: "assistant", content: `Error: ${error.message}` }]);
    }).finally(() => {
      setIsSending(false);
    });
  }, [busy, canSend, ensureChatId, input, onHistoryChange, scrollToBottom, setBusy, setMessagesSynced]);

  const stopBusy = useCallback(() => {
    const cid = currentConversationIdRef.current;
    send({ type: "abort", conversationId: cid });
    setBusy(cid, false);
  }, [setBusy]);

  const newChat = useCallback(() => {
    resetState();
    onConversationChange(null);
  }, [onConversationChange, resetState]);

  const sendQuick = useCallback((msg: string) => {
    setInput(msg);
    queueMicrotask(() => void handleSend());
  }, [handleSend]);

  const handleIntentRequest = useCallback((req: ChatIntentRequest | null | undefined) => {
    if (!req?.requestId || req.requestId === lastIntentRequestIdRef.current) return;
    lastIntentRequestIdRef.current = req.requestId;
    const intent = req.intent || "open";
    const payload = req.payload || {};

    if (intent === "new") {
      newChat();
      return;
    }

    if (intent === "new_and_send") {
      newChat();
      setInput(String(payload.message || ""));
      queueMicrotask(() => {
        autoResize();
        void handleSend();
      });
      return;
    }

    if (intent === "load_conversation") {
      const id = String(payload.conversationId || "").trim();
      if (id) void openConversation(id);
    }
  }, [autoResize, handleSend, newChat, openConversation]);

  const uploadSingleFile = useCallback(async (file: File) => {
    const dataUrl = await toDataUrl(file);
    const res = await request<{ file: Attachment }>("/api/chat/attachments/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: file.name, data: dataUrl })
    });
    return res.file;
  }, []);

  const appendFiles = useCallback(async (files: File[] = []) => {
    if (!files.length) return;
    setUploadError("");
    setUploading(true);
    try {
      const uploadedFiles: Attachment[] = [];
      for (const file of files) {
        const uploaded = await uploadSingleFile(file);
        if (uploaded?.path) uploadedFiles.push(uploaded);
      }
      if (uploadedFiles.length) {
        pendingFilesRef.current = [...pendingFilesRef.current, ...uploadedFiles];
        setPendingFiles(pendingFilesRef.current);
      }
    } catch (error: any) {
      setUploadError(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [uploadSingleFile]);

  const onPickFiles = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    await appendFiles(Array.from(event.target?.files || []));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [appendFiles]);

  const onPaste = useCallback(async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (busy) return;
    const items = Array.from(event.clipboardData?.items || []);
    const files = items
      .filter((item) => item.kind === "file" && String(item.type || "").startsWith("image/"))
      .map((item, index) => {
        const file = item.getAsFile();
        if (!file) return null;
        const ext = fileExtFromMime(file.type);
        const name = file.name && file.name !== "image.png" ? file.name : `pasted-image-${Date.now()}-${index + 1}.${ext}`;
        return new File([file], name, { type: file.type || `image/${ext}` });
      })
      .filter(Boolean) as File[];
    if (!files.length) return;
    event.preventDefault();
    await appendFiles(files);
  }, [appendFiles, busy]);

  const hasDraggedFiles = (event: React.DragEvent) => Array.from(event.dataTransfer?.types || []).includes("Files");

  const onDragEnter = (event: React.DragEvent) => {
    if (!hasDraggedFiles(event) || busy) return;
    dragCounterRef.current += 1;
    setDragActive(true);
  };

  const onDragOver = (event: React.DragEvent) => {
    if (!hasDraggedFiles(event) || busy) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setDragActive(true);
  };

  const onDragLeave = (event: React.DragEvent) => {
    if (!hasDraggedFiles(event)) return;
    dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
    if (dragCounterRef.current === 0) setDragActive(false);
  };

  const onDropFiles = async (event: React.DragEvent) => {
    event.preventDefault();
    dragCounterRef.current = 0;
    setDragActive(false);
    if (busy) return;
    await appendFiles(Array.from(event.dataTransfer?.files || []));
  };

  const removePendingFile = (index: number) => {
    pendingFilesRef.current = pendingFilesRef.current.filter((_, itemIndex) => itemIndex !== index);
    setPendingFiles(pendingFilesRef.current);
  };

  const onScroll = useCallback(() => {
    const el = msgBoxRef.current;
    const id = currentConversationIdRef.current;
    if (!el || !hasMoreRef.current || !id) return;
    if (el.scrollTop < 50) {
      const oldHeight = el.scrollHeight;
      loadChatPage(id, loadedOffsetRef.current, 20).then(() => {
        queueMicrotask(() => {
          if (msgBoxRef.current) msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight - oldHeight;
        });
      }).catch(() => {});
    }
  }, [loadChatPage]);

  useImperativeHandle(ref, () => ({ newChat, openConversation }), [newChat, openConversation]);

  useEffect(() => {
    if (conversationId === currentConversationIdRef.current) return;
    if (!conversationId) {
      newChat();
      return;
    }
    void openConversation(conversationId);
  }, [conversationId, newChat, openConversation]);

  useEffect(() => {
    handleIntentRequest(intentRequest);
  }, [handleIntentRequest, intentRequest?.requestId]);

  useEffect(() => {
    if (!isNearBottom()) return;
    scrollToBottom(true);
  }, [messages.length, isNearBottom, scrollToBottom]);

  useEffect(() => {
    if (wsStatus === "disconnected") connect();

    const unsubs = [
      on("delta", (data) => {
        setBusy(data.conversationId, true);
        if (data.conversationId !== currentConversationIdRef.current) return;
        let key = streamingAssistantKeyRef.current;
        if (!key) {
          key = `ws:${Date.now()}:assistant_stream`;
          streamingAssistantKeyRef.current = key;
          seenKeysRef.current.add(key);
          setMessagesSynced((items) => [...items, { role: "assistant", content: "", _key: key, streaming: true }]);
        }
        setMessagesSynced((items) => items.map((item) => item._key === key ? { ...item, content: `${item.content || ""}${data.delta || ""}` } : item));
        scrollToBottom(true);
      }),
      on("done", (data) => {
        setBusy(data.conversationId, false);
        onHistoryChange();
        if (data.conversationId !== currentConversationIdRef.current) return;
        const key = streamingAssistantKeyRef.current;
        if (key) {
          setMessagesSynced((items) => items.map((item) => item._key === key ? { ...item, content: data.content || item.content || "", streaming: false } : item));
        } else if (data.content) {
          const doneKey = `ws:${Date.now()}:assistant_done`;
          seenKeysRef.current.add(doneKey);
          setMessagesSynced((items) => [...items, { role: "assistant", content: data.content, _key: doneKey, streaming: false }]);
        }
        streamingAssistantKeyRef.current = "";
      }),
      on("tool_call", (data) => {
        setBusy(data.conversationId, true);
        if (data.conversationId !== currentConversationIdRef.current) return;
        const streamKey = streamingAssistantKeyRef.current;
        if (streamKey) {
          setMessagesSynced((items) => items.map((item) => item._key === streamKey ? { ...item, streaming: false } : item));
          streamingAssistantKeyRef.current = "";
        }
        const key = `ws:${Date.now()}:tool_call`;
        seenKeysRef.current.add(key);
        setMessagesSynced((items) => [...items, mapToolCallMessage(data.toolCall, key)]);
      }),
      on("tool_result", (data) => {
        setBusy(data.conversationId, true);
        if (data.conversationId !== currentConversationIdRef.current) return;
        let updated = false;
        setMessagesSynced((items) => {
          const next = [...items];
          for (let i = next.length - 1; i >= 0; i -= 1) {
            if (next[i].type === "tool_call" && !next[i].result) {
              next[i] = { ...next[i], result: data.content };
              updated = true;
              break;
            }
          }
          return updated ? next : [...next, { type: "tool_result", content: data.content, _key: `ws:${Date.now()}:tool_result` }];
        });
      }),
      on("error", (data) => {
        setBusy(data.conversationId, false);
        if (data.conversationId !== currentConversationIdRef.current) return;
        const key = `ws:${Date.now()}:error`;
        seenKeysRef.current.add(key);
        setMessagesSynced((items) => [...items, { role: "assistant", content: `Error: ${data.content}`, _key: key }]);
        streamingAssistantKeyRef.current = "";
      }),
      on("aborted", (data) => {
        setBusy(data.conversationId, false);
        if (data.conversationId !== currentConversationIdRef.current) return;
        streamingAssistantKeyRef.current = "";
      })
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [onHistoryChange, scrollToBottom, setBusy, setMessagesSynced, wsStatus]);

  useEffect(() => {
    if (intentRequest) return;

    if (pendingMessage) {
      setInput(pendingMessage);
      queueMicrotask(() => void handleSend());
      return;
    }

    if (conversationId) {
      void openConversation(conversationId);
      return;
    }

    request<any[]>("/api/chat/list").then((list) => {
      const lastChatId = localStorage.getItem(LAST_CHAT_KEY);
      const target = list.find((item) => item.conversation_id === lastChatId) || list[0];
      if (target?.conversation_id) void openConversation(target.conversation_id);
    }).catch(() => {});
  }, []);

  const renderMd = (text?: string) => ({ __html: String(marked.parse(text || "")) });

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col" style={{ background: "#f5f3ef" }}>
      <div className="flex min-h-0 flex-1 flex-col">
        <div ref={msgBoxRef} className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]" style={{ scrollbarColor: "rgba(160,120,80,0.2) transparent" }} onScroll={onScroll}>
          <div className="mx-auto flex max-w-[720px] flex-col gap-0 px-5 py-6">
            {!messages.length ? (
              <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 text-[40px]">💬</div>
                <h2 className="mb-2 text-xl font-bold" style={{ color: "#2a1f13" }}>How can I help?</h2>
                <p className="max-w-[320px] text-[13px] leading-relaxed" style={{ color: "rgba(0,0,0,0.38)" }}>Start a conversation with anything. Auto-execute commands or manual confirmation mode are both supported.</p>
                {quickMessages.length > 0 && <div className="mt-5 flex flex-wrap justify-center gap-2">{quickMessages.map((msg) => <button key={msg} className="rounded-full border px-3 py-1.5 text-[12px]" style={{ borderColor: "rgba(160,120,80,0.18)", color: "#5c4332" }} onClick={() => sendQuick(msg)}>{msg}</button>)}</div>}
              </div>
            ) : (
              <>
                {hasMore && <div className="py-2 text-center text-xs" style={{ color: "rgba(0,0,0,0.35)" }}>Load more...</div>}
                {messages.map((message, index) => (
                  <div key={message._key || index} className="mb-5" data-message-key={message._key || ""}>
                    {message.role === "user" && (
                      <div className="flex justify-end">
                        <div className="max-w-[85%] overflow-x-auto rounded-[18px_18px_4px_18px] px-4 py-3 text-sm leading-relaxed" style={{ background: "#e8e0d4", color: "#2a1f13", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                          <div className="whitespace-pre-wrap [word-break:break-word]">{message.content}</div>
                          {!!message.attachments?.length && (
                            <div className="mt-2">
                              {message.attachments.map((file, fileIndex) => file.type === "file" ? (
                                <div key={fileIndex} className="mb-1 rounded-lg px-2 py-1" style={{ border: "1px solid rgba(160,120,80,0.2)", background: "rgba(255,255,255,0.4)" }}>
                                  <div className="text-[11px] font-semibold" style={{ color: "#2a1f13" }}>{file.name}</div>
                                  <div className="break-all text-[10px]" style={{ color: "rgba(0,0,0,0.4)" }}>{file.path}</div>
                                </div>
                              ) : (
                                <div key={fileIndex} className="mb-1 inline-block rounded-full px-2.5 py-0.5 text-[10px]" style={{ border: "1px solid rgba(160,120,80,0.2)", background: "rgba(255,255,255,0.3)", color: "rgba(0,0,0,0.45)" }}>{file.label}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {message.role === "assistant" && (
                      <div className="flex items-start">
                        <div className="min-w-0 flex-1">
                          <div
                            className="prose prose-sm max-w-none overflow-x-auto rounded-[18px_18px_18px_4px] px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] prose-headings:text-[#2a1f13] prose-pre:overflow-x-auto prose-pre:border prose-pre:bg-[#f0ece5] prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-blockquote:text-[rgba(0,0,0,0.5)]"
                            style={{ background: "#fff", border: "1px solid rgba(160,120,80,0.15)", color: "#3d2f1e" } as React.CSSProperties}
                            dangerouslySetInnerHTML={renderMd(message.content)}
                          />
                        </div>
                      </div>
                    )}

                    {message.type === "tool_call" && (
                      <div className="flex items-start gap-2.5">
                        <div className="min-w-0 flex-1 overflow-hidden rounded-xl" style={{ border: "1px solid rgba(160,120,80,0.18)", background: "#fff" }}>
                          <button type="button" className="flex w-full cursor-pointer items-center gap-2 border-none px-3 py-2 text-left transition-colors" style={{ background: "rgba(160,120,80,0.05)" }} onClick={() => setMessagesSynced((items) => items.map((item) => item === message ? { ...item, expanded: !item.expanded } : item))}>
                            <ChevronRight className={`h-3 w-3 shrink-0 transition-transform ${message.expanded ? "rotate-90" : ""}`} style={{ color: "rgba(0,0,0,0.35)" }} />
                            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs" style={{ color: "#3d2f1e" }}>{message.title || "Tool Call"}</span>
                            {message.result && <span className="shrink-0 text-[11px]" style={{ color: "rgba(0,0,0,0.35)" }}>Done</span>}
                          </button>
                          {message.expanded && (
                            <div style={{ borderTop: "1px solid rgba(160,120,80,0.12)" }}>
                              {message.shell && message.command ? <div className="overflow-x-auto whitespace-pre px-3 py-2.5 font-mono text-xs" style={{ background: "rgba(160,120,80,0.04)", color: "#5c7a50" }}><span className="select-none" style={{ color: "rgba(0,0,0,0.3)" }}>$ </span>{message.command}</div> : message.detail ? <div className="overflow-x-auto whitespace-pre px-3 py-2.5 font-mono text-xs" style={{ background: "#fff", color: "#5c7a50" }}>{message.detail}</div> : null}
                              {message.result && <div className="max-h-48 overflow-auto whitespace-pre px-3 py-2.5 font-mono text-[11px]" style={{ borderTop: "1px solid rgba(160,120,80,0.1)", background: "rgba(160,120,80,0.03)", color: "rgba(0,0,0,0.45)" }}>{message.result}</div>}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {(message.role === "tool" || message.type === "tool_result") && (
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center"><span className="h-1.5 w-1.5 rounded-full" style={{ background: "rgba(160,120,80,0.3)" }} /></div>
                        <div className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-xs leading-relaxed" style={{ color: "rgba(0,0,0,0.35)" }}>{message.result || message.content}</div>
                      </div>
                    )}
                  </div>
                ))}
                {busy && <div className="flex items-start"><div className="py-2 text-sm" style={{ color: "rgba(160,120,80,0.6)" }}>Thinking<span className="animate-pulse">...</span></div></div>}
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-0" style={{ background: "linear-gradient(to top,#f5f3ef 60%,transparent)" }}>
          <div className="mx-auto max-w-[720px]">
            <form
              className={`relative flex flex-col rounded-2xl ${dragActive ? "ring-2 ring-offset-2" : ""}`}
              style={dragActive ? { border: "1px solid rgba(160,120,80,0.4)", background: "#fff", boxShadow: "0 2px 12px rgba(160,120,80,0.12)" } : { border: "1px solid rgba(160,120,80,0.18)", background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              onSubmit={(event) => {
                event.preventDefault();
                void handleSend();
              }}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDropFiles}
            >
              <input ref={fileInputRef} type="file" className="hidden" multiple onChange={onPickFiles} />
              {dragActive && <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center text-sm font-semibold" style={{ borderColor: "rgba(160,120,80,0.4)", background: "rgba(160,120,80,0.04)", color: "#5c4332" }}>{uploading ? "Uploading..." : "Drag files here to add attachments"}</div>}
              {!!pendingFiles.length && <div className="flex flex-wrap gap-1.5 px-3.5 pb-0 pt-2.5">{pendingFiles.map((file, index) => <div key={`${file.path}-${index}`} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px]" style={{ border: "1px solid rgba(160,120,80,0.2)", background: "rgba(160,120,80,0.06)", color: "#3d2f1e" }}><span className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap">{file.name}</span><button type="button" className="border-none bg-transparent text-xs" style={{ color: "rgba(0,0,0,0.35)" }} onClick={() => removePendingFile(index)}>x</button></div>)}</div>}
              {uploadError && <p className="px-3.5 pb-0 pt-2 text-xs text-red-500">{uploadError}</p>}

              <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                disabled={busy}
                placeholder={busy ? "In progress..." : "Type a message..."}
                className="min-h-[52px] max-h-[200px] w-full resize-none overflow-y-auto border-none bg-transparent px-4 pb-3 pt-3.5 pr-12 text-sm leading-relaxed outline-none disabled:opacity-50"
                style={{ color: "#2a1f13" }}
                onInput={autoResize}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    if (composingRef.current || composing) return;
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                onPaste={onPaste}
                onCompositionStart={() => {
                  composingRef.current = true;
                  setComposing(true);
                }}
                onCompositionEnd={() => {
                  composingRef.current = false;
                  setComposing(false);
                }}
              />

              <div className="flex items-center px-3.5 pb-2.5">
                <button type="button" disabled={busy || uploading} className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg border-none bg-transparent px-2.5 text-xs transition-all disabled:cursor-not-allowed disabled:opacity-50" style={{ color: "rgba(160,120,80,0.6)" }} onClick={() => { setUploadError(""); fileInputRef.current?.click(); }}>
                  <Paperclip className="h-3.5 w-3.5" />
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              </div>

              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                {busy ? (
                  <button type="button" className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-none text-white transition-opacity hover:opacity-80" style={{ background: "#5c4332" }} onClick={stopBusy}>
                    <Square className="h-3.5 w-3.5 fill-current" />
                  </button>
                ) : (
                  <button type="submit" disabled={!canSend} className="flex h-[34px] w-[34px] items-center justify-center rounded-full border transition-all" style={canSend ? { cursor: "pointer", borderColor: "transparent", background: "#5c4332", color: "#fff", boxShadow: "0 2px 8px rgba(92,67,50,0.3)" } : { cursor: "default", borderColor: "rgba(160,120,80,0.2)", background: "rgba(160,120,80,0.06)", color: "rgba(160,120,80,0.35)" }}>
                    <ArrowUp className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px]" style={{ color: "rgba(0,0,0,0.3)" }}>
            <span className={`h-1.5 w-1.5 rounded-full ${wsStatus === "connected" ? "bg-emerald-500" : wsStatus === "connecting" ? "animate-pulse bg-amber-400" : "bg-red-400"}`} />
            <span>{wsStatus === "connected" ? "Connected" : wsStatus === "connecting" ? "Connecting..." : "Disconnected"}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatCore;
