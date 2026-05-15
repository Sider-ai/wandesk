import { useEffect, useMemo, useState } from "react";
import { toast } from "../../stores/toast";
import MemoryCard, { type MemoryItem } from "./components/MemoryCard";

const isEnabled = (item: MemoryItem) => item.enabled === true || item.enabled === 1 || item.enabled === "1";
const isPinned = (item: MemoryItem) => item.pinned === true || item.pinned === 1 || item.pinned === "1";

export default function MemoryApp() {
  const [items, setItems] = useState<MemoryItem[]>([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editId, setEditId] = useState<string | number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  const pinned = useMemo(() => items.filter((item) => isPinned(item) && isEnabled(item)), [items]);
  const enabled = useMemo(() => items.filter((item) => !isPinned(item) && isEnabled(item)), [items]);
  const disabled = useMemo(() => items.filter((item) => !isEnabled(item)), [items]);
  const canSave = editTitle.trim() && editContent.trim();

  const tabs = useMemo(() => [
    { key: "all", label: "All", count: items.length },
    { key: "pinned", label: "Pinned", count: pinned.length },
    { key: "enabled", label: "Starred", count: enabled.length },
    { key: "disabled", label: "Stored", count: disabled.length }
  ], [disabled.length, enabled.length, items.length, pinned.length]);

  const filteredItems = useMemo(() => {
    if (tab === "pinned") return pinned;
    if (tab === "enabled") return enabled;
    if (tab === "disabled") return disabled;
    return items;
  }, [disabled, enabled, items, pinned, tab]);

  const request = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) throw new Error(data.message || `${res.status}`);
    return data;
  };

  const post = (url: string, body: unknown) => request(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await request("/api/memory/list");
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      toast.show((err as Error).message || "Failed to load memory", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!editorOpen) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveEdit();
      }
      if (event.key === "Escape") setEditorOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const togglePin = async (item: MemoryItem) => {
    try {
      if (!isEnabled(item)) {
        await post("/api/memory/update", { id: item.id, enabled: true, pinned: true });
        setItems((list) => list.map((it) => it.id === item.id ? { ...it, enabled: 1, pinned: 1 } : it));
      } else {
        await post("/api/memory/update", { id: item.id, pinned: !isPinned(item) });
        setItems((list) => list.map((it) => it.id === item.id ? { ...it, pinned: isPinned(item) ? 0 : 1 } : it));
      }
    } catch (err) {
      toast.show((err as Error).message || "Failed to update memory", { type: "error" });
    }
  };

  const toggleEnable = async (item: MemoryItem) => {
    try {
      const nextEnabled = !isEnabled(item);
      const payload: Record<string, unknown> = { id: item.id, enabled: nextEnabled };
      if (!nextEnabled && isPinned(item)) payload.pinned = false;
      await post("/api/memory/update", payload);
      setItems((list) => list.map((it) => it.id === item.id ? { ...it, enabled: nextEnabled ? 1 : 0, pinned: !nextEnabled ? 0 : it.pinned } : it));
    } catch (err) {
      toast.show((err as Error).message || "Failed to update memory", { type: "error" });
    }
  };

  const deleteItem = async (item: MemoryItem) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      await post("/api/memory/delete", { id: item.id });
      setItems((list) => list.filter((it) => it.id !== item.id));
    } catch (err) {
      toast.show((err as Error).message || "Failed to delete memory", { type: "error" });
    }
  };

  const openEditor = async (item: MemoryItem | null) => {
    setEditId(item ? item.id : null);
    if (item) {
      setEditTitle(String(item.title || ""));
      setEditDescription(String(item.description || ""));
      try {
        const data = await request(`/api/memory/get?id=${item.id}`);
        setEditContent(String(data.item?.content || ""));
        setEditDescription(String(data.item?.description || ""));
      } catch {
        setEditContent("");
      }
    } else {
      setEditTitle("");
      setEditDescription("");
      setEditContent("");
    }
    setEditorOpen(true);
  };

  const saveEdit = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      const payload = { title: editTitle.trim(), description: editDescription.trim(), content: editContent.trim() };
      if (editId) await post("/api/memory/update", { id: editId, ...payload });
      else await post("/api/memory/create", payload);
      setEditorOpen(false);
      await loadItems();
    } catch (err) {
      toast.show((err as Error).message || "Failed to save memory", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col text-[#2a1f13]" style={{ background: "repeating-linear-gradient(#faf6ef 0px,#faf6ef 31px,rgba(170,150,120,0.08) 31px,rgba(170,150,120,0.08) 32px),linear-gradient(135deg,#faf5eb,#f5efe3)" }}>
      <div className="pointer-events-none absolute bottom-0 left-10 top-0 z-[1] w-[1.5px]" style={{ background: "rgba(220,80,80,0.12)" }} />
      <div className="pointer-events-none absolute bottom-0 left-[44px] top-0 z-[1] w-px" style={{ background: "rgba(220,80,80,0.08)" }} />

      <div className="relative z-[2] flex h-14 shrink-0 items-center justify-between border-b-2 pl-14 pr-5" style={{ borderColor: "rgba(170,150,120,0.1)" }}>
        <div className="flex items-center gap-1">
          {tabs.map((item) => (
            <button
              key={item.key}
              className="rounded-lg px-2.5 py-[5px] text-[15px] font-semibold transition-all hover:text-[rgba(80,55,30,0.55)]"
              style={{ ...(tab === item.key ? { background: "rgba(140,120,80,0.1)", color: "rgba(80,55,30,0.75)" } : { color: "rgba(100,80,50,0.35)" }), fontFamily: "'Caveat','Segoe Print','Comic Sans MS',cursive" }}
              onClick={() => setTab(item.key)}
            >
              {item.label}{Boolean(item.count) && <span className="ml-1 text-[12px] opacity-45">{item.count}</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[16px] transition-all hover:bg-[rgba(92,67,50,0.07)]" style={{ color: "rgba(42,31,19,0.35)" }} onClick={loadItems}>↻</button>
          <button className="rounded-[20px] border-2 border-dashed px-[18px] py-[7px] text-[17px] font-semibold transition-all hover:scale-[1.03] hover:border-[rgba(140,120,80,0.5)] hover:bg-[rgba(255,255,255,0.8)]" style={{ borderColor: "rgba(140,120,80,0.3)", background: "rgba(255,255,255,0.5)", color: "rgba(100,75,40,0.6)", fontFamily: "'Caveat','Segoe Print',cursive", backdropFilter: "blur(4px)" }} onClick={() => openEditor(null)}>+ New</button>
        </div>
      </div>

      <div className="relative z-[2] min-h-0 flex-1 overflow-y-auto py-5 pl-[52px] pr-4 [scrollbar-width:thin]">
        {loading && !items.length ? (
          <div className="flex items-center justify-center py-16"><div className="h-5 w-5 animate-spin rounded-full border-2 border-[rgba(92,67,50,0.12)] border-t-[#5c4332]" /></div>
        ) : !items.length ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-3 text-[52px] opacity-65">📒</div>
            <div className="mb-1 text-[22px] font-bold" style={{ color: "rgba(80,55,30,0.5)", fontFamily: "'Caveat','Segoe Print',cursive" }}>No memories yet</div>
            <div className="mb-5 text-[16px]" style={{ color: "rgba(140,120,90,0.4)", fontFamily: "'Caveat','Segoe Print',cursive" }}>Memories help AI remember your preferences, conventions and decisions</div>
            <button className="rounded-[20px] border-2 border-dashed px-5 py-2 text-[17px] font-semibold transition-all hover:scale-[1.03] hover:bg-[rgba(255,255,255,0.8)]" style={{ borderColor: "rgba(140,120,80,0.3)", background: "rgba(255,255,255,0.5)", color: "rgba(100,75,40,0.6)", fontFamily: "'Caveat','Segoe Print',cursive" }} onClick={() => openEditor(null)}>Create your first memory</button>
          </div>
        ) : !filteredItems.length ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="text-[16px] font-semibold" style={{ color: "rgba(80,55,30,0.4)", fontFamily: "'Caveat','Segoe Print',cursive" }}>No memories in this category</div>
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="w-[calc(50%-8px)]">
                <MemoryCard item={item} onEdit={openEditor} onTogglePin={togglePin} onToggleEnable={toggleEnable} onDelete={deleteItem} />
              </div>
            ))}
          </div>
        )}
      </div>

      {editorOpen && (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-5 py-6" style={{ background: "rgba(60,45,25,0.25)", backdropFilter: "blur(8px)" }} onClick={(event) => { if (event.target === event.currentTarget) setEditorOpen(false); }}>
          <div className="relative flex w-full max-w-[500px] flex-col overflow-hidden rounded-[6px]" style={{ background: "#fef9e8", boxShadow: "0 20px 60px rgba(60,40,10,0.2),0 0 0 1px rgba(0,0,0,0.04)", maxHeight: "85%", backgroundImage: "repeating-linear-gradient(0deg,transparent 0px,transparent 27px,rgba(0,0,0,0.025) 27px,rgba(0,0,0,0.025) 28px)" }}>
            <div className="flex items-center justify-between px-6 pb-3 pt-5" style={{ borderBottom: "1px solid rgba(170,150,120,0.12)" }}>
              <div className="text-[22px] font-bold" style={{ color: "rgba(80,55,30,0.7)", fontFamily: "'Caveat','Segoe Print',cursive" }}>{editId ? "Edit Memory" : "New Memory"}</div>
              <button className="flex h-7 w-7 items-center justify-center rounded-full text-[16px] transition-all hover:bg-[rgba(0,0,0,0.06)]" style={{ color: "rgba(100,80,50,0.4)", background: "rgba(0,0,0,0.04)" }} onClick={() => setEditorOpen(false)}>×</button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-6 py-4 [scrollbar-width:thin]">
              <div>
                <div className="mb-1 text-[14px] font-semibold" style={{ color: "rgba(120,100,60,0.45)", fontFamily: "'Caveat','Segoe Print',cursive" }}>Title</div>
                <input className="w-full rounded-md border-[1.5px] px-3.5 py-2.5 text-[22px] font-bold outline-none transition-all focus:border-[rgba(170,150,100,0.4)] focus:shadow-[0_0_0_3px_rgba(170,150,100,0.08)]" style={{ borderColor: "rgba(170,150,100,0.2)", background: "rgba(255,255,255,0.6)", color: "rgba(60,40,15,0.85)", fontFamily: "'Caveat','Segoe Print',cursive" }} value={editTitle} onChange={(event) => setEditTitle(event.target.value)} placeholder="Give this memory a name" autoFocus />
              </div>
              <div>
                <div className="mb-1 text-[14px] font-semibold" style={{ color: "rgba(120,100,60,0.45)", fontFamily: "'Caveat','Segoe Print',cursive" }}>Description</div>
                <input className="w-full rounded-md border-[1.5px] px-3.5 py-2 text-[17px] outline-none transition-all focus:border-[rgba(170,150,100,0.4)] focus:shadow-[0_0_0_3px_rgba(170,150,100,0.08)]" style={{ borderColor: "rgba(170,150,100,0.2)", background: "rgba(255,255,255,0.6)", color: "rgba(60,40,15,0.85)", fontFamily: "'Caveat','Segoe Print',cursive" }} value={editDescription} onChange={(event) => setEditDescription(event.target.value)} placeholder="One-line summary of what this memory is for" />
                <div className="mt-1 text-[12px]" style={{ color: "rgba(140,120,80,0.3)", fontFamily: "'Caveat','Segoe Print',cursive" }}>When starred, AI sees only the title and description. Pin it for the full content.</div>
              </div>
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-[14px] font-semibold" style={{ color: "rgba(120,100,60,0.45)", fontFamily: "'Caveat','Segoe Print',cursive" }}>Content</div>
                  <div className="text-[12px] tabular-nums" style={{ color: "rgba(140,120,80,0.25)", fontFamily: "'Caveat',cursive" }}>{editContent.length} chars</div>
                </div>
                <textarea className="w-full flex-1 resize-y rounded-md border-[1.5px] px-3.5 py-2.5 text-[16px] leading-[1.7] outline-none transition-all focus:border-[rgba(170,150,100,0.4)] focus:shadow-[0_0_0_3px_rgba(170,150,100,0.08)]" style={{ borderColor: "rgba(170,150,100,0.2)", background: "rgba(255,255,255,0.6)", color: "rgba(60,40,15,0.85)", fontFamily: "'Caveat','Segoe Print',cursive", minHeight: 180 }} value={editContent} onChange={(event) => setEditContent(event.target.value)} placeholder={"Write what you want AI to remember...\nMarkdown supported"} />
                <div className="mt-1 text-[12px]" style={{ color: "rgba(140,120,80,0.28)", fontFamily: "'Caveat','Segoe Print',cursive" }}>AI reads full content only when this memory is pinned</div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 pb-5 pt-3" style={{ borderTop: "1px solid rgba(170,150,120,0.1)" }}>
              <button className="rounded-[20px] border-[1.5px] px-[18px] py-[7px] text-[16px] font-semibold transition-all hover:bg-[rgba(255,255,255,0.8)]" style={{ borderColor: "rgba(170,150,100,0.2)", background: "rgba(255,255,255,0.5)", color: "rgba(100,80,50,0.5)", fontFamily: "'Caveat','Segoe Print',cursive" }} onClick={() => setEditorOpen(false)}>Cancel</button>
              <button className="rounded-[20px] border-none px-[22px] py-[8px] text-[16px] font-bold transition-all hover:translate-y-[-1px] disabled:opacity-30" style={{ background: "rgba(120,85,45,0.75)", color: "#fef6e0", boxShadow: "0 2px 6px rgba(100,70,30,0.2)", fontFamily: "'Caveat','Segoe Print',cursive" }} disabled={!canSave || saving} onClick={saveEdit}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
