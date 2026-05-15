import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";

marked.setOptions({ breaks: true, gfm: true });

type Repo = {
  id: string | number;
  avatar?: string;
  url?: string;
  name?: string;
  description?: string;
  language?: string;
  stars?: number;
  forks?: number;
};

type HistoryItem = {
  id: string | number;
  repo_avatar?: string;
  repo_url?: string;
  repo_name?: string;
  repo_language?: string;
  repo_stars?: number;
  created_at?: string;
  analysis?: string;
};

const langs = ["JavaScript", "TypeScript", "Python", "Rust", "Go", "Java", "C++", "Swift", "Kotlin"];
const timeFilters = [{ id: "weekly", label: "This Week" }, { id: "monthly", label: "This Month" }];
const langClr = (language?: string) => ({
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  Rust: "#dea584",
  Go: "#00add8",
  Java: "#b07219",
  "C++": "#f34b7d",
  Swift: "#f05138",
  Kotlin: "#A97BFF"
}[language || ""] || "#8b949e");
const fmtNum = (value?: number) => Number(value || 0) >= 1000 ? `${(Number(value) / 1000).toFixed(1)}k` : String(value || 0);
const renderMd = (text?: string) => ({ __html: marked.parse(text || "") as string });

function GitHubMark() {
  return (
    <svg className="h-4 w-4 text-white" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  );
}

export default function GithubTrendingApp() {
  const [view, setView] = useState<"list" | "history">("list");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [since, setSince] = useState("weekly");
  const [language, setLanguageState] = useState("");
  const [analyzingId, setAnalyzingId] = useState<string | number | null>(null);
  const [analyses, setAnalyses] = useState<Record<string, string>>({});
  const [digesting, setDigesting] = useState(false);
  const [digestText, setDigestText] = useState("");
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const api = async (path: string, options?: RequestInit) => {
    const res = await fetch(`/apps/ghtrending/${path}`, options);
    return res.json();
  };

  const loadRepos = async (nextSince = since, nextLanguage = language) => {
    setLoading(true);
    try {
      const data = await api(`list?since=${encodeURIComponent(nextSince)}&language=${encodeURIComponent(nextLanguage)}`);
      const nextRepos = data.repos || [];
      setRepos(nextRepos);
      const ids = nextRepos.map((repo: Repo) => repo.id).filter(Boolean);
      if (ids.length) {
        const cached = await api("check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids })
        });
        setAnalyses((prev) => ({ ...prev, ...(cached.analyses || {}) }));
      }
    } catch {
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepos();
  }, []);

  const setTime = (value: string) => {
    setSince(value);
    setDigestText("");
    loadRepos(value, language);
  };

  const setLanguage = (value: string) => {
    setLanguageState(value);
    loadRepos(since, value);
  };

  const analyzeRepo = async (repo: Repo) => {
    if (analyses[String(repo.id)]) return;
    setAnalyzingId(repo.id);
    try {
      const data = await api("analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo })
      });
      setAnalyses((prev) => ({ ...prev, [String(repo.id)]: data.analysis || "" }));
    } catch {
      setAnalyses((prev) => ({ ...prev, [String(repo.id)]: "Failed" }));
    } finally {
      setAnalyzingId(null);
    }
  };

  const doDigest = async () => {
    setDigesting(true);
    try {
      const list = repos.slice(0, 15).map((repo, index) => `${index + 1}. ${repo.name} - ${repo.description || "N/A"} (⭐${repo.stars}, ${repo.language || "N/A"})`).join("\n");
      const data = await api("digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ list })
      });
      setDigestText(data.analysis || "");
    } catch {
      setDigestText("Failed");
    } finally {
      setDigesting(false);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await api("history");
      setHistoryItems(data.analyses || []);
    } catch {
      setHistoryItems([]);
    }
    setView("history");
  };

  const headerTitle = useMemo(() => view === "history" ? null : "Open Source Radar", [view]);

  return (
    <div className="flex h-full flex-col bg-[#0d1117] text-[#c9d1d9]" style={{ fontFamily: "-apple-system,'PingFang SC',sans-serif" }}>
      <div className="flex shrink-0 flex-col gap-4 border-b border-[#21262d] bg-[#0d1117] px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <GitHubMark />
            </div>
            {view === "history" ? (
              <button onClick={() => setView("list")} className="text-[13px] font-medium text-[#8b949e] transition-colors hover:text-[#c9d1d9]">← Back</button>
            ) : (
              <span className="text-[15px] font-bold tracking-wide text-white">{headerTitle}</span>
            )}
          </div>
          {view !== "history" && (
            <button onClick={loadHistory} className="flex items-center gap-1.5 rounded-full border border-[#30363d]/50 bg-[#21262d]/50 px-3 py-1.5 text-[11px] font-medium text-[#8b949e] shadow-sm transition-colors hover:bg-[#30363d] hover:text-white">
              ◷ Insight History
            </button>
          )}
        </div>

        {view !== "history" && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex shrink-0 rounded-lg border border-[#30363d] bg-[#161b22] p-0.5 shadow-sm">
              {timeFilters.map((filter) => (
                <button key={filter.id} onClick={() => setTime(filter.id)} className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition-all ${since === filter.id ? "bg-[#21262d] text-[#c9d1d9] shadow-sm ring-1 ring-white/10" : "text-[#8b949e] hover:text-[#c9d1d9]"}`}>
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
              <div className="flex min-w-max items-center gap-2 pr-2">
                {["", ...langs].map((item) => (
                  <button key={item || "all"} type="button" onClick={() => setLanguage(item)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all ${language === item ? "border-[#388bfd]/40 bg-[#388bfd]/10 text-[#58a6ff]" : "border-[#30363d] bg-[#161b22] text-[#8b949e] hover:border-[#8b949e] hover:text-[#c9d1d9]"}`}>
                    {item || "All languages"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {view === "list" ? (
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="py-16 text-center text-sm text-[#484f58]">Loading...</div> : (
            <div className="space-y-3 p-4">
              <div className="mb-3">
                {!digestText ? (
                  <div className="flex items-center justify-between rounded-xl border border-[#388bfd]/20 bg-[#388bfd]/10 p-4">
                    <div>
                      <div className="mb-1 text-[13px] font-bold text-[#58a6ff]">Open Source Radar Digest</div>
                      <div className="text-[11px] text-[#58a6ff]/70">Summarize the most noteworthy open source projects in the current time range and highlight their core strengths with one click</div>
                    </div>
                    <button onClick={doDigest} disabled={digesting} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#238636] px-4 py-2 text-[12px] font-medium text-white transition-all active:scale-95 disabled:opacity-40 hover:bg-[#2ea043]">
                      <span>{digesting ? "⟳" : "✦"}</span>{digesting ? "Generating..." : "AI Digest"}
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5 text-xs leading-relaxed text-[#8b949e]">
                    <div className="mb-4 flex items-center justify-between border-b border-[#21262d] pb-3">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#58a6ff]"><span className="text-[14px]">✦</span> AI Digest</span>
                      <button onClick={() => setDigestText("")} className="text-[12px] text-[#484f58] transition-colors hover:text-[#c9d1d9]">✕</button>
                    </div>
                    <div className="prose prose-sm prose-invert max-w-none text-[#8b949e]" dangerouslySetInnerHTML={renderMd(digestText)} />
                  </div>
                )}
              </div>

              {repos.map((repo) => (
                <div key={repo.id} className="rounded-xl border border-[#21262d] bg-[#161b22] p-4 transition-colors hover:border-[#30363d]">
                  <div className="flex items-start gap-3">
                    {repo.avatar && <img src={repo.avatar} className="mt-0.5 h-8 w-8 shrink-0 rounded-full" />}
                    <div className="min-w-0 flex-1">
                      <a href={repo.url} target="_blank" className="mb-1 block truncate text-sm font-semibold text-[#58a6ff] hover:underline">{repo.name}</a>
                      {repo.description && <p className="mb-3 text-xs leading-relaxed text-[#8b949e]">{repo.description}</p>}
                      <div className="flex items-center gap-4 text-[11px] text-[#484f58]">
                        {repo.language && <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full" style={{ background: langClr(repo.language) }} />{repo.language}</span>}
                        <span>⭐ {fmtNum(repo.stars)}</span>
                        <span>🍴 {fmtNum(repo.forks)}</span>
                      </div>
                    </div>
                    <button onClick={() => analyzeRepo(repo)} disabled={analyzingId === repo.id || Boolean(analyses[String(repo.id)])} className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all disabled:opacity-40 ${analyses[String(repo.id)] ? "bg-[#238636]/15 text-[#3fb950]" : "bg-[#21262d] text-[#8b949e] hover:bg-[#388bfd]/10 hover:text-[#58a6ff]"}`}>
                      {analyses[String(repo.id)] ? "✦ Analyzed" : "✦ AI Insight"}
                    </button>
                  </div>
                  {analyzingId === repo.id && !analyses[String(repo.id)] ? (
                    <div className="mt-4 flex items-center gap-2 border-t border-[#21262d] pt-4 text-xs text-[#8b949e]"><span className="animate-spin">⟳</span><span className="animate-pulse">Analyzing repository details...</span></div>
                  ) : analyses[String(repo.id)] ? (
                    <div className="mt-3 border-t border-[#21262d] pt-3 text-xs leading-relaxed text-[#8b949e]" dangerouslySetInnerHTML={renderMd(analyses[String(repo.id)])} />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {!historyItems.length ? <div className="py-16 text-center text-sm text-[#484f58]">No insight history yet</div> : (
            <div className="space-y-3 p-4">
              {historyItems.map((item) => (
                <div key={item.id} className="rounded-xl border border-[#21262d] bg-[#161b22] p-4">
                  <div className="mb-3 flex items-start gap-3">
                    {item.repo_avatar && <img src={item.repo_avatar} className="mt-0.5 h-7 w-7 shrink-0 rounded-full" />}
                    <div className="min-w-0 flex-1">
                      <a href={item.repo_url} target="_blank" className="text-sm font-semibold text-[#58a6ff] hover:underline">{item.repo_name}</a>
                      <div className="mt-0.5 flex items-center gap-3 text-[11px] text-[#484f58]">
                        {item.repo_language && <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: langClr(item.repo_language) }} />{item.repo_language}</span>}
                        <span>⭐ {fmtNum(item.repo_stars)}</span>
                        <span className="text-[#30363d]">{item.created_at?.slice(0, 10)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs leading-relaxed text-[#8b949e]" dangerouslySetInnerHTML={renderMd(item.analysis)} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
