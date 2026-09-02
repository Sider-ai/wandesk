import { useEffect, useState } from "react";
import { api, post } from "../lib/http";
import { t } from "../lib/i18n";
import "./Settings.css";

// Settings — a shell panel, not an app.
// It configures the framework itself (which model the kernel talks to, the system
// prompt), not anything domain-specific.
// "Whatever configures the framework belongs to the shell, whatever does work is always an app" — that line stays firm.
const DRIVERS = [
  { id: "responses", labelKey: "settings.driver.responses" },
  { id: "chat", labelKey: "settings.driver.chat" },
];

export function Settings() {
  const [form, setForm] = useState({ driver: "responses", apiUrl: "", apiKey: "", model: "", system: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void api<{ settings?: Record<string, string> }>("/api/settings").then((j) => {
      const s = j.settings || {};
      setForm({
        driver: s.driver || "responses",
        apiUrl: s.apiUrl || "",
        apiKey: s.apiKey || "",   // the kernel echoes back a ******** placeholder; sending it back unchanged = no change
        model: s.model || "",
        system: s.system || "",
      });
      setLoading(false);
    });
  }, []);

  const save = async () => {
    await post("/api/settings", form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const field = (key: "apiUrl" | "apiKey" | "model", label: string, hint?: string, type = "text") => (
    <label className="set-row">
      <span className="set-label">{label}{hint && <em>{hint}</em>}</span>
      <input
        className="set-input"
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
    </label>
  );

  if (loading) return <div className="set-wrap"><p className="set-hint">{t("settings.loading")}</p></div>;

  return (
    <div className="set-wrap">
      <h2 className="set-title">{t("settings.title")}</h2>
      <p className="set-hint">{t("settings.hint")}</p>

      <label className="set-row">
        <span className="set-label">{t("settings.driver")}</span>
        <select
          className="set-input"
          value={form.driver}
          onChange={(e) => setForm((f) => ({ ...f, driver: e.target.value }))}
        >
          {DRIVERS.map((d) => <option key={d.id} value={d.id}>{t(d.labelKey)}</option>)}
        </select>
      </label>

      {field("apiUrl", t("settings.apiUrl"), t("settings.apiUrl.hint"))}
      {field("apiKey", t("settings.apiKey"), t("settings.apiKey.hint"), "password")}
      {field("model", t("settings.model"))}

      <label className="set-row">
        <span className="set-label">{t("settings.system")}<em>{t("settings.system.hint")}</em></span>
        <textarea
          className="set-input set-textarea"
          rows={5}
          value={form.system}
          onChange={(e) => setForm((f) => ({ ...f, system: e.target.value }))}
        />
      </label>

      <div className="set-actions">
        <button className="set-save" onClick={save}>{t("settings.save")}</button>
        {saved && <span className="set-ok">{t("settings.saved")}</span>}
      </div>
    </div>
  );
}
