import { useState } from "react";
import { post } from "../lib/http";
import { t } from "../lib/i18n";
import "./Setup.css";

// Out-of-box setup — the screen you see before the desktop exists, like a fresh OS install.
// Full-screen, nothing behind it, no skip: Wandesk runs on your model, so until one answers there is no desktop.
// Three fields, one real request; the driver is inferred from the URL (…/chat/completions → chat, else responses).
export function Setup({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({ apiUrl: "", apiKey: "", model: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const field = (key: keyof typeof form, label: string, placeholder: string, type = "text") => (
    <label className="oobe-row">
      <span className="oobe-label">{label}</span>
      <input className="oobe-input" type={type} value={form[key]} placeholder={placeholder} autoComplete="off" spellCheck={false}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        onKeyDown={(e) => { if (e.key === "Enter") void connect(); }} />
    </label>
  );

  const connect = async () => {
    const apiUrl = form.apiUrl.trim(), apiKey = form.apiKey.trim(), model = form.model.trim();
    if (!apiUrl || !apiKey || !model) { setError(t("setup.err.missing")); return; }
    setBusy(true); setError("");
    try {
      const driver = /chat\/completions/i.test(apiUrl) ? "chat" : "responses";
      // Test first, save only on success — until a model answers, the desktop stays locked
      const r = await post<{ ok: boolean; error?: string }>("/api/settings/test", { driver, apiUrl, apiKey, model });
      if (!r.ok) { setError(t("setup.err.test", { e: r.error || "" })); return; }
      await post("/api/settings", { driver, apiUrl, apiKey, model });
      onDone();
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="oobe">
      <div className="oobe-card">
        <div className="oobe-brand">Wandesk</div>
        <h1 className="oobe-title">{t("setup.title")}</h1>
        <p className="oobe-hint">{t("setup.hint")}</p>
        {field("apiUrl", t("settings.apiUrl"), "https://api.openai.com/v1/responses")}
        {field("apiKey", t("settings.apiKey"), "sk-…", "password")}
        {field("model", t("settings.model"), "gpt-5.5")}
        <div className="oobe-status">{error && <span className="oobe-error">{error}</span>}</div>
        <button className="oobe-go" onClick={connect} disabled={busy}>{busy ? t("setup.testing") : t("setup.connect")}</button>
        <p className="oobe-foot">{t("setup.foot")}</p>
      </div>
    </div>
  );
}
