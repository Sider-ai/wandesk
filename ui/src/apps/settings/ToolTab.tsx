type ToolTabProps = {
  enableToolResultTruncate: boolean;
  toolResultMaxChars: number;
  enableToolLoopLimit: boolean;
  toolMaxRounds: number;
  onEnableToolResultTruncateChange: (value: boolean) => void;
  onToolResultMaxCharsChange: (value: number) => void;
  onEnableToolLoopLimitChange: (value: boolean) => void;
  onToolMaxRoundsChange: (value: number) => void;
  onSave: () => void;
};

export default function ToolTab({ enableToolResultTruncate, toolResultMaxChars, enableToolLoopLimit, toolMaxRounds, onEnableToolResultTruncateChange, onToolResultMaxCharsChange, onEnableToolLoopLimitChange, onToolMaxRoundsChange, onSave }: ToolTabProps) {
  const numberInputClass = "w-[100px] rounded-[8px] border bg-[#faf8f5] px-2.5 py-1.5 text-[13px] outline-none transition-colors focus:border-[#a07850] focus:bg-white disabled:opacity-40";
  return (
    <section className="space-y-3">
      <div className="rounded-[13px] border px-4 py-4" style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}>
        <label className="flex cursor-pointer items-center gap-2.5">
          <input type="checkbox" checked={enableToolResultTruncate} className="h-[15px] w-[15px] shrink-0 cursor-pointer accent-[#5c4332]" onChange={(event) => onEnableToolResultTruncateChange(event.target.checked)} />
          <span className="text-[13px] font-medium" style={{ color: "#2a1f13" }}>__T_SETTINGS_TOOL_TRUNCATE_ENABLE__</span>
        </label>
        <div className="mt-3.5 flex flex-wrap items-center gap-3">
          <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.4)" }}>__T_SETTINGS_TOOL_MAX_CHARS__</span>
          <input value={toolResultMaxChars} type="number" min="1000" max="50000" step="1000" disabled={!enableToolResultTruncate} className={numberInputClass} style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2a1f13" }} onChange={(event) => onToolResultMaxCharsChange(Number(event.target.value || 0))} />
        </div>
        <div className="mt-1.5 text-[11px]" style={{ color: "rgba(0,0,0,0.3)" }}>__T_SETTINGS_TOOL_MAX_CHARS_HINT__</div>
      </div>

      <div className="rounded-[13px] border px-4 py-4" style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}>
        <label className="flex cursor-pointer items-center gap-2.5">
          <input type="checkbox" checked={enableToolLoopLimit} className="h-[15px] w-[15px] shrink-0 cursor-pointer accent-[#5c4332]" onChange={(event) => onEnableToolLoopLimitChange(event.target.checked)} />
          <span className="text-[13px] font-medium" style={{ color: "#2a1f13" }}>__T_SETTINGS_TOOL_LOOP_LIMIT_ENABLE__</span>
        </label>
        <div className="mt-3.5 flex flex-wrap items-center gap-3">
          <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.4)" }}>__T_SETTINGS_TOOL_MAX_ROUNDS__</span>
          <input value={toolMaxRounds} type="number" min="1" max="500" step="1" disabled={!enableToolLoopLimit} className={numberInputClass} style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2a1f13" }} onChange={(event) => onToolMaxRoundsChange(Number(event.target.value || 0))} />
        </div>
        <div className="mt-1.5 text-[11px]" style={{ color: "rgba(0,0,0,0.3)" }}>__T_SETTINGS_TOOL_MAX_ROUNDS_HINT__</div>
      </div>

      <div className="flex justify-end pt-1"><button className="rounded-[9px] bg-[#5c4332] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#3d2a1e]" onClick={onSave}>__T_SETTINGS_SAVE__</button></div>
    </section>
  );
}
