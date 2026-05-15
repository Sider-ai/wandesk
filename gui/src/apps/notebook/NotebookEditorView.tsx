type CardStyle = {
  cardCls: string;
  textCls: string;
  padCls: string;
  inkCls: string;
};

export default function NotebookEditorView({
  view,
  editorDraft,
  setEditorDraft,
  editingNoteId,
  editorStyle,
  saving,
  aiDrawerOpen,
  aiLoading,
  aiResult,
  showDeleteConfirm,
  currentDate,
  cardStyle,
  onBack,
  onAssist,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  onSave,
  onApplyAI,
  onCloseAI
}: {
  view: string;
  editorDraft: string;
  setEditorDraft: (value: string) => void;
  editingNoteId: number | string | null;
  editorStyle: number;
  saving: boolean;
  aiDrawerOpen: boolean;
  aiLoading: boolean;
  aiResult: string;
  showDeleteConfirm: boolean;
  currentDate: string;
  cardStyle: (style?: number) => CardStyle;
  onBack: () => void;
  onAssist: () => void;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  onSave: () => void;
  onApplyAI: () => void;
  onCloseAI: () => void;
}) {
  if (view === "list") return null;
  const style = cardStyle(editorStyle);

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#2b1d14]">
      <div className="clipboard-board relative flex h-[90%] w-full max-w-[500px] flex-col items-center rounded-b-3xl rounded-t-2xl">
        <div className="absolute top-[10px] z-30 flex w-[140px] flex-col items-center">
          <div className="clip-base relative h-[25px] w-full rounded border border-[#555]">
            <div className="rivet absolute left-[15px] top-[7px] h-2.5 w-2.5 rounded-full" />
            <div className="rivet absolute right-[15px] top-[7px] h-2.5 w-2.5 rounded-full" />
          </div>
          <div className="clip-jaw -mt-[5px] z-[35] h-5 w-[120px] rounded-b-[10px] border border-t-0 border-[#666]" />
        </div>

        <div className={`legal-pad relative z-10 mt-10 min-h-0 w-[90%] flex-1 overflow-hidden rounded-b ${style.padCls}`}>
          <div className="pad-binding absolute inset-x-0 top-0 h-4 border-b border-dashed border-white/20 shadow-[0_2px_3px_rgba(0,0,0,0.4)]" />
          <div className={`absolute right-4 top-[25px] rotate-2 font-mono text-[13px] font-bold opacity-50 ${style.inkCls}`}>REC: {currentDate}</div>
          <textarea
            value={editorDraft}
            onChange={(event) => setEditorDraft(event.target.value)}
            className={`absolute inset-0 resize-none border-none bg-transparent pb-4 pl-[55px] pr-4 pt-[50px] font-['Comic_Sans_MS','Chalkboard_SE',cursive] text-lg leading-[30px] tracking-wide outline-none placeholder:italic placeholder:opacity-30 ${style.inkCls}`}
            placeholder="Capture your idea fragments here..."
            spellCheck={false}
            autoFocus
          />
        </div>

        <div className="bottom-zone z-40 flex w-full shrink-0 flex-col overflow-hidden rounded-b-3xl">
          <div className={`ai-drawer overflow-hidden ${aiDrawerOpen ? "show" : ""}`}>
            <div className="ai-well mx-3 mt-2.5 flex flex-col overflow-hidden rounded">
              <div className="flex items-center border-b border-white/5 px-2.5 py-1.5">
                <div className="ai-tag flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-[#c8a050]">AI Assist</div>
                {aiResult && !aiLoading && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <button className="cursor-pointer rounded border-none bg-[linear-gradient(180deg,#4a7a40,#306828)] px-3.5 py-1 text-[11px] font-bold tracking-wider text-[#d0e8c0] shadow-[0_2px_0_rgba(20,50,10,0.5),inset_0_1px_0_rgba(200,255,200,0.12)] [text-shadow:0_1px_1px_rgba(0,0,0,0.3)] transition-all hover:bg-[linear-gradient(180deg,#5a8a50,#407838)]" onClick={onApplyAI}>Apply</button>
                    <button className="cursor-pointer rounded border-none bg-white/[0.06] px-3.5 py-1 text-[11px] font-bold tracking-wider text-[rgba(200,160,100,0.5)] shadow-[0_2px_0_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all hover:bg-white/[0.1] hover:text-[rgba(200,160,100,0.8)]" onClick={onCloseAI}>Close</button>
                  </div>
                )}
              </div>
              {aiLoading ? (
                <div className="ai-loading flex items-center justify-center gap-2.5 px-3 py-4">
                  <div className="quill-anim relative h-[18px] w-[18px]" />
                  <div className="animate-pulse text-[11px] font-semibold tracking-widest text-[rgba(200,160,80,0.6)]">Working...</div>
                </div>
              ) : aiResult ? (
                <div className="ai-body overflow-y-auto whitespace-pre-wrap px-3 py-2 font-['Comic_Sans_MS','Chalkboard_SE',cursive] text-sm leading-6 tracking-wide">{aiResult}</div>
              ) : null}
            </div>
          </div>

          <div className="tray-buttons flex shrink-0 items-stretch gap-2.5 px-4 py-2.5 pb-3.5">
            <button className="relative top-0 flex-1 cursor-pointer rounded-md border border-[#2a1808] bg-[linear-gradient(180deg,#6a5838,#4a3820,#3a2810)] px-2 py-2.5 text-[13px] font-bold tracking-[0.06em] text-[rgba(255,220,180,0.5)] shadow-[0_3px_0_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] [text-shadow:0_1px_1px_rgba(0,0,0,0.5)] transition-all active:top-[3px]" onClick={onBack}>Back</button>
            <button className="relative top-0 flex-1 cursor-pointer rounded-md border border-[#1a0828] bg-[linear-gradient(180deg,#4a3848,#3a2838,#2a1828)] px-2 py-2.5 text-[13px] font-bold tracking-[0.06em] text-[rgba(220,200,255,0.6)] shadow-[0_3px_0_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] [text-shadow:0_1px_1px_rgba(0,0,0,0.5)] transition-all disabled:cursor-not-allowed disabled:opacity-40 active:top-[3px]" disabled={!editorDraft.trim() || aiLoading} onClick={onAssist}>Assist</button>
            {editingNoteId && <button className="relative top-0 flex-1 cursor-pointer rounded-md border border-[#3a0808] bg-[linear-gradient(180deg,#8a3028,#6a1818,#501010)] px-2 py-2.5 text-[13px] font-bold tracking-[0.06em] text-[rgba(255,200,180,0.7)] shadow-[0_3px_0_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] [text-shadow:0_1px_1px_rgba(0,0,0,0.5)] transition-all active:top-[3px]" onClick={onRequestDelete}>Delete</button>}
            <button className="relative top-0 flex-1 cursor-pointer rounded-md border border-[#604010] bg-[linear-gradient(180deg,#d0a848,#a88028,#886818)] px-2 py-2.5 text-[13px] font-bold tracking-[0.06em] text-white shadow-[0_3px_0_rgba(80,50,10,0.6),inset_0_1px_1px_rgba(255,255,200,0.25)] [text-shadow:0_1px_1px_rgba(0,0,0,0.3)] transition-all disabled:cursor-not-allowed disabled:opacity-40 active:top-[3px]" disabled={saving || !editorDraft.trim()} onClick={onSave}>{saving ? "..." : "Save"}</button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-b-3xl rounded-t-2xl" onClick={(event) => { if (event.target === event.currentTarget) onCancelDelete(); }}>
            <div className="ai-modal-backdrop absolute inset-0 rounded-b-3xl rounded-t-2xl" />
            <div className="ai-modal-card relative z-10 mx-8 flex w-full max-w-[320px] flex-col items-center overflow-hidden rounded-xl px-6 py-6">
              <div className="mb-4 text-sm font-semibold text-[rgba(255,200,160,0.8)]">Are you sure you want to delete this note?</div>
              <div className="flex w-full gap-3">
                <button className="relative top-0 flex-1 cursor-pointer rounded-md border border-[#2a1808] bg-[linear-gradient(180deg,#6a5838,#4a3820,#3a2810)] px-2 py-2.5 text-center text-[13px] font-bold tracking-[0.06em] text-[rgba(255,220,180,0.5)] shadow-[0_3px_0_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] [text-shadow:0_1px_1px_rgba(0,0,0,0.5)]" onClick={onCancelDelete}>Cancel</button>
                <button className="relative top-0 flex-1 cursor-pointer rounded-md border border-[#3a0808] bg-[linear-gradient(180deg,#8a3028,#6a1818,#501010)] px-2 py-2.5 text-center text-[13px] font-bold tracking-[0.06em] text-[rgba(255,200,180,0.7)] shadow-[0_3px_0_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] [text-shadow:0_1px_1px_rgba(0,0,0,0.5)]" onClick={onConfirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
