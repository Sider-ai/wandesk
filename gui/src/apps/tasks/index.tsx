import { useCallback, useEffect, useMemo, useState } from "react";
import { on } from "../../system/ws";

type TaskRow = {
  id: string | number;
  title?: string;
  app?: string;
  mode?: string;
  status?: string;
  payload?: unknown;
  error?: string;
  created_at?: string;
  finished_at?: string;
};

type TaskMessage = {
  id?: string | number;
  createdAt?: string;
  message?: {
    role?: string;
    content?: unknown;
    name?: string;
    tool_calls?: Array<{ function?: { name?: string; arguments?: unknown } }>;
  };
};

const parseSqlDate = (value?: string) => {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const date = new Date(raw.includes("T") ? raw : raw.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateTime = (value?: string) => {
  const date = parseSqlDate(value);
  return date ? date.toLocaleString() : "-";
};

const formatCompactDateTime = (value?: string) => {
  const date = parseSqlDate(value);
  if (!date) return "-";
  return date.toLocaleString([], { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const parsePayload = (payload: unknown) => {
  if (!payload) return {};
  if (typeof payload === "object") return payload as Record<string, unknown>;
  try {
    return JSON.parse(String(payload));
  } catch {
    return {};
  }
};

const messageContentText = (content: unknown) => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((part) => (part && typeof part === "object" ? (part as any).text : "")).filter(Boolean).join("\n");
  return "";
};

const payloadPreview = (payload: unknown) => {
  const parsed = parsePayload(payload);
  const messages = Array.isArray(parsed.messages) ? parsed.messages : [];
  const firstUser = messages.find((msg: any) => msg?.role === "user");
  const text = messageContentText(firstUser?.content).trim();
  if (text) return text;
  return Object.keys(parsed).length ? JSON.stringify(parsed, null, 2) : "";
};

const modeLabel = (mode?: string) => {
  if (mode === "instant") return "Instant";
  if (mode === "agent") return "Agent";
  return mode || "-";
};

const statusLabel = (status?: string) => ({
  pending: "Running",
  running: "Running",
  done: "Done",
  error: "Error",
  aborted: "Aborted"
}[status || ""] || status || "-");

const dotColor = (status?: string) => {
  if (status === "pending" || status === "running") return "#c9a56e";
  if (status === "done") return "#7e8d5a";
  if (status === "error") return "#b03a20";
  return "rgba(140,100,60,0.35)";
};

const tagStyle = (status?: string) => {
  if (status === "pending" || status === "running") return { background: "rgba(201,165,110,0.18)", color: "#7a5220" };
  if (status === "done") return { background: "rgba(126,141,90,0.18)", color: "#4a5a28" };
  if (status === "error") return { background: "rgba(176,58,32,0.12)", color: "#b03a20" };
  return { background: "rgba(140,100,60,0.1)", color: "rgba(120,80,40,0.55)" };
};

const isToolCall = (item: TaskMessage) => Array.isArray(item.message?.tool_calls) && item.message!.tool_calls!.length > 0;

const roleLabel = (item: TaskMessage) => {
  const role = item.message?.role;
  if (role === "user") return "User";
  if (role === "assistant" && isToolCall(item)) return "Tool Call";
  if (role === "assistant") return "AI";
  if (role === "tool") return "Tool Result";
  return "Unknown";
};

const roleStyle = (item: TaskMessage) => {
  const role = item.message?.role;
  if (role === "user") return { background: "rgba(201,165,110,0.2)", color: "#7a5220" };
  if (role === "assistant" && isToolCall(item)) return { background: "rgba(126,90,140,0.15)", color: "#5a3a7a" };
  if (role === "assistant") return { background: "rgba(92,67,50,0.12)", color: "#5c4332" };
  if (role === "tool") return { background: "rgba(126,141,90,0.18)", color: "#4a5a28" };
  return { background: "rgba(140,100,60,0.1)", color: "rgba(120,80,40,0.6)" };
};

const msgToolName = (item: TaskMessage) => {
  const msg = item.message || {};
  if (msg.name) return msg.name;
  if (Array.isArray(msg.tool_calls) && msg.tool_calls.length) return msg.tool_calls[0]?.function?.name || "";
  return "";
};

const renderContent = (item: TaskMessage) => {
  const msg = item.message || {};
  if (typeof msg.content === "string" && msg.content.trim()) {
    const text = msg.content;
    if (text.length <= 800) return text;
    return `${text.slice(0, 560)}\n\nContent is too long. ${text.length - 800} characters were omitted\n\n${text.slice(-240)}`;
  }
  return JSON.stringify(msg, null, 2);
};

const formatArgs = (args: unknown) => {
  if (!args) return "";
  try {
    const parsed = typeof args === "string" ? JSON.parse(args) : args;
    if ((parsed as any).command) return (parsed as any).command;
    return JSON.stringify(parsed, null, 2);
  } catch {
    return String(args);
  }
};

export default function TasksApp() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [detailTask, setDetailTask] = useState<TaskRow | null>(null);
  const [messages, setMessages] = useState<TaskMessage[]>([]);
  const [error, setError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [stopping, setStopping] = useState(false);

  const request = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) throw new Error(data.message || data.error || `HTTP ${res.status}`);
    return data;
  };

  const loadTasks = useCallback(async () => {
    setError("");
    try {
      const data = await request("/api/task?limit=200");
      setTasks(Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      setError((err as Error).message || "Failed to load");
    }
  }, []);

  const loadDetail = useCallback(async (task = detailTask) => {
    if (!task) return;
    setDetailError("");
    try {
      const [td, tm] = await Promise.all([
        request(`/api/task/detail?id=${task.id}`),
        request(`/api/task/messages?id=${task.id}`)
      ]);
      setDetailTask(td.task || task);
      setMessages(Array.isArray(tm.messages) ? tm.messages : []);
    } catch (err) {
      setDetailError((err as Error).message || "Failed to load");
    }
  }, [detailTask]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => on("tasks_changed", () => {
    loadTasks();
    if (detailTask) loadDetail(detailTask);
  }), [detailTask, loadDetail, loadTasks]);

  const filters = useMemo(() => {
    const countBy = (status: string) => status === "error"
      ? tasks.filter((task) => task.status === "error" || task.status === "aborted").length
      : tasks.filter((task) => task.status === status || (status === "pending" && task.status === "running")).length;
    return [
      { key: "all", label: "All", count: tasks.length },
      { key: "pending", label: "Running", count: countBy("pending") },
      { key: "done", label: "Done", count: countBy("done") },
      { key: "error", label: "Error", count: countBy("error") }
    ];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (activeFilter === "all") return tasks;
    if (activeFilter === "pending") return tasks.filter((task) => task.status === "pending" || task.status === "running");
    if (activeFilter === "error") return tasks.filter((task) => task.status === "error" || task.status === "aborted");
    return tasks.filter((task) => task.status === activeFilter);
  }, [activeFilter, tasks]);

  const openDetail = async (task: TaskRow) => {
    setDetailTask(task);
    setMessages([]);
    setDetailError("");
    setStopping(false);
    await loadDetail(task);
  };

  const stopTask = async () => {
    if (stopping || !detailTask || (detailTask.status !== "pending" && detailTask.status !== "running")) return;
    setStopping(true);
    setDetailError("");
    try {
      await request("/api/task/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: detailTask.id })
      });
      await loadDetail(detailTask);
    } catch (err) {
      setDetailError((err as Error).message || "Failed to stop");
    } finally {
      setStopping(false);
    }
  };

  const detailFacts = detailTask ? [
    { key: "created", label: "Created at:", value: formatDateTime(detailTask.created_at) },
    { key: "finished", label: "Finished at:", value: formatDateTime(detailTask.finished_at) },
    { key: "app", label: "App:", value: detailTask.app || "-" },
    { key: "mode", label: "Mode", value: modeLabel(detailTask.mode) }
  ] : [];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f7f4ef] text-[#2a1f13]">
      {!detailTask ? (
        <>
          <div className="flex shrink-0 items-center gap-1 border-b px-3 py-2" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(247,244,239,0.9)" }}>
            {filters.map((filter) => (
              <button
                key={filter.key}
                className="inline-flex items-center gap-1 rounded-full px-3 py-[3px] text-[11.5px] font-semibold transition hover:bg-[rgba(140,100,60,0.08)]"
                style={activeFilter === filter.key ? { background: "#5c4332", color: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" } : { background: "transparent", color: "rgba(42,31,19,0.55)" }}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
                <span className="inline-block rounded-full px-[6px] text-[9px] font-bold tabular-nums" style={activeFilter === filter.key ? { background: "rgba(255,255,255,0.22)", color: "#fff" } : { background: "rgba(140,100,60,0.12)", color: "rgba(120,80,40,0.65)" }}>{filter.count}</span>
              </button>
            ))}
            <span className="flex-1" />
            <button className="flex h-[26px] w-[26px] items-center justify-center rounded-full border transition hover:bg-[rgba(140,100,60,0.08)]" style={{ borderColor: "rgba(0,0,0,0.08)", background: "#fff" }} onClick={loadTasks}>↻</button>
          </div>
          <div className="grid shrink-0 grid-cols-[1fr_64px_78px_88px] gap-1 border-b px-4 py-[7px] text-[9px] font-bold uppercase tracking-[0.08em]" style={{ borderColor: "rgba(0,0,0,0.05)", background: "rgba(238,232,222,0.5)", color: "rgba(120,80,40,0.5)" }}>
            <span>Task</span><span>Mode</span><span>Status</span><span>Time</span>
          </div>
          {error && <div className="mx-3 mt-2 rounded-[10px] border px-3 py-2 text-[12px]" style={{ borderColor: "rgba(176,58,32,0.25)", background: "rgba(176,58,32,0.06)", color: "#b03a20" }}>{error}</div>}
          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
            {!filteredTasks.length ? (
              <div className="flex h-full flex-col items-center justify-center" style={{ color: "rgba(0,0,0,0.35)" }}>
                <div className="mb-1.5 text-[32px] opacity-35">📭</div>
                <div className="text-[12px]">No tasks yet</div>
              </div>
            ) : filteredTasks.map((task) => (
              <button key={task.id} className="grid w-full grid-cols-[1fr_64px_78px_88px] items-center gap-1 border-b px-4 py-[9px] text-left transition-colors hover:bg-[rgba(140,100,60,0.06)]" style={{ borderColor: "rgba(160,120,80,0.08)" }} onClick={() => openDetail(task)}>
                <div className="flex min-w-0 items-center gap-[8px]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dotColor(task.status) }} />
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-semibold text-[#2a1f13]">{task.title || "Untitled Task"}</div>
                    <div className="mt-px text-[10px]" style={{ color: "rgba(120,80,40,0.5)" }}>#{task.id} · {task.app || "-"}</div>
                  </div>
                </div>
                <div className="text-[10.5px]" style={{ color: "rgba(0,0,0,0.45)" }}>{modeLabel(task.mode)}</div>
                <div><span className="inline-block rounded-full px-2 py-[2px] text-[9.5px] font-semibold" style={tagStyle(task.status)}>{statusLabel(task.status)}</span></div>
                <div className="text-[10px] tabular-nums" style={{ color: "rgba(0,0,0,0.35)" }}>{formatCompactDateTime(task.finished_at || task.created_at)}</div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex shrink-0 items-center gap-2 border-b px-3 py-2" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(247,244,239,0.9)" }}>
            <button className="flex items-center gap-1 rounded-full px-3 py-[3px] text-[11.5px] font-semibold text-[#5c4332] transition hover:bg-[rgba(140,100,60,0.1)]" onClick={() => { setDetailTask(null); setMessages([]); }}>‹ Back</button>
            <div className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-[#2a1f13]">{detailTask.title || "Untitled Task"}</div>
            {(detailTask.status === "pending" || detailTask.status === "running") && <button className="rounded-full px-3 py-[3px] text-[10.5px] font-semibold transition disabled:opacity-50" style={{ background: "rgba(176,58,32,0.1)", color: "#b03a20" }} disabled={stopping} onClick={stopTask}>{stopping ? "Stopping..." : "Stop Task"}</button>}
            <button className="flex h-[26px] w-[26px] items-center justify-center rounded-full border transition hover:bg-[rgba(140,100,60,0.08)]" style={{ borderColor: "rgba(0,0,0,0.08)", background: "#fff" }} onClick={() => loadDetail(detailTask)}>↻</button>
          </div>
          {detailError && <div className="mx-3 mt-2 rounded-[10px] border px-3 py-2 text-[12px]" style={{ borderColor: "rgba(176,58,32,0.25)", background: "rgba(176,58,32,0.06)", color: "#b03a20" }}>{detailError}</div>}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 [scrollbar-width:thin]">
            <div className="mb-3 grid grid-cols-4 gap-2">
              {detailFacts.map((fact) => (
                <div key={fact.key} className="rounded-[10px] border px-2.5 py-2" style={{ borderColor: "rgba(160,120,80,0.12)", background: "rgba(255,255,255,0.7)" }}>
                  <div className="text-[9px] uppercase tracking-[0.06em]" style={{ color: "rgba(120,80,40,0.5)" }}>{fact.label}</div>
                  <div className="mt-0.5 text-[11px] font-semibold text-[#2a1f13]">{fact.value}</div>
                </div>
              ))}
            </div>
            {payloadPreview(detailTask.payload) && <>
              <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.08em]" style={{ color: "rgba(120,80,40,0.5)" }}>Payload</div>
              <div className="mb-3 whitespace-pre-wrap break-words rounded-[10px] border px-3 py-2 text-[11.5px] leading-[1.65]" style={{ borderColor: "rgba(160,120,80,0.12)", background: "rgba(255,255,255,0.7)", color: "#3d2f1e" }}>{payloadPreview(detailTask.payload)}</div>
            </>}
            {detailTask.error && <>
              <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.08em]" style={{ color: "rgba(120,80,40,0.5)" }}>Error</div>
              <div className="mb-3 whitespace-pre-wrap break-words rounded-[10px] border px-3 py-2 text-[11.5px] leading-[1.65]" style={{ borderColor: "rgba(176,58,32,0.25)", background: "rgba(176,58,32,0.05)", color: "#b03a20" }}>{detailTask.error}</div>
            </>}
            <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.08em]" style={{ color: "rgba(120,80,40,0.5)" }}>Message History · {messages.length}</div>
            {!messages.length ? (
              <div className="rounded-[10px] border border-dashed py-10 text-center text-[12px]" style={{ borderColor: "rgba(160,120,80,0.2)", background: "rgba(255,255,255,0.5)", color: "rgba(0,0,0,0.35)" }}>No messages yet</div>
            ) : (
              <div className="space-y-1.5">
                {[...messages].reverse().map((item, index) => (
                  <div key={item.id || index} className="rounded-[10px] border px-3 py-[9px]" style={{ borderColor: "rgba(160,120,80,0.12)", background: "rgba(255,255,255,0.78)" }}>
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <span className="rounded-full px-2 py-[1px] text-[9px] font-bold uppercase tracking-[0.05em]" style={roleStyle(item)}>{roleLabel(item)}</span>
                      {msgToolName(item) && <span className="text-[9px]" style={{ color: "rgba(120,80,40,0.5)" }}>{msgToolName(item)}</span>}
                    </div>
                    {isToolCall(item) ? (
                      item.message!.tool_calls!.map((tc, i) => <div key={i} className="break-all rounded-[8px] px-2.5 py-1.5 text-[10.5px] leading-[1.6]" style={{ background: "rgba(140,100,60,0.08)", color: "rgba(80,55,30,0.85)", fontFamily: "'SF Mono','Fira Code',monospace" }}>{formatArgs(tc.function?.arguments)}</div>)
                    ) : (
                      <div className="whitespace-pre-wrap break-words text-[11.5px] leading-[1.65]" style={{ color: "#3d2f1e" }}>{renderContent(item)}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
