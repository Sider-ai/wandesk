import { useState } from "react";
import { fetchJson, formatSize, formatTime, jsonlEntries, pickArray } from "../utils";

export function ProjectsTab({ basePath, title, subtitle, data, loading }: { basePath: string; title: string; subtitle?: string; data: any; loading?: boolean }) {
  const [currentPath, setCurrentPath] = useState<string[] | null>(null);
  const [dirData, setDirData] = useState<any>(null);
  const [dirLoading, setDirLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState<any>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const isCodex = basePath.includes("codex");
  const roots = data?.projects || [];
  const enterDir = async (segments: string[]) => {
    setCurrentPath(segments);
    setFileName("");
    setFileData(null);
    setExpanded({});
    setDirLoading(true);
    try {
      setDirData(await fetchJson(`${basePath}/projects/dir?path=${encodeURIComponent(segments.join("/"))}`));
    } catch (err) {
      setDirData({ ok: false, error: (err as Error).message });
    } finally {
      setDirLoading(false);
    }
  };
  const openFile = async (name: string) => {
    if (!currentPath) return;
    setFileName(name);
    setFileLoading(true);
    setCopied(false);
    setExpanded({});
    try {
      setFileData(await fetchJson(`${basePath}/projects/file?path=${encodeURIComponent([...currentPath, name].join("/"))}`));
    } catch (err) {
      setFileData({ ok: false, error: (err as Error).message });
    } finally {
      setFileLoading(false);
    }
  };
  const copyFile = async () => {
    if (!fileData?.ok) return;
    await navigator.clipboard.writeText(String(fileData.content || ""));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  const entries = jsonlEntries(fileData?.content || "");
  const sessions = pickArray(dirData, ["sessions"]);
  const files = pickArray(dirData, ["files"]);
  const subdirs = pickArray(dirData, ["subdirs"]);
  return (
    <div className="h-full space-y-4 overflow-y-auto px-6 py-5 cc-thin-scroll">
      {!currentPath ? (
        <>
          <div>
            <div className="text-[17px] font-bold">{isCodex ? "Session Archive" : "Projects"}</div>
            <div className="text-[11.5px]" style={{ color: "#6b5a46" }}>{subtitle} · {roots.length} items</div>
          </div>
          {loading ? <div className="text-[12px]" style={{ color: "#8a7965" }}>Loading...</div> : !roots.length ? <div className="text-[12px]" style={{ color: "#8a7965" }}>No sessions yet</div> : (
            <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: "rgba(140,100,60,0.12)" }}>
              {roots.map((item: any) => {
                const segment = String(item.dirName || item.year || item.name || "");
                return (
                  <button key={segment} className="grid w-full items-center gap-3 border-b bg-white px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[#fdf7e8]" style={{ gridTemplateColumns: isCodex ? "1fr 100px 110px 16px" : "1fr 90px 70px 110px 16px", borderColor: "rgba(140,100,60,0.08)" }} onClick={() => enterDir([segment])}>
                    <div className="min-w-0">
                      <div className="truncate text-[12.5px] font-medium" style={{ color: "#2a1f13" }}>{isCodex ? `📅 ${item.year || segment}` : `📁 ${item.cwd || segment}`}</div>
                      {!isCodex && <div className="cc-mono mt-0.5 truncate text-[10px]" style={{ color: "#8a7965" }}>{segment}</div>}
                    </div>
                    <div className="cc-mono text-right text-[11px]" style={{ color: "#4a3826" }}>{item.sessionCount || 0} sessions</div>
                    {!isCodex && <div className="cc-mono text-right text-[10.5px]" style={{ color: "#8a7965" }}>{formatSize(item.totalSize)}</div>}
                    <div className="cc-mono text-right text-[10.5px]" style={{ color: "#8a7965" }}>{formatTime(item.lastActivity)}</div>
                    <div style={{ color: "#8a7965" }}>›</div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-1 text-[12px]">
            <button className="hover:underline" style={{ color: "#5c4332" }} onClick={() => { setCurrentPath(null); setDirData(null); setFileName(""); setFileData(null); }}>{isCodex ? "📁 Session Archive" : "📁 Projects"}</button>
            {currentPath.map((segment, index) => (
              <span key={`${segment}-${index}`} className="contents">
                <span style={{ color: "#8a7965" }}>/</span>
                <button className="cc-mono max-w-[260px] truncate hover:underline" style={{ color: index === currentPath.length - 1 && !fileName ? "#2a1f13" : "#5c4332", fontWeight: index === currentPath.length - 1 && !fileName ? 600 : 400 }} onClick={() => enterDir(currentPath.slice(0, index + 1))}>{segment}</button>
              </span>
            ))}
            {fileName && <><span style={{ color: "#8a7965" }}>/</span><span className="cc-mono max-w-[260px] truncate font-semibold" style={{ color: "#2a1f13" }}>{fileName}</span></>}
          </div>
          {fileName ? (
            fileLoading ? <div className="text-[12px]" style={{ color: "#8a7965" }}>Reading...</div> : !fileData?.ok ? <div className="text-[12px]" style={{ color: "#b03a20" }}>{fileData?.error || "Failed to load"}</div> : (
              <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: "rgba(140,100,60,0.12)" }}>
                <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "rgba(140,100,60,0.08)", background: "#fffaf2" }}>
                  <div className="min-w-0 flex-1">
                    <div className="cc-mono truncate text-[12.5px] font-semibold" style={{ color: "#2a1f13" }}>{fileData.path}</div>
                    <div className="cc-mono mt-0.5 text-[10.5px]" style={{ color: "#8a7965" }}>{formatSize(fileData.size)}{fileData.truncated ? " · showing only the first 2MB" : ""}</div>
                  </div>
                  <button className="rounded-md px-2.5 py-1 text-[11px] hover:bg-black/5" style={{ color: "#5c4332" }} onClick={copyFile}>{copied ? "Copied" : "Copy"}</button>
                </div>
                <div className="max-h-[720px] overflow-auto cc-thin-scroll">
                  {String(fileName).toLowerCase().endsWith(".jsonl") ? (
                    <div className="space-y-2 px-4 py-3">
                      {!entries.length ? <div className="text-[12px]" style={{ color: "#8a7965" }}>No structured entries.</div> : entries.map((entry) => (
                        <button key={entry.key} className="w-full rounded-xl border px-3 py-2 text-left transition-colors hover:bg-[#fffaf2]" style={{ borderColor: "rgba(140,100,60,0.16)", background: "rgba(255,252,246,0.9)" }} onClick={() => setExpanded((prev) => ({ ...prev, [entry.key]: !prev[entry.key] }))}>
                          <div className="flex items-start gap-3">
                            <div className="cc-mono min-w-[26px] text-[10px]" style={{ color: "#8a7965" }}>{entry.index}</div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5"><span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ background: "rgba(92,67,50,0.1)", color: "#5c4332" }}>{entry.type}</span>{entry.timestamp && <span className="cc-mono text-[10px]" style={{ color: "#8a7965" }}>{entry.timestamp}</span>}{entry.sessionId && <span className="cc-mono text-[10px]" style={{ color: "#8a7965" }}>{entry.sessionId}</span>}</div>
                              <div className="mt-1 text-[12px] leading-relaxed" style={{ color: "#2a1f13" }}>{entry.summary}</div>
                              {expanded[entry.key] && <pre className="cc-mono mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg px-3 py-2 text-[11px]" style={{ background: "#f6efe2", color: "#4a3826" }}>{entry.pretty}</pre>}
                            </div>
                            <div className="text-[11px]" style={{ color: "#8a7965" }}>{expanded[entry.key] ? "Collapse" : "Expand"}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : <pre className="cc-mono whitespace-pre px-4 py-3 text-[11.5px]" style={{ margin: 0, background: "#faf6ec", color: "#2a1f13" }}>{fileData.content}</pre>}
                </div>
              </div>
            )
          ) : dirLoading ? <div className="text-[12px]" style={{ color: "#8a7965" }}>Loading...</div> : !dirData?.ok ? <div className="text-[12px]" style={{ color: "#b03a20" }}>{dirData?.error || "Failed to load"}</div> : (
            <>
              {dirData?.isRootProject && <div><div className="truncate text-[15px] font-bold">{String(dirData.cwd || "").split("/").filter(Boolean).pop() || dirData.cwd}</div><div className="cc-mono mt-0.5 text-[10.5px]" style={{ color: "#8a7965" }}>decoded cwd: {dirData.cwd}</div></div>}
              {!!subdirs.length && <ProjectRows title={`Directories (${subdirs.length})`} rows={subdirs} icon="📁" onClick={(item) => enterDir([...(currentPath || []), item.name])} />}
              {!!sessions.length && <ProjectRows title={`Sessions (${sessions.length})`} rows={sessions} icon="💬" onClick={(item) => openFile(item.name || `${item.sessionId}.jsonl`)} session />}
              {!!files.length && <ProjectRows title={`Other Files (${files.length})`} rows={files} icon="📄" onClick={(item) => openFile(item.name)} />}
              {!subdirs.length && !sessions.length && !files.length && <div className="text-[12px]" style={{ color: "#8a7965" }}>This directory is empty</div>}
            </>
          )}
        </>
      )}
    </div>
  );
}

function ProjectRows({ title, rows, icon, onClick, session }: { title: string; rows: any[]; icon: string; onClick: (item: any) => void; session?: boolean }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8a7965" }}>{title}</div>
      <div className="overflow-hidden rounded-xl border bg-white" style={{ borderColor: "rgba(140,100,60,0.12)" }}>
        {rows.map((item) => (
          <button key={item.name || item.sessionId} className="flex w-full items-center gap-3 border-b bg-white px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-[#fdf7e8]" style={{ borderColor: "rgba(140,100,60,0.08)" }} onClick={() => onClick(item)}>
            <span>{icon}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-medium" style={{ color: "#2a1f13" }}>{session ? (item.firstPrompt || item.threadName || item.name || "(untitled)") : item.name}</div>
              {session && <div className="cc-mono truncate text-[10px]" style={{ color: "#8a7965" }}>{String(item.sessionId || "").slice(0, 8)} · {item.model || item.name || ""}</div>}
            </div>
            <span className="cc-mono text-[10.5px]" style={{ color: "#8a7965" }}>{formatSize(item.size || item.sizeBytes)}</span>
            <span className="cc-mono text-[10.5px]" style={{ color: "#8a7965" }}>{formatTime(item.modified || item.lastTs)}</span>
            <span style={{ color: "#8a7965" }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
