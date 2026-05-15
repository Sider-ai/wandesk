import { useEffect, useMemo, useState } from "react";
import { createProviderCatalog, type ProviderGroup, type ProviderItem } from "../../data/providers";
import AboutTab from "./AboutTab";
import ContextTab from "./ContextTab";
import ModelTab from "./ModelTab";
import ToolTab from "./ToolTab";

type SettingsData = {
  provider?: string;
  contextRounds?: number;
  enableToolResultTruncate?: boolean;
  toolResultMaxChars?: number;
  enableToolLoopLimit?: boolean;
  toolMaxRounds?: number;
  apiUrl?: string;
  apiKey?: string;
  model?: string;
};

type SaveNotice = { type: string; message: string };

type ProviderConfig = { apiUrl?: string; apiKey?: string; model?: string };

const tabs = [
  { key: "model", label: "__T_SETTINGS_TAB_MODEL__", icon: "🤖" },
  { key: "tools", label: "__T_SETTINGS_TAB_TOOLS__", icon: "🔧" },
  { key: "messages", label: "__T_SETTINGS_TAB_MESSAGES__", icon: "💬" },
  { key: "about", label: "__T_SETTINGS_TAB_ABOUT__", icon: "ℹ️" }
] as const;

const DEFAULT_PROVIDER = "deepseek";
const PROVIDER_CONFIGS_KEY = "aios.providerConfigs.v1";
const catalog = createProviderCatalog();

const request = async <T,>(url: string, options: RequestInit = {}): Promise<T> => {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `${res.status} ${res.statusText}`);
  return data;
};

export default function SettingsApp() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("model");
  const [saveNotice, setSaveNotice] = useState<SaveNotice>({ type: "", message: "" });
  const [provider, setProvider] = useState(DEFAULT_PROVIDER);
  const [contextRounds, setContextRounds] = useState(100);
  const [enableToolResultTruncate, setEnableToolResultTruncate] = useState(true);
  const [toolResultMaxChars, setToolResultMaxChars] = useState(12000);
  const [enableToolLoopLimit, setEnableToolLoopLimit] = useState(true);
  const [toolMaxRounds, setToolMaxRounds] = useState(50);
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [providerConfigs, setProviderConfigs] = useState<Record<string, ProviderConfig>>({});
  const [providerGroups] = useState<ProviderGroup[]>(catalog.groups);
  const [providers] = useState<ProviderItem[]>(catalog.providers);

  const currentTabLabel = useMemo(() => tabs.find((tab) => tab.key === activeTab)?.label || "", [activeTab]);
  const getProvider = (id: string) => providers.find((item) => item.id === id);

  const loadProviderConfigs = () => {
    try {
      const raw = localStorage.getItem(PROVIDER_CONFIGS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      setProviderConfigs(parsed);
      return parsed as Record<string, ProviderConfig>;
    } catch {
      setProviderConfigs({});
      return {};
    }
  };

  const saveProviderConfigs = (configs: Record<string, ProviderConfig>) => {
    localStorage.setItem(PROVIDER_CONFIGS_KEY, JSON.stringify(configs));
    setProviderConfigs(configs);
  };

  const applyProviderConfig = (providerId: string, configs = providerConfigs) => {
    const saved = configs[providerId];
    if (saved) {
      setApiUrl(saved.apiUrl || "");
      setApiKey(saved.apiKey || "");
      setModel(saved.model || "");
      return;
    }

    const preset = getProvider(providerId);
    if (providerId === "custom") {
      setApiUrl("");
      setApiKey("");
      setModel("");
      return;
    }
    setApiUrl(preset?.apiUrl || "");
    setApiKey("");
    setModel(preset?.defaultModel || "");
  };

  const onProviderChange = (nextProvider: string) => {
    setProvider(nextProvider);
    applyProviderConfig(nextProvider);
  };

  const fetchSettings = async (configs: Record<string, ProviderConfig>) => {
    const data = await request<SettingsData>("/api/settings");
    const nextProvider = getProvider(data.provider || "") ? data.provider || DEFAULT_PROVIDER : DEFAULT_PROVIDER;
    setProvider(nextProvider);
    setContextRounds(data.contextRounds || 100);
    setEnableToolResultTruncate(data.enableToolResultTruncate !== false);
    setToolResultMaxChars(Number(data.toolResultMaxChars) || 12000);
    setEnableToolLoopLimit(data.enableToolLoopLimit !== false);
    setToolMaxRounds(Number(data.toolMaxRounds) || 50);
    setApiUrl(data.apiUrl || "");
    setApiKey(data.apiKey || "");
    setModel(data.model || "");
    saveProviderConfigs({ ...configs, [nextProvider]: { apiUrl: data.apiUrl || "", apiKey: data.apiKey || "", model: data.model || "" } });
  };

  const save = async () => {
    try {
      setSaveNotice({ type: "", message: "" });
      const maxChars = Math.max(1000, Math.min(50000, Number(toolResultMaxChars) || 12000));
      const maxRounds = Math.max(1, Math.min(500, Number(toolMaxRounds) || 50));
      setToolResultMaxChars(maxChars);
      setToolMaxRounds(maxRounds);

      await request("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          contextRounds,
          enableToolResultTruncate,
          toolResultMaxChars: maxChars,
          enableToolLoopLimit,
          toolMaxRounds: maxRounds,
          apiUrl,
          apiKey,
          model
        })
      });

      saveProviderConfigs({ ...providerConfigs, [provider]: { apiUrl, apiKey, model } });
      setSaveNotice({ type: "success", message: "Configuration saved" });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setSaveNotice({ type: "error", message: `Failed to save: ${message}` });
    }
  };

  useEffect(() => {
    const configs = loadProviderConfigs();
    void fetchSettings(configs);
  }, []);

  const content = (() => {
    if (activeTab === "model") {
      return <ModelTab provider={provider} providerGroups={providerGroups} providers={providers} apiUrl={apiUrl} apiKey={apiKey} model={model} saveNotice={saveNotice} onProviderChange={onProviderChange} onApiUrlChange={setApiUrl} onApiKeyChange={setApiKey} onModelChange={setModel} onSave={save} />;
    }
    if (activeTab === "tools") {
      return <ToolTab enableToolResultTruncate={enableToolResultTruncate} toolResultMaxChars={toolResultMaxChars} enableToolLoopLimit={enableToolLoopLimit} toolMaxRounds={toolMaxRounds} onEnableToolResultTruncateChange={setEnableToolResultTruncate} onToolResultMaxCharsChange={setToolResultMaxChars} onEnableToolLoopLimitChange={setEnableToolLoopLimit} onToolMaxRoundsChange={setToolMaxRounds} onSave={save} />;
    }
    if (activeTab === "messages") {
      return <ContextTab contextRounds={contextRounds} onContextRoundsChange={setContextRounds} onSave={save} />;
    }
    return <AboutTab />;
  })();

  return (
    <div className="flex h-full min-w-0 overflow-hidden" style={{ background: "#f5f3ef" }}>
      <div className="flex w-[160px] shrink-0 flex-col border-r py-4" style={{ background: "#ede9e2", borderColor: "rgba(0,0,0,0.07)" }}>
        <div className="mb-3 px-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(0,0,0,0.3)" }}>Settings</div>
        {tabs.map((tab) => (
          <button key={tab.key} className={`mx-2 mb-0.5 flex items-center gap-2 rounded-[9px] px-3 py-2 text-left text-[13px] font-medium transition-all ${activeTab === tab.key ? "shadow-[0_1px_3px_rgba(0,0,0,0.1)]" : "hover:bg-black/[0.05]"}`} style={activeTab === tab.key ? { background: "#fff", color: "#3d2f1e" } : { color: "rgba(0,0,0,0.5)" }} onClick={() => setActiveTab(tab.key)}>
            <span className="text-[14px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 [scrollbar-width:thin]">
        <div className="mx-auto max-w-[520px]">
          <h2 className="mb-4 text-[16px] font-bold" style={{ color: "#2a1f13" }}>{currentTabLabel}</h2>
          {content}
        </div>
      </div>
    </div>
  );
}
