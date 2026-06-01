import { shellLanguage } from "./language.js";

const COPY = shellLanguage.about;

const state = {
  clientVersion: "",
  resetting: false,
};

const refs = {};

function render() {
  document.documentElement.lang = shellLanguage.lang;
  document.title = COPY.title;
  refs.brand.textContent = shellLanguage.brand;
  const versionText = state.clientVersion ? `${COPY.version} ${state.clientVersion}` : COPY.version;
  refs.version.textContent = versionText;
  refs.websiteLabel.textContent = COPY.website;
  refs.websiteUrl.textContent = COPY.websiteUrl;
  refs.websiteLink.dataset.url = COPY.websiteUrl;
  refs.communityLabel.textContent = COPY.community;
  refs.communityUrl.textContent = COPY.communityUrl;
  refs.communityLink.dataset.url = COPY.communityUrl;
  refs.tagline.textContent = COPY.tagline;
  refs.moreLabel.textContent = COPY.labMore;
  refs.more.dataset.url = COPY.labMoreUrl;
  refs.resetTitle.textContent = COPY.resetTitle;
  refs.resetDesc.textContent = COPY.resetDesc;
  refs.resetButton.textContent = state.resetting ? COPY.resetting : COPY.resetAction;
  refs.resetButton.disabled = state.resetting;
}

function openExternal(url) {
  if (!url) return;
  const tauriOpener = window.__TAURI__?.opener?.openUrl;
  if (typeof tauriOpener === "function") {
    tauriOpener(url).catch(() => window.open(url, "_blank", "noopener,noreferrer"));
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

async function resetLocalData() {
  if (state.resetting) return;
  if (!window.confirm(COPY.resetConfirm)) return;

  const invoke = window.__TAURI__?.core?.invoke;
  if (typeof invoke !== "function") {
    refs.resetStatus.textContent = COPY.resetUnavailable;
    return;
  }

  state.resetting = true;
  refs.resetStatus.textContent = COPY.resetStarted;
  render();

  try {
    await invoke("reset_local_data_command");
    refs.resetStatus.textContent = COPY.resetSubmitted;
  } catch (error) {
    refs.resetStatus.textContent = `${COPY.resetFailed} ${error?.message || error || ""}`.trim();
    state.resetting = false;
    render();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  Object.assign(refs, {
    brand: document.getElementById("shell-brand"),
    version: document.getElementById("about-version"),
    websiteLink: document.getElementById("website-link"),
    websiteLabel: document.getElementById("website-label"),
    websiteUrl: document.getElementById("website-url"),
    communityLink: document.getElementById("community-link"),
    communityLabel: document.getElementById("community-label"),
    communityUrl: document.getElementById("community-url"),
    tagline: document.getElementById("about-tagline"),
    more: document.getElementById("about-more"),
    moreLabel: document.getElementById("about-more-label"),
    resetTitle: document.getElementById("reset-title"),
    resetDesc: document.getElementById("reset-desc"),
    resetStatus: document.getElementById("reset-status"),
    resetButton: document.getElementById("reset-button"),
  });

  const bind = (linkEl) => {
    linkEl.addEventListener("click", (event) => {
      event.preventDefault();
      openExternal(linkEl.dataset.url);
    });
  };
  bind(refs.websiteLink);
  bind(refs.communityLink);
  bind(refs.more);
  refs.resetButton.addEventListener("click", resetLocalData);

  window.__AIOS_ABOUT_SET__ = (payload = {}) => {
    state.clientVersion = payload.clientVersion || state.clientVersion;
    render();
  };

  render();
});
