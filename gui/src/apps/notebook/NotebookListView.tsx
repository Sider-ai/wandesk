type Note = {
  id: number | string;
  content?: string;
  style?: number;
  created_at?: string;
  updated_at?: string;
};

type CardStyle = {
  cardCls: string;
  textCls: string;
  padCls: string;
  inkCls: string;
};

export default function NotebookListView({
  view,
  notes,
  page,
  totalPages,
  loading,
  cardStyle,
  formatTime,
  rotations,
  pinColors,
  onOpenEditor,
  onDeleteNote,
  onPrevPage,
  onNextPage
}: {
  view: string;
  notes: Note[];
  page: number;
  totalPages: number;
  loading: boolean;
  cardStyle: (style?: number) => CardStyle;
  formatTime: (value?: string) => string;
  rotations: number[];
  pinColors: string[];
  onOpenEditor: (note: Note | null) => void;
  onDeleteNote: (id: number | string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}) {
  if (view !== "list") return null;

  return (
    <div className="cork-surface relative flex h-full w-full flex-wrap content-start justify-center gap-[30px] overflow-y-auto overflow-x-hidden p-10 md:justify-start">
      <div
        className="group z-20 flex h-[240px] w-[200px] shrink-0 cursor-pointer flex-col items-center justify-center rounded-b-xl rounded-t-lg border border-[#3a2515] bg-[#5c412a] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),4px_8px_15px_rgba(0,0,0,0.6)] transition-all hover:scale-[1.02] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),6px_12px_20px_rgba(0,0,0,0.7)]"
        style={{ transform: "rotate(-2deg)" }}
        onClick={() => onOpenEditor(null)}
      >
        <div className="absolute top-[5px] h-4 w-[60px] rounded-sm bg-[#888] shadow-[0_4px_6px_rgba(0,0,0,0.6)]" />
        <div className="mt-5 flex h-[85%] w-[85%] items-center justify-center rounded-sm bg-[rgba(253,245,211,0.9)] shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
          <span className="text-[40px] font-bold text-[#a33] opacity-70">+</span>
        </div>
      </div>

      {notes.map((note, index) => {
        const style = cardStyle(note.style);
        return (
          <div
            key={note.id}
            className={`memo-card group relative z-10 shrink-0 cursor-pointer transition-all hover:z-40 hover:!-translate-y-1 hover:!scale-105 ${style.cardCls}`}
            style={{ transform: `rotate(${rotations[index % 8]}deg)` }}
            onClick={() => onOpenEditor(note)}
          >
            {index % 3 !== 1 ? (
              <div className={`pushpin absolute left-1/2 top-[10px] z-20 h-3.5 w-3.5 -translate-x-1/2 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.4),inset_2px_2px_4px_rgba(255,255,255,0.6),3px_10px_6px_rgba(0,0,0,0.3)] ${pinColors[(Number(note.style) || 0) % 4]}`} />
            ) : (
              <div className="pointer-events-none absolute -top-2.5 left-1/2 z-10 h-5 w-[50px] border-x-2 border-dashed border-white/60 bg-white/35 shadow-sm backdrop-blur-[1px]" style={{ transform: `translateX(-50%) rotate(${index % 2 ? 5 : -5}deg)` }} />
            )}
            <div className={`line-clamp-[8] whitespace-pre-wrap break-words px-3 font-['Comic_Sans_MS','Chalkboard_SE',cursive] text-base leading-[25px] ${style.textCls}`}>
              {note.content || "(Empty)"}
            </div>
            <div className="absolute bottom-2 right-2.5 font-mono text-[10px] font-bold text-black/40">
              {formatTime(note.updated_at || note.created_at)}
            </div>
            <button className="absolute -right-2 -top-2 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 shadow-md transition-all hover:scale-110 hover:bg-red-700 group-hover:opacity-100" onClick={(event) => { event.stopPropagation(); onDeleteNote(note.id); }}>✕</button>
          </div>
        );
      })}

      {loading && !notes.length && <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white/70">Loading...</div>}
      <div className="h-10 w-full" />

      {totalPages > 1 && (
        <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-lg bg-black/40 px-4 py-1.5 text-xs text-[#d4c0a0] backdrop-blur-sm">
          <button className="px-2 py-0.5 text-lg hover:text-white disabled:cursor-not-allowed disabled:opacity-30" disabled={page <= 1 || loading} onClick={onPrevPage}>‹</button>
          <span>{page} / {totalPages}</span>
          <button className="px-2 py-0.5 text-lg hover:text-white disabled:cursor-not-allowed disabled:opacity-30" disabled={page >= totalPages || loading} onClick={onNextPage}>›</button>
        </div>
      )}
    </div>
  );
}
