import { useState } from "react";
import { post } from "../lib/http";
import { t } from "../lib/i18n";
import "./Settings.css";

// First-run welcome — a shell panel. Three fields, nothing else: any OpenAI-compatible endpoint, a key, a model id.
// The driver is picked from the URL (…/chat/completions → Chat Completions, otherwise Responses); Settings can override it.
export const WELCOME_SKIPPED_KEY = "wandesk.welcomeSkipped";

export function Welcome({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({ apiUrl: "", apiKey: "", model: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const field = (key: keyof typeof form, label: string, hint: string, type = "text") => (
    <label className="set-row">
      <span className="set-label">{label}<em>{hint}</em></span>
      <input className="set-input" type={type} value={form[key]} placeholder={hint}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
    </label>
  );

  const connect = async () => {
    const apiUrl = form.apiUrl.trim(), apiKey = form.apiKey.trim(), model = form.model.trim();
    if (!apiUrl || !apiKey || !model) { setError(t("welcome.err.missing")); return; }
    setBusy(true); setError("");
    try {
      const driver = /chat\/completions/i.test(apiUrl) ? "chat" : "responses";
      // Test first, save only on success — a failed attempt must not count as "configured"
      const r = await post<{ ok: boolean; error?: string }>("/api/settings/test", { driver, apiUrl, apiKey, model });
      if (!r.ok) { setError(t("welcome.err.test", { e: r.error || "" })); return; }
      await post("/api/settings", { driver, apiUrl, apiKey, model });
      try { localStorage.removeItem(WELCOME_SKIPPED_KEY); } catch {}
      onDone();
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  const skip = () => {
    try { localStorage.setItem(WELCOME_SKIPPED_KEY, "1"); } catch {}
    onDone();
  };

  return (
    <div className="set-wrap">
      <h2 className="set-title">{t("welcome.title")}</h2>
      <p className="set-hint">{t("welcome.hint")}</p>
      {field("apiUrl", t("settings.apiUrl"), "https://api.openai.com/v1/responses")}
      {field("apiKey", t("settings.apiKey"), "sk-…", "password")}
      {field("model", t("settings.model"), "gpt-5.5")}
      {error && <p className="set-hint" style={{ color: "#b3261e" }}>{error}</p>}
      <div className="set-actions">
        <button className="set-save" onClick={connect} disabled={busy}>{busy ? t("welcome.testing") : t("welcome.connect")}</button>
        <button className="set-save" onClick={skip} disabled={busy} style={{ opacity: 0.7 }}>{t("welcome.skip")}</button>
      </div>
    </div>
  );
}
