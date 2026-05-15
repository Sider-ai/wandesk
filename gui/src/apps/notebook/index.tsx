import { useEffect, useMemo, useState } from "react";
import NotebookEditorView from "./NotebookEditorView";
import NotebookListView from "./NotebookListView";

type Note = {
  id: number | string;
  content?: string;
  style?: number;
  created_at?: string;
  updated_at?: string;
};

const API_BASE = "/apps/notebook";
const PAGE_SIZE = 12;

const CARD_STYLES = [
  { cardCls: "card-yellow-lined min-h-[200px] w-[220px] pt-[30px] px-[15px] pb-[15px]", textCls: "text-[#1c3d5a]", padCls: "pad-yellow-lined", inkCls: "text-[#1c3d5a]" },
  { cardCls: "card-pink-grid min-h-[200px] w-[200px] pt-[25px] px-[15px] pb-[15px]", textCls: "text-[#a00]", padCls: "pad-pink-grid", inkCls: "text-[#a00]" },
  { cardCls: "card-white-grid min-h-[200px] w-[220px] pt-[25px] px-[15px] pb-[15px]", textCls: "text-[#204020]", padCls: "pad-white-grid", inkCls: "text-[#204020]" },
  { cardCls: "card-green-lined min-h-[200px] w-[200px] pt-[25px] px-[15px] pb-[15px]", textCls: "text-[#006600]", padCls: "pad-green-lined", inkCls: "text-[#006600]" },
  { cardCls: "card-blue-dot min-h-[200px] w-[200px] pt-[25px] px-[15px] pb-[15px]", textCls: "text-[#003366]", padCls: "pad-blue-dot", inkCls: "text-[#003366]" },
  { cardCls: "card-orange-ruled min-h-[200px] w-[200px] pt-[25px] px-[15px] pb-[15px]", textCls: "text-[#6a3000]", padCls: "pad-orange-ruled", inkCls: "text-[#6a3000]" },
  { cardCls: "card-kraft min-h-[200px] w-[220px] pt-[25px] px-[15px] pb-[15px]", textCls: "text-[#3a2a1a]", padCls: "pad-kraft", inkCls: "text-[#3a2a1a]" },
  { cardCls: "card-pink-lined min-h-[200px] w-[220px] pt-[25px] px-[15px] pb-[15px]", textCls: "text-[#5a2040]", padCls: "pad-pink-lined", inkCls: "text-[#5a2040]" },
  { cardCls: "card-lavender-diag min-h-[200px] w-[200px] pt-[25px] px-[15px] pb-[15px]", textCls: "text-[#4a2080]", padCls: "pad-lavender-diag", inkCls: "text-[#4a2080]" },
  { cardCls: "card-mint-check min-h-[200px] w-[210px] pt-[25px] px-[15px] pb-[15px]", textCls: "text-[#1a5a4a]", padCls: "pad-mint-check", inkCls: "text-[#1a5a4a]" },
  { cardCls: "card-cream-cross min-h-[200px] w-[210px] pt-[25px] px-[15px] pb-[15px]", textCls: "text-[#6a4a00]", padCls: "pad-cream-cross", inkCls: "text-[#6a4a00]" },
  { cardCls: "card-sky-ruled min-h-[200px] w-[220px] pt-[30px] px-[15px] pb-[15px]", textCls: "text-[#1a3a6a]", padCls: "pad-sky-ruled", inkCls: "text-[#1a3a6a]" }
];
const PIN_COLORS = ["pin-red", "pin-blue", "pin-yellow", "pin-metal"];
const ROTATIONS = [3, -1, -4, 1, -3, 2, 6, -2];

let lastStyle = -1;
const randomStyle = () => {
  let style;
  do {
    style = Math.floor(Math.random() * CARD_STYLES.length);
  } while (style === lastStyle);
  lastStyle = style;
  return style;
};

export default function NotebookApp() {
  const [view, setView] = useState("list");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editorDraft, setEditorDraft] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | string | null>(null);
  const [editorStyle, setEditorStyle] = useState(0);
  const [saving, setSaving] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const cardStyle = (style?: number) => CARD_STYLES[(Number(style) || 0) % CARD_STYLES.length];

  const currentDate = useMemo(() => new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "/"), []);

  const fetchNotes = async (targetPage = page) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(targetPage), pageSize: String(PAGE_SIZE) });
      const res = await fetch(`${API_BASE}/list?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
      setNotes(data.items || []);
      setTotalPages(Number(data.totalPages || 1));
      if (targetPage > Number(data.totalPages || 1)) {
        setPage(Number(data.totalPages || 1));
        return;
      }
    } catch (err) {
      setError((err as Error).message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(page);
  }, [page]);

  const openEditor = (note: Note | null) => {
    setEditingNoteId(note?.id || null);
    setEditorDraft(note?.content || "");
    setEditorStyle(note ? Number(note.style) || 0 : randomStyle());
    setAiDrawerOpen(false);
    setAiLoading(false);
    setAiResult("");
    setShowDeleteConfirm(false);
    setView("editor");
  };

  const backToList = () => {
    setView("list");
    setEditingNoteId(null);
    setEditorDraft("");
    setAiDrawerOpen(false);
    setAiResult("");
    setShowDeleteConfirm(false);
  };

  const saveEditor = async () => {
    const content = editorDraft.trim();
    if (!content || saving) return;
    setSaving(true);
    setError("");
    try {
      const url = editingNoteId ? `${API_BASE}/update` : `${API_BASE}/create`;
      const body = editingNoteId ? { id: editingNoteId, content } : { content, style: editorStyle };
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPage(1);
      await fetchNotes(1);
      backToList();
    } catch (err) {
      setError((err as Error).message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id: number | string) => {
    try {
      const res = await fetch(`${API_BASE}/delete`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchNotes(page);
    } catch (err) {
      setError((err as Error).message || "Failed to delete");
    }
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    if (!editingNoteId) return;
    await deleteNote(editingNoteId);
    backToList();
  };

  const startAssist = async () => {
    const content = editorDraft.trim();
    if (!content || aiLoading) return;
    setAiLoading(true);
    setAiResult("");
    setAiDrawerOpen(true);
    try {
      const res = await fetch(`${API_BASE}/assist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, taskTitle: "Note Assist" })
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);
      setAiResult(data.result || "");
    } catch (err) {
      setError((err as Error).message || "Assist failed");
      setAiDrawerOpen(false);
    } finally {
      setAiLoading(false);
    }
  };

  const formatTime = (value?: string) => {
    if (!value) return "";
    const date = new Date(value.replace(" ", "T"));
    if (Number.isNaN(date.getTime())) return value;
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
  };

  return (
    <div className="h-full min-h-0 overflow-hidden">
      {error && <div className="absolute left-3 top-3 z-[500] rounded bg-red-900/80 px-3 py-2 text-xs text-white">{error}</div>}
      <NotebookListView
        view={view}
        notes={notes}
        page={page}
        totalPages={totalPages}
        loading={loading}
        cardStyle={cardStyle}
        formatTime={formatTime}
        rotations={ROTATIONS}
        pinColors={PIN_COLORS}
        onOpenEditor={openEditor}
        onDeleteNote={deleteNote}
        onPrevPage={() => page > 1 && setPage((next) => next - 1)}
        onNextPage={() => page < totalPages && setPage((next) => next + 1)}
      />
      <NotebookEditorView
        view={view}
        editorDraft={editorDraft}
        setEditorDraft={setEditorDraft}
        editingNoteId={editingNoteId}
        editorStyle={editorStyle}
        saving={saving}
        aiDrawerOpen={aiDrawerOpen}
        aiLoading={aiLoading}
        aiResult={aiResult}
        showDeleteConfirm={showDeleteConfirm}
        currentDate={currentDate}
        cardStyle={cardStyle}
        onBack={backToList}
        onAssist={startAssist}
        onRequestDelete={() => setShowDeleteConfirm(true)}
        onCancelDelete={() => setShowDeleteConfirm(false)}
        onConfirmDelete={confirmDelete}
        onSave={saveEditor}
        onApplyAI={() => { if (aiResult) setEditorDraft(aiResult); setAiDrawerOpen(false); setAiResult(""); }}
        onCloseAI={() => { setAiDrawerOpen(false); setAiResult(""); }}
      />
    </div>
  );
}
