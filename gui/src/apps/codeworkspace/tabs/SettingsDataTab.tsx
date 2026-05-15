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
        setError(result.error || "Save failed");
        return;
      }
      setEditing(false);
      onRefresh();
    } catch (err) {
      setError((err as Error).message || "Save failed");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="h-full space-y-4 overflow-y-auto px-6 py-5 cc-thin-scroll">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[17px] font-bold">{isCodex ? "config.toml" : "Settings"}</div>
          <div className="text-[11.5px]" style={{ color: "#6b5a46" }}>From <span className="cc-mono">{fileLabel}</span></div>
        </div>
        {!editing ? <button className="rounded-md border bg-white px-2.5 py-1 text-[11px] hover:bg-[#fdf7e8]" style={{ borderColor: "rgba(140,100,60,0.18)", color: "#4a3826" }} disabled={!data || !data.available} onClick={startEdit}>Edit</button> : (
          <div className="flex items-center gap-1">
            {error && <span className="mr-1 text-[10.5px]" style={{ color: "#b03a20" }}>{error}</span>}
            <button className="rounded-md px-2.5 py-1 text-[11px] hover:bg-black/5" style={{ color: "#8a7965" }} disabled={saving} onClick={() => setEditing(false)}>Cancel</button>
            <button className="cc-btn-primary rounded-md px-2.5 py-1 text-[11px] font-semibold" disabled={saving} onClick={save}>{saving ? "Saving..." : "Save"}</button>
          </div>
        )}
      </div>
      {loading || !data ? <div className="text-[12px]" style={{ color: "#8a7965" }}>Loading...</div> : !data.available ? <div className="text-[12px]" style={{ color: "#8a7965" }}>Settings file does not exist</div> : (
        <div className="cc-chart-card">
          <div className="cc-chart-title mb-2">{isCodex ? "TOML" : "JSON"}</div>
          {editing && <div className="cc-chart-sub mb-2" style={{ color: "#b97d1a" }}>{isCodex ? "No TOML validation is performed before saving. Invalid TOML will cause Codex startup errors." : "JSON is validated before saving. Invalid input will not overwrite the original file."}</div>}
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
