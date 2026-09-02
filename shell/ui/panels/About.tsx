import { t } from "../lib/i18n";
import "./Settings.css";

// About — a shell panel, not an app. Static facts about the product itself.
const VERSION = "2.0.0";

export function About() {
  return (
    <div className="set-wrap">
      <h2 className="set-title">Wandesk</h2>
      <p className="set-hint">{t("about.tagline")}</p>
      <p className="set-hint">{t("about.version", { v: VERSION })}</p>
      <p className="set-hint">
        <a href="https://wandesk.ai" target="_blank" rel="noopener">{t("about.website")}</a> · {t("about.license")}
      </p>
    </div>
  );
}
