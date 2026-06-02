const languagePacks = {
  en: {
    lang: "en",
    brand: "Wandesk",
    status: {
      defaultTitle: "Starting up...",
      defaultMessage: "Wandesk is preparing local services. Please wait.",
    },
    about: {
      title: "About",
      version: "Version",
      website: "Website",
      websiteUrl: "https://wandesk.ai",
      community: "Community",
      communityUrl: "https://discord.gg/UJw2wGjV",
      tagline: "Wandesk — desktop for agents",
      labMore: "Learn More",
      labMoreUrl: "https://github.com/Sider-ai/wandesk",
      resetTitle: "Clear Local Data",
      resetDesc: "Delete the local workspace, databases, files, and settings, then restore defaults.",
      resetAction: "Clear",
      resetting: "Clearing...",
      resetConfirm: "This will permanently delete local Wandesk data, including chats, apps, settings, and files. This cannot be undone. Continue?",
      resetStarted: "Stopping services and clearing local data...",
      resetSubmitted: "Clear started. Wandesk will initialize again.",
      resetFailed: "Clear failed:",
      resetUnavailable: "This command is not available in the current environment.",
    },
  },
  zh: {
    lang: "zh-CN",
    brand: "Wandesk",
    status: {
      defaultTitle: "正在启动...",
      defaultMessage: "Wandesk 正在准备本地服务，请稍候。",
    },
    about: {
      title: "关于",
      version: "版本",
      website: "官网",
      websiteUrl: "https://wandesk.ai",
      community: "社区",
      communityUrl: "https://discord.gg/UJw2wGjV",
      tagline: "Wandesk — Agent 桌面",
      labMore: "了解更多",
      labMoreUrl: "https://github.com/Sider-ai/wandesk",
      resetTitle: "清除本地数据",
      resetDesc: "删除本地工作区、数据库、文件和设置，并恢复初始状态。",
      resetAction: "清除",
      resetting: "正在清除...",
      resetConfirm: "这会永久删除 Wandesk 的本地数据，包括对话、应用、设置和文件。此操作无法撤销。是否继续？",
      resetStarted: "正在停止服务并清除本地数据...",
      resetSubmitted: "已开始清除。Wandesk 将重新初始化。",
      resetFailed: "清除失败：",
      resetUnavailable: "当前环境不支持清除本地数据。",
    },
  },
};

const resolveLocale = () => {
  const candidates = typeof navigator === "undefined"
    ? []
    : [...(navigator.languages || []), navigator.language].filter(Boolean);
  return candidates.some((locale) => String(locale).toLowerCase().startsWith("zh")) ? "zh" : "en";
};

const deepFreeze = (value) => {
  for (const item of Object.values(value)) {
    if (item && typeof item === "object") deepFreeze(item);
  }
  return Object.freeze(value);
};

export const shellLanguage = deepFreeze(languagePacks[resolveLocale()] || languagePacks.en);
