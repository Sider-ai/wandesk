import { useState } from "react";
import { post } from "../lib/http";
import { t } from "../lib/i18n";
import "./Setup.css";

// Out-of-box setup — the wizard you see the first time the system boots, before any desktop exists.
// Its own full-screen background, steps on the left, one page at a time, Next in the corner.
// There is no skip: Wandesk runs on your model, so until one answers there is no desktop to show.
type Step = "welcome" | "model" | "done";
const STEPS: Step[] = ["welcome", "model", "done"];

export function Setup({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>("welcome");
  const [form, setForm] = useState({ apiUrl: "", apiKey: "", model: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const idx = STEPS.indexOf(step);

  const field = (key: keyof typeof form, label: string, placeholder: string, type = "text") => (
    <label className="oobe-row">
      <span className="oobe-label">{label}</span>
      <input className="oobe-input" type={type} value={form[key]} placeholder={placeholder} autoComplete="off" spellCheck={false}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        onKeyDown={(e) => { if (e.key === "Enter") void next(); }} />
    </label>
  );

  const connect = async (): Promise<boolean> => {
    const apiUrl = form.apiUrl.trim(), apiKey = form.apiKey.trim(), model = form.model.trim();
    if (!apiUrl || !apiKey || !model) { setError(t("setup.err.missing")); return false; }
    setBusy(true); setError("");
    try {
      const driver = /chat\/completions/i.test(apiUrl) ? "chat" : "responses";
      // Test first, save only on success — a failed attempt never counts as configured
      const r = await post<{ ok: boolean; error?: string }>("/api/settings/test", { driver, apiUrl, apiKey, model });
      if (!r.ok) { setError(t("setup.err.test", { e: r.error || "" })); return false; }
      await post("/api/settings", { driver, apiUrl, apiKey, model });
      return true;
    } catch (e: any) {
      setError(String(e?.message || e));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const next = async () => {
    if (busy) return;
    if (step === "welcome") setStep("model");
    else if (step === "model") { if (await connect()) setStep("done"); }
    else onDone();
  };
  const back = () => { if (!busy && step === "model") { setError(""); setStep("welcome"); } };

  return (
    <div className="oobe">
      <header className="oobe-top">
        <span className="oobe-brand">Wandesk</span>
        <span className="oobe-topline">{t("setup.topline")}</span>
      </header>

      <div className="oobe-body">
        <aside className="oobe-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`oobe-step${i === idx ? " is-current" : i < idx ? " is-done" : ""}`}>
              <span className="oobe-step-n">{i < idx ? "✓" : i + 1}</span>
              <span>{t(`setup.step.${s}`)}</span>
            </div>
          ))}
        </aside>

        <main className="oobe-page">
          {step === "welcome" && (
            <>
              <h1 className="oobe-title">{t("setup.welcome.title")}</h1>
              <p className="oobe-text">{t("setup.welcome.p1")}</p>
              <p className="oobe-text">{t("setup.welcome.p2")}</p>
            </>
          )}
          {step === "model" && (
            <>
              <h1 className="oobe-title">{t("setup.model.title")}</h1>
              <p className="oobe-text">{t("setup.model.p1")}</p>
              {field("apiUrl", t("settings.apiUrl"), "https://api.openai.com/v1/responses")}
              {field("apiKey", t("settings.apiKey"), "sk-…", "password")}
              {field("model", t("settings.model"), "gpt-5.5")}
              <div className="oobe-status">{error && <span className="oobe-error">{error}</span>}</div>
            </>
          )}
          {step === "done" && (
            <>
              <h1 className="oobe-title">{t("setup.done.title")}</h1>
              <p className="oobe-text">{t("setup.done.p1")}</p>
              <p className="oobe-text">{t("setup.done.p2")}</p>
            </>
          )}
        </main>
      </div>

      <footer className="oobe-bottom">
        {step === "model" && <button className="oobe-btn" onClick={back} disabled={busy}>{t("setup.back")}</button>}
        <button className="oobe-btn is-primary" onClick={next} disabled={busy}>
          {busy ? t("setup.testing") : step === "done" ? t("setup.finish") : t("setup.next")}
        </button>
      </footer>
    </div>
  );
}
