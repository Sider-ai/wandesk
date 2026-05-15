type ContextTabProps = {
  contextRounds: number;
  onContextRoundsChange: (value: number) => void;
  onSave: () => void;
};

export default function ContextTab({ contextRounds, onContextRoundsChange, onSave }: ContextTabProps) {
  return (
    <section className="space-y-4">
      <div className="rounded-[13px] border px-4 py-4" style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="mb-3 text-[12px] font-semibold uppercase tracking-wide" style={{ color: "rgba(0,0,0,0.35)" }}>Context Rounds</div>
        <div className="flex gap-2">
          {[30, 100, 500].map((count) => (
            <button key={count} className="flex-1 rounded-[9px] border py-2.5 text-[14px] font-semibold transition-all" style={contextRounds === count ? { background: "#5c4332", borderColor: "#5c4332", color: "#fff" } : { background: "#faf8f5", borderColor: "rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.4)" }} onClick={() => onContextRoundsChange(count)}>{count}</button>
          ))}
        </div>
      </div>
      <div className="flex justify-end"><button className="rounded-[9px] bg-[#5c4332] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#3d2a1e]" onClick={onSave}>Save</button></div>
    </section>
  );
}
