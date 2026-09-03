import { useState } from "react";
import { post } from "../lib/http";
import { t } from "../lib/i18n";
import { wallpaperCss, cssToStyle } from "../lib/wallpapers";
import "./Setup.css";

// Out-of-box setup — the first thing you see, before any desktop exists. One Aero window ("Set up Wandesk")
// centred on the wallpaper, Welcome Center style: task-dialog header band, step pane on the left,
// grey footer strip with Back / Next. No skip: Wandesk runs on your model, so until one answers there is no desktop.
type Step = "welcome" | "model" | "done";
const STEPS: Step[] = ["welcome", "model", "done"];

export function Setup({ wallpaper, onDone }: { wallpaper: string; onDone: () => void }) {
  const [step, setStep] = useState<Step>("welcome");
  const [form, setForm] = useState({ apiUrl: "", apiKey: "", model: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const idx = STEPS.indexOf(step);

  const field = (key: keyof typeof form, label: string, placeholder: string, type = "text", hint?: string) => (
    <label className="oobe-field">
      <span className="oobe-field-label">{label}</span>
      <input type={type} value={form[key]} placeholder={placeholder} autoComplete="off" spellCheck={false} disabled={busy}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        onKeyDown={(e) => { if (e.key === "Enter") void next(); }} />
      {hint && <span className="oobe-field-hint">{hint}</span>}
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
    <div className="oobe" style={cssToStyle(wallpaperCss(wallpaper))}>
      <div className="oobe-dim" />
      {/* The shell's taskbar, empty: the desktop exists but nothing is open yet */}
      <div className="taskbar oobe-taskbar"><div className="tb-start" aria-hidden="true">▦</div><div className="tb-items" /></div>

      <div className="oobe-stage">
        <div className="oobe-win" role="dialog" aria-label={t("setup.topline")}>
          <div className="oobe-winbar">
            <div className="oobe-wtitle"><span aria-hidden="true">🧭</span>{t("setup.topline")}</div>
            <div className="oobe-wbtns" aria-hidden="true"><span className="oobe-wbtn">–</span><span className="oobe-wbtn">▢</span><span className="oobe-wbtn is-close">✕</span></div>
          </div>
          <div className="oobe-winbody">
            <div className="oobe-head">
              <h1>{t(`setup.${step}.title`)}</h1>
              <p>{t(`setup.${step}.sub`)}</p>
            </div>

            <div className="oobe-body">
              <div className="oobe-taskpane">
                {STEPS.map((s, i) => (
                  <div key={s} className={`oobe-step${i === idx ? " is-active" : i < idx ? " is-done" : ""}`}>
                    <span className="oobe-step-ico">{i < idx ? "✓" : i + 1}</span>
                    {t(`setup.step.${s}`)}
                  </div>
                ))}
              </div>

              <div className="oobe-content">
                {step === "welcome" && (
                  <div className="oobe-panel">
                    <div className="oobe-brand"><span className="oobe-mark">W</span><span>Wandesk</span></div>
                    <p>{t("setup.welcome.p1")}</p>
                    <p>{t("setup.welcome.p2")}</p>
                  </div>
                )}
                {step === "model" && (
                  <div className="oobe-panel">
                    <p>{t("setup.model.p1")}</p>
                    {field("apiUrl", t("settings.apiUrl"), "https://api.openai.com/v1/responses")}
                    {field("apiKey", t("settings.apiKey"), "sk-••••••••••••••••", "password")}
                    {field("model", t("settings.model"), "gpt-5.5", "text", t("setup.model.hint"))}
                    {busy && <div className="oobe-status"><span className="oobe-spin" />{t("setup.testing")}</div>}
                    {error && !busy && <div className="oobe-error"><span className="oobe-x">!</span><span>{error}</span></div>}
                  </div>
                )}
                {step === "done" && (
                  <div className="oobe-panel">
                    <div className="oobe-finish-ico">✓</div>
                    <p>{t("setup.done.p1")}</p>
                    <p>{t("setup.done.p2")}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="oobe-foot">
              <span className="oobe-foot-note">{t("setup.stepOf", { n: idx + 1 })}</span>
              <button className="oobe-btn" onClick={back} disabled={busy || step !== "model"}>{t("setup.back")}</button>
              <button className="oobe-btn is-primary" onClick={next} disabled={busy}>
                {step === "done" ? t("setup.finish") : t("setup.next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
