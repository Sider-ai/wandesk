import { shellLanguage } from "./language.js";

function resolveState(title) {
  const t = (title || "").toLowerCase();
  if (
    t.includes("失败") ||
    t.includes("错误") ||
    t.includes("fail") ||
    t.includes("error")
  )
    return "error";
  if (
    t.includes("就绪") ||
    t.includes("ready") ||
    t.includes("完成") ||
    t.includes("成功")
  )
    return "ready";
  return "loading";
}

const defaultLang = shellLanguage.lang;
const defaultBrand = shellLanguage.brand;
const defaultTitle = shellLanguage.status.defaultTitle;
const defaultMessage = shellLanguage.status.defaultMessage;

function applyState(state) {
  document.body.classList.remove(
    "boot-loading",
    "boot-ready",
    "boot-error"
  );
  document.body.classList.add("boot-" + state);
}

window.addEventListener("DOMContentLoaded", () => {
  const brandElement = document.getElementById("shell-brand");
  const titleElement = document.getElementById("status-title");
  const messageElement = document.getElementById("status-message");

  document.documentElement.lang = defaultLang;
  document.title = defaultTitle;
  if (brandElement) brandElement.textContent = defaultBrand;
  if (titleElement) titleElement.textContent = defaultTitle;
  if (messageElement) messageElement.textContent = defaultMessage;
  applyState(resolveState(defaultTitle));

  window.__AIOS_STATUS_SET__ = (payloadOrTitle, legacyMessage) => {
    const payload =
      payloadOrTitle && typeof payloadOrTitle === "object"
        ? payloadOrTitle
        : { title: payloadOrTitle, message: legacyMessage };

    const nextTitle = payload.title || defaultTitle;
    const nextMessage = payload.message || defaultMessage;

    if (titleElement) titleElement.textContent = nextTitle;
    if (messageElement) messageElement.textContent = nextMessage;
    document.title = nextTitle;
    applyState(resolveState(nextTitle));
  };

  document.body.dataset.ready = "true";
});
