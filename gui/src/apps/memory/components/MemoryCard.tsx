export type MemoryItem = {
  id: number | string;
  title?: string;
  description?: string;
  content?: string;
  pinned?: number | boolean | string;
  enabled?: number | boolean | string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

const NOTES = [
  { bg: "#fff9c4", shadow: "rgba(200,180,60,0.18)", tape: "#e8d44d" },
  { bg: "#fce4ec", shadow: "rgba(200,100,120,0.15)", tape: "#f0a0b0" },
  { bg: "#e8f5e9", shadow: "rgba(80,160,100,0.14)", tape: "#8cc898" },
  { bg: "#e3f2fd", shadow: "rgba(80,140,220,0.14)", tape: "#90c0f0" },
  { bg: "#f3e5f5", shadow: "rgba(160,100,200,0.14)", tape: "#c8a0e0" },
  { bg: "#fff3e0", shadow: "rgba(220,160,60,0.16)", tape: "#f0c070" },
  { bg: "#e0f7fa", shadow: "rgba(60,180,200,0.14)", tape: "#70d0e0" },
  { bg: "#fbe9e7", shadow: "rgba(200,120,80,0.14)", tape: "#e0a888" }
];
const ROTATIONS = [-1.8, 1.2, -0.6, 1.5, -1, 0.8, -1.4, 0.5];
const DECOS = ["pin-left", "pin-right", "tape", "tape", "pin-left", "tape", "pin-right", "tape"];

const toBool = (value: unknown) => value === true || value === 1 || value === "1";
const itemIndex = (id: string | number, length: number) => Math.abs(Number(id) || 0) % length;

const formatTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
};

export default function MemoryCard({
  item,
  onEdit,
  onTogglePin,
  onToggleEnable,
  onDelete
}: {
  item: MemoryItem;
  onEdit: (item: MemoryItem) => void;
  onTogglePin: (item: MemoryItem) => void;
  onToggleEnable: (item: MemoryItem) => void;
  onDelete: (item: MemoryItem) => void;
}) {
  const note = NOTES[itemIndex(item.id, NOTES.length)];
  const rotation = ROTATIONS[itemIndex(item.id, ROTATIONS.length)];
  const decoType = DECOS[itemIndex(item.id, DECOS.length)];
  const enabled = toBool(item.enabled);
  const pinned = toBool(item.pinned);

  return (
    <div
      className={`relative cursor-default transition-all duration-200 hover:z-10 hover:scale-[1.02] ${enabled ? "" : "opacity-[0.4]"}`}
      style={{
        background: note.bg,
        boxShadow: `2px 3px 10px ${note.shadow},0 1px 2px rgba(0,0,0,0.04)`,
        borderRadius: 3,
        padding: "14px 16px 12px",
        transform: `rotate(${rotation}deg)`
      }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: "repeating-linear-gradient(0deg,transparent 0px,transparent 23px,rgba(0,0,0,0.015) 23px,rgba(0,0,0,0.015) 24px)", borderRadius: "inherit" }} />
      <div className="absolute bottom-0 right-0 h-5 w-5" style={{ background: "linear-gradient(135deg,transparent 50%,rgba(0,0,0,0.04) 50%)", borderRadius: "0 0 3px 0" }} />
      {decoType === "tape" ? (
        <div className="absolute -top-[7px] left-1/2 h-4 w-12 -translate-x-1/2 rounded-sm" style={{ background: note.tape, opacity: 0.45 }} />
      ) : decoType === "pin-left" ? (
        <div className="absolute -top-1 left-3.5 text-[16px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">📌</div>
      ) : (
        <div className="absolute -top-1 right-3.5 text-[16px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">📍</div>
      )}

      <div className="pt-[10px]">
        <div
          className="mb-1 cursor-pointer truncate leading-tight transition-colors"
          style={{ fontSize: 18, fontWeight: 700, color: "rgba(0,0,0,0.72)", fontFamily: "'Caveat','Segoe Print','Comic Sans MS',cursive" }}
          onClick={() => onEdit(item)}
        >
          {item.title || "Untitled memory"}
        </div>
        {item.description && (
          <div
            className="mb-3 line-clamp-3 cursor-pointer"
            style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(0,0,0,0.35)", fontFamily: "'Caveat','Segoe Print','Comic Sans MS',cursive" }}
            onClick={() => onEdit(item)}
          >
            {item.description}
          </div>
        )}
        <div className="flex items-center gap-1 border-t pt-2" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <span className="text-[12px] tabular-nums" style={{ color: "rgba(0,0,0,0.18)", fontFamily: "'Caveat',cursive" }}>{formatTime(item.created_at || item.updated_at)}</span>
          <div className="ml-auto flex items-center gap-[3px]">
            <button
              className="rounded-xl px-2 py-[2px] text-[11px] font-semibold transition-all hover:brightness-[0.93]"
              style={enabled ? { background: "rgba(255,255,255,0.5)", color: "rgba(30,120,55,0.65)", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", fontFamily: "'Caveat',cursive" } : { background: "rgba(255,255,255,0.3)", color: "rgba(0,0,0,0.22)", fontFamily: "'Caveat',cursive" }}
              onClick={() => onToggleEnable(item)}
            >
              {enabled ? "✓ Starred" : "○ Stored"}
            </button>
            <button
              className="rounded-xl px-2 py-[2px] text-[11px] font-semibold transition-all hover:brightness-[0.93]"
              style={pinned ? { background: "rgba(255,255,255,0.5)", color: "rgba(180,110,20,0.7)", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", fontFamily: "'Caveat',cursive" } : { background: "rgba(255,255,255,0.3)", color: "rgba(0,0,0,0.22)", fontFamily: "'Caveat',cursive" }}
              onClick={() => onTogglePin(item)}
            >
              {pinned ? "📌 Pinned" : "☆ Pinned"}
            </button>
            <button className="rounded-xl px-2 py-[2px] text-[11px] font-semibold transition-all hover:brightness-[0.93]" style={{ background: "rgba(255,255,255,0.3)", color: "rgba(200,60,60,0.3)", fontFamily: "'Caveat',cursive" }} onClick={() => onDelete(item)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
