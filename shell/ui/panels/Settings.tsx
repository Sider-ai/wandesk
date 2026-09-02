import { useEffect, useState } from "react";
import { api, post } from "../lib/http";
import { t, type Lang } from "../lib/i18n";
import "./Settings.css";

// 设置 —— 壳的面板,不是应用。
// 它配置的是框架本身(内核连哪个模型、系统提示词、界面语言),不是任何领域的事。
// 「凡是配置框架的界面属于壳,凡是做事的一律是应用」——  这条线不含糊。
const DRIVERS = [
  { id: "responses", labelKey: "settings.driver.responses" },
  { id: "chat", labelKey: "settings.driver.chat" },
];

const LANGUAGES: { id: Lang; labelKey: string }[] = [
  { id: "zh", labelKey: "settings.language.zh" },
  { id: "en", labelKey: "settings.language.en" },
];

export function Settings() {
  const [form, setForm] = useState({ driver: "responses", apiUrl: "", apiKey: "", model: "", system: "", language: "zh" as Lang });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void api<{ settings?: Record<string, string> }>("/api/settings").then((j) => {
      const s = j.settings || {};
      setForm({
        driver: s.driver || "responses",
        apiUrl: s.apiUrl || "",
        apiKey: s.apiKey || "",   // 内核回显的是 ******** 占位符,原样回传 = 不改
        model: s.model || "",
        system: s.system || "",
        language: s.language === "en" ? "en" : "zh",
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

      <label className="set-row">
        <span className="set-label">{t("settings.language")}</span>
        <select
          className="set-input"
          value={form.language}
          onChange={(e) => setForm((f) => ({ ...f, language: e.target.value as Lang }))}
        >
          {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{t(l.labelKey)}</option>)}
        </select>
      </label>

      <div className="set-actions">
        <button className="set-save" onClick={save}>{t("settings.save")}</button>
        {saved && <span className="set-ok">{t("settings.saved")}</span>}
      </div>
    </div>
  );
}
