import { useEffect, useMemo, useRef, useState } from "react";
import { createProviderCatalog } from "../data/providers";

type Locale = "en" | "zh";

const texts = {
  en: {
    welcome_title: "Welcome to AIOS",
    welcome_subline: "Let AI become your operating system. Complete tasks, build your own apps, and create your personal digital workspace.",
    get_key: "Get API Key",
    manual_panel_label: "Model API",
    agents_panel_label: "Code Agent",
    agents_intro: "You can use external agents such as Claude Code, Codex, and Antigravity to drive AIOS.",
    agents_message_hint: "Message to send to the agent",
    agents_message_template: "Please read the content at the link below to understand the AIOS architecture, available apps, and invocation flow, then take over orchestration and help me complete the following tasks.\n\nhttp://127.0.0.1:9502/welcome",
    enter_desktop_later: "Set up later and enter desktop",
    provider: "Provider",
    model_label: "Model",
    model_placeholder: "gpt-5.4",
    api_url: "API URL",
    api_key: "API Key",
    testing: "Connecting...",
    save_test: "Connect model",
    enter: "Enter system",
    err_key_required: "Please enter an API Key",
    err_url_required: "Please enter an API URL",
    err_model_required: "Please enter a model name",
    err_save: "Failed to save model settings",
    err_test: "Model connection test failed",
    default_intro: "Hello, I am AIOS.\n\nNice to meet you. I am an AI-driven personal operating system that can build apps, run tasks, and manage information for you - all locally, all under your control.\n\nLet us begin.",
    prompt_intro: "Generate the initial welcome introduction.",
    prompt_system: "You are AIOS, an AI-driven personal operating system. This is the first launch after initialization. Write a short self-introduction in 3-5 natural sentences. Tell the user what you can do and what makes you different.",
    prompt_user: "Follow the requirements above and output only JSON: {\"intro\":\"...\"}"
  },
  zh: {
    welcome_title: "欢迎使用 AIOS",
    welcome_subline: "让 AI 成为你的操作系统。完成各种任务，构建你的专属应用，创造你自己的数字空间。",
    get_key: "获取 API Key",
    manual_panel_label: "大模型 API",
    agents_panel_label: "Code Agent",
    agents_intro: "你可以用 Claude Code、Codex、Antigravity 等外部 agent 来驱动 AIOS。",
    agents_message_hint: "发送给 agent 的消息",
    agents_message_template: "请读取下面这个链接的内容，了解 AIOS 的系统架构、可用应用和调用方式，然后接管调度，帮我完成后续任务。\n\nhttp://127.0.0.1:9502/welcome",
    enter_desktop_later: "稍后设置，进入桌面",
    provider: "供应商",
    model_label: "模型",
    model_placeholder: "gpt-5.4",
    api_url: "API URL",
    api_key: "API Key",
    testing: "连接中...",
    save_test: "连接大模型",
    enter: "进入系统",
    err_key_required: "请填写 API Key",
    err_url_required: "请填写 API URL",
    err_model_required: "请填写模型名称",
    err_save: "模型配置保存失败",
    err_test: "模型连通测试失败",
    default_intro: "你好，我是 AIOS。\n\n很高兴认识你。我是一个 AI 驱动的个人操作系统，可以根据你的需求构建应用、执行任务、管理信息--一切都在本地运行，属于你。\n\n我们开始吧。",
    prompt_intro: "生成初始化欢迎介绍。",
    prompt_system: "你是 AIOS，一个 AI 驱动的个人操作系统。现在是初始化完成后的第一次启动，请做一段简短的自我介绍（3-5句），像第一次见面打招呼一样自然。告诉用户你能做什么、你的特点。",
    prompt_user: "请按上述要求做一段简短的自我介绍，只输出 JSON：{\"intro\":\"...\"}。"
  }
};

const agents = [
  { name: "Claude Code", icon: "/claude-color.svg" },
  { name: "Codex", icon: "/codex-color.svg" },
  { name: "Antigravity", icon: "/antigravity-color.svg" }
];

const LOCALE = "__T__LOCALE__" as Locale;

export default function WelcomeView() {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"api" | "agent">("api");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [typing, setTyping] = useState(false);
  const [entering, setEntering] = useState(false);
  const typeTimer = useRef<number | null>(null);

  const catalog = useMemo(() => createProviderCatalog(), []);
  const [model, setModel] = useState(() => {
    const openai = catalog.getProvider("openai");
    return {
      provider: "openai",
      apiUrl: openai?.apiUrl || "",
      model: openai?.defaultModel || "",
      apiKey: ""
    };
  });

  const t = texts[LOCALE] || texts.zh;
  const currentKeyUrl = catalog.getProvider(model.provider)?.keyUrl || "";

  const patchModel = (patch: Partial<typeof model>) => {
    setModel((current) => ({ ...current, ...patch }));
  };

  const applyProviderDefault = (provider: string) => {
    const item = catalog.getProvider(provider);
    setModel({
      provider,
      apiUrl: item?.apiUrl || "",
      model: item?.defaultModel || "",
      apiKey: ""
    });
  };

  const startTypewriter = (text: string) => {
    if (typeTimer.current) window.clearInterval(typeTimer.current);
    setDisplayedText("");
    setTyping(true);
    let i = 0;
    typeTimer.current = window.setInterval(() => {
      if (i < text.length) {
        i += 1;
        setDisplayedText(text.slice(0, i));
      } else {
        if (typeTimer.current) window.clearInterval(typeTimer.current);
        typeTimer.current = null;
        setTyping(false);
      }
    }, 38);
  };

  const showWelcome = (intro?: string) => {
    const text = intro || t.default_intro;
    setStep(2);
    startTypewriter(text);
  };

  const generateIntro = async () => {
    const testRes = await fetch("/api/task/create/instant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        app: "setup",
        title: t.prompt_intro,
        prompt: t.prompt_intro,
        schema: { required: ["intro"] },
        messages: [
          { role: "system", content: "只输出 JSON：{\"intro\":\"...\"}" },
          { role: "system", content: t.prompt_system },
          { role: "user", content: t.prompt_user }
        ]
      })
    });
    const testData = await testRes.json();
    if (!testRes.ok || testData?.success === false) {
      throw new Error(testData?.message || t.err_test);
    }
    const parsed = JSON.parse(String(testData.response || "{}"));
    return parsed?.intro || t.default_intro;
  };

  const enterWelcome = async () => {
    const intro = await generateIntro();
    showWelcome(intro);
  };

  const saveModelAndTest = async () => {
    setError("");

    if (!model.apiKey.trim()) {
      setError(t.err_key_required);
      return;
    }
    if (!model.apiUrl.trim()) {
      setError(t.err_url_required);
      return;
    }
    if (!model.model.trim()) {
      setError(t.err_model_required);
      return;
    }

    setPending(true);
    try {
      const saveRes = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          provider: model.provider,
          apiUrl: model.apiUrl,
          apiKey: model.apiKey,
          model: model.model
        })
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok || saveData?.success === false || saveData?.error) {
        throw new Error(saveData?.message || saveData?.error || t.err_save);
      }
      await enterWelcome();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.err_test);
    } finally {
      setPending(false);
    }
  };

  const enterSystem = () => {
    if (entering) return;
    setEntering(true);
    window.location.href = "/";
  };

  const skipToDesktop = async () => {
    if (pending) return;
    try {
      await fetch("/api/settings/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ welcomeSkipped: true })
      });
    } catch {
    }
    window.location.href = "/";
  };

  useEffect(() => {
    return () => {
      if (typeTimer.current) window.clearInterval(typeTimer.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f3ee] [font-family:'Barlow',system-ui,sans-serif] text-[#222]">
      <style>{`.welcome-cursor{display:inline-block;width:2px;height:1.1em;background:#222;vertical-align:text-bottom;margin-left:2px;animation:welcome-blink .9s step-end infinite}@keyframes welcome-blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_60%_at_15%_0%,rgba(255,220,160,.55)_0%,transparent_55%),radial-gradient(ellipse_60%_55%_at_90%_95%,rgba(200,210,255,.50)_0%,transparent_55%),radial-gradient(ellipse_50%_45%_at_75%_10%,rgba(220,200,255,.35)_0%,transparent_50%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6">
        {step === 1 ? (
          <div className="flex w-full items-center justify-center">
            <div className="w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.06)]">
              <div className="px-6 pt-9 sm:px-10 sm:pt-10">
                <h1 className="mb-1.5 text-[28px] font-bold leading-[1.2] tracking-[-0.5px] text-[#222]">{t.welcome_title}</h1>
                <p className="text-[14px] font-medium leading-[1.7] text-black/55">{t.welcome_subline}</p>
              </div>

              <div className="flex items-center gap-4 px-6 pt-6 sm:px-10">
                <div className="h-px flex-1 bg-black/[0.08]" />
                <div className="inline-flex rounded-full bg-black/[0.05] p-[4px]">
                  <button type="button" className={`rounded-full px-5 py-[7px] text-[12.5px] font-semibold transition-all ${activeTab === "api" ? "bg-[#222] text-white" : "text-black/50 hover:text-[#222]"}`} onClick={() => setActiveTab("api")}>{t.manual_panel_label}</button>
                  <button type="button" className={`rounded-full px-5 py-[7px] text-[12.5px] font-semibold transition-all ${activeTab === "agent" ? "bg-[#222] text-white" : "text-black/50 hover:text-[#222]"}`} onClick={() => setActiveTab("agent")}>{t.agents_panel_label}</button>
                </div>
                <div className="h-px flex-1 bg-black/[0.08]" />
              </div>

              {activeTab === "api" ? (
                <div className="flex min-w-0 flex-col px-6 pb-8 pt-5 sm:px-10">
                  <div className="flex min-w-0 flex-col gap-2.5">
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <div className="flex flex-col gap-[5px]">
                        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/35">{t.provider}</label>
                        <div className="relative">
                          <select value={model.provider} className="w-full appearance-none rounded-[10px] border-[1.5px] border-black/[0.09] bg-black/[0.02] px-3 py-[10px] pr-8 text-[13.5px] font-medium text-[#222] outline-none transition-all focus:border-[#222] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]" onChange={(event) => applyProviderDefault(event.target.value)}>
                            {catalog.groups.map((group) => (
                              <optgroup key={group.id} label={group.name}>
                                {catalog.getProvidersByGroup(group.id).map((provider) => <option key={provider.id} value={provider.id}>{provider.name}</option>)}
                              </optgroup>
                            ))}
                          </select>
                          <svg className="pointer-events-none absolute right-[11px] top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" /></svg>
                        </div>
                      </div>

                      <div className="flex flex-col gap-[5px]">
                        <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/35">{t.model_label}</label>
                        <input value={model.model} onChange={(event) => patchModel({ model: event.target.value.trim() })} placeholder={t.model_placeholder} className="w-full rounded-[10px] border-[1.5px] border-black/[0.09] bg-black/[0.02] px-3 py-[10px] text-[13.5px] font-medium text-[#222] outline-none transition-all placeholder:text-black/25 focus:border-[#222] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-[5px]">
                      <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/35">{t.api_url}</label>
                      <input value={model.apiUrl} onChange={(event) => patchModel({ apiUrl: event.target.value.trim() })} placeholder="https://..." className="w-full rounded-[10px] border-[1.5px] border-black/[0.09] bg-black/[0.02] px-3 py-[10px] text-[13.5px] font-medium text-[#222] outline-none transition-all placeholder:text-black/25 focus:border-[#222] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]" />
                    </div>

                    <div className="flex flex-col gap-[5px]">
                      <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/35">{t.api_key}</label>
                      <input value={model.apiKey} onChange={(event) => patchModel({ apiKey: event.target.value.trim() })} type="password" placeholder="sk-..." className="w-full rounded-[10px] border-[1.5px] border-black/[0.09] bg-black/[0.02] px-3 py-[10px] text-[13.5px] font-medium text-[#222] outline-none transition-all placeholder:text-black/25 focus:border-[#222] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]" />
                      {currentKeyUrl && <a href={currentKeyUrl} target="_blank" rel="noreferrer" className="mt-[2px] self-end text-[11.5px] font-medium text-black/45 underline-offset-[3px] transition-colors hover:text-[#222] hover:underline">{t.get_key} ↗</a>}
                    </div>

                    <div className={`max-h-[120px] overflow-y-auto break-all rounded-[10px] border border-[rgba(220,60,60,.2)] bg-[rgba(220,60,60,.05)] px-3 py-[9px] text-[12.5px] font-medium leading-[1.5] text-[#c0392b] [overflow-wrap:anywhere] ${error ? "block" : "hidden"}`}>{error}</div>
                  </div>

                  <div className="pt-5">
                    <button className="inline-flex w-full items-center justify-between rounded-full bg-[#222] py-[11px] pl-[22px] pr-[11px] text-[13.5px] font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-px hover:bg-[#111] hover:shadow-[0_8px_24px_rgba(0,0,0,0.24)] disabled:cursor-not-allowed disabled:opacity-45 disabled:transform-none" disabled={pending} onClick={saveModelAndTest}>
                      <span>{pending ? t.testing : t.save_test}</span>
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#222]">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                      </span>
                    </button>
                    <button type="button" className="mt-2.5 inline-flex w-full items-center justify-center rounded-full border border-black/[0.12] bg-white/70 px-5 py-[10px] text-[13px] font-semibold text-black/60 transition-all hover:-translate-y-px hover:border-black/[0.22] hover:bg-white hover:text-[#222] disabled:cursor-not-allowed disabled:opacity-45 disabled:transform-none" disabled={pending} onClick={skipToDesktop}>{t.enter_desktop_later}</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col px-6 pb-8 pt-5 sm:px-10">
                  <div className="mb-4 text-[13px] font-medium leading-[1.6] text-black/55">{t.agents_intro}</div>
                  <div className="mb-5 flex gap-2">
                    {agents.map((agent) => (
                      <div key={agent.name} className="flex min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-black/[0.06] bg-white/70 px-2.5 py-[7px]">
                        <img src={agent.icon} alt={agent.name} className="h-[16px] w-[16px] shrink-0" />
                        <span className="truncate text-[12px] font-semibold text-[#222]">{agent.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mb-[5px] text-[10px] font-bold uppercase tracking-[0.1em] text-black/35">{t.agents_message_hint}</div>
                  <div className="mb-5 select-all whitespace-pre-wrap rounded-[10px] border border-black/[0.08] bg-black/[0.03] px-3 py-[10px] text-[12px] leading-[1.65] text-[#222] [overflow-wrap:anywhere]" style={{ fontFamily: "'SF Mono','Menlo','Consolas',monospace" }}>{t.agents_message_template}</div>
                  <button type="button" className="inline-flex w-full items-center justify-center rounded-full border border-black/[0.12] bg-white/70 px-5 py-[10px] text-[13px] font-semibold text-black/60 transition-all hover:-translate-y-px hover:border-black/[0.22] hover:bg-white hover:text-[#222] disabled:cursor-not-allowed disabled:opacity-45 disabled:transform-none" disabled={pending} onClick={skipToDesktop}>{t.enter_desktop_later}</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <div className="w-full max-w-[540px] overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.1),0_4px_16px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col items-start px-8 py-12 sm:px-12 sm:pb-11">
                <div className="mb-8 min-h-[100px] w-full text-[18px] font-medium leading-[1.7] text-[#333]">
                  <span className="whitespace-pre-wrap break-words">{displayedText}</span>{typing && <span className="welcome-cursor" />}
                </div>
                <div className="flex w-full flex-col items-center gap-2.5 border-t border-black/[0.06] pt-6">
                  <button className="inline-flex w-full max-w-[240px] items-center justify-between self-center rounded-full bg-[#222] py-[11px] pl-[22px] pr-[11px] text-[13.5px] font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-px hover:bg-[#111] hover:shadow-[0_8px_24px_rgba(0,0,0,0.24)] disabled:cursor-not-allowed disabled:opacity-45 disabled:transform-none" disabled={entering} onClick={enterSystem}>
                    <span>{t.enter}</span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#222]">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
