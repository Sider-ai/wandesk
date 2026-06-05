import { useState } from "react";
import { fetchJson } from "../utils";

export function SettingsDataTab({ basePath, data, loading, onRefresh }: { basePath: string; data: any; loading?: boolean; onRefresh: () => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isCodex = basePath.includes("codex");
  const fileLabel = basePath.includes("codex") ? "~/.codex/config.toml" : "~/.claude/settings.json";
  const startEdit = () => {
    setDraft(isCodex ? String(data?.content || "") : (typeof data?.raw === "string" ? data.raw : JSON.stringify(data?.settings || {}, null, 2)));
    setError("");
    setEditing(true);
  };
  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const result = await fetchJson(`${basePath}/settings/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft })
      });
      if (!result.ok) {
        setError(result.error || "__T_CODEWORKSPACE_SAVE_FAILED__");
        return;
      }
      setEditing(false);
      onRefresh();
    } catch (err) {
      setError((err as Error).message || "__T_CODEWORKSPACE_SAVE_FAILED__");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="h-full space-y-4 overflow-y-auto px-6 py-5 cc-thin-scroll">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[17px] font-bold">{isCodex ? "config.toml" : "__T_CODEWORKSPACE_SETTINGS_TITLE__"}</div>
          <div className="text-[11.5px]" style={{ color: "#6b5a46" }}>__T_CODEWORKSPACE_FROM__ <span className="cc-mono">{fileLabel}</span></div>
        </div>
        {!editing ? <button className="rounded-md border bg-white px-2.5 py-1 text-[11px] hover:bg-[#fdf7e8]" style={{ borderColor: "rgba(140,100,60,0.18)", color: "#4a3826" }} disabled={!data || !data.available} onClick={startEdit}>__T_COMMON_EDIT__</button> : (
          <div className="flex items-center gap-1">
            {error && <span className="mr-1 text-[10.5px]" style={{ color: "#b03a20" }}>{error}</span>}
            <button className="rounded-md px-2.5 py-1 text-[11px] hover:bg-black/5" style={{ color: "#8a7965" }} disabled={saving} onClick={() => setEditing(false)}>__T_COMMON_CANCEL__</button>
            <button className="cc-btn-primary rounded-md px-2.5 py-1 text-[11px] font-semibold" disabled={saving} onClick={save}>{saving ? "__T_CODEWORKSPACE_SAVING__" : "__T_COMMON_SAVE__"}</button>
          </div>
        )}
      </div>
      {loading || !data ? <div className="text-[12px]" style={{ color: "#8a7965" }}>__T_COMMON_LOADING__</div> : !data.available ? <div className="text-[12px]" style={{ color: "#8a7965" }}>__T_CODEWORKSPACE_SETTINGS_MISSING__</div> : (
        <div className="cc-chart-card">
          <div className="cc-chart-title mb-2">{isCodex ? "TOML" : "JSON"}</div>
          {editing && <div className="cc-chart-sub mb-2" style={{ color: "#b97d1a" }}>{isCodex ? "__T_CODEWORKSPACE_TOML_WARNING__" : "__T_CODEWORKSPACE_JSON_WARNING__"}</div>}
          {editing ? (
            <textarea className="cc-mono w-full rounded-md p-3 text-[11.5px] outline-none" style={{ minHeight: 320, resize: "vertical", border: "1px solid rgba(140,100,60,0.18)", background: "#1f1a12", color: "#e8d8a8" }} spellCheck={false} disabled={saving} value={draft} onChange={(event) => setDraft(event.target.value)} />
          ) : (
            <pre className="cc-mono overflow-x-auto whitespace-pre rounded-md p-3 text-[11.5px]" style={{ margin: 0, background: "#1f1a12", color: "#e8d8a8" }}>{isCodex ? data.content : (typeof data.raw === "string" ? data.raw : JSON.stringify(data.settings, null, 2))}</pre>
          )}
        </div>
      )}
    </div>
  );
}
