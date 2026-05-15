import { useEffect, useMemo, useState } from "react";

const TEXT_EXT = [".txt", ".md", ".json", ".csv", ".log"];
const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp"];
const FS_ROOT = "files";

const fileNameOf = (path: string) => path.split("/").pop() || path;

export default function FileViewer({ path }: { path?: unknown }) {
  const filePath = String(path || "");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [content, setContent] = useState("");
  const [original, setOriginal] = useState("");
  const [saving, setSaving] = useState(false);

  const fileName = fileNameOf(filePath);
  const ext = useMemo(() => {
    const name = fileName.toLowerCase();
    const index = name.lastIndexOf(".");
    return index >= 0 ? name.slice(index) : "";
  }, [fileName]);
  const mode = TEXT_EXT.includes(ext) ? "text" : IMAGE_EXT.includes(ext) ? "image" : "binary";
  const dirty = content !== original;

  const request = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) throw new Error(data.message || `${res.status}`);
    return data;
  };

  const loadFile = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      if (mode !== "text") {
        setLoading(false);
        return;
      }
      const data = await request(`/api/fs/read?root=${encodeURIComponent(FS_ROOT)}&path=${encodeURIComponent(filePath)}`);
      const next = data.item?.content ?? "";
      setContent(next);
      setOriginal(next);
    } catch (err) {
      setErrorMessage((err as Error).message || "读取失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFile();
  }, [filePath, mode]);

  const saveFile = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    try {
      await request("/api/fs/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ root: FS_ROOT, path: filePath, content })
      });
      setOriginal(content);
    } catch (err) {
      setErrorMessage((err as Error).message || "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const downloadFile = () => {
    window.open(`/api/fs/download?root=${encodeURIComponent(FS_ROOT)}&path=${encodeURIComponent(filePath)}`, "_blank");
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center bg-[#faf8f4] text-[12.5px]" style={{ color: "rgba(0,0,0,0.4)" }}>Loading file list...</div>;
  }

  if (errorMessage) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#faf8f4] px-6 text-center">
        <div className="text-[30px] opacity-40">⚠️</div>
        <div className="text-[13px] font-semibold text-[#2a1f13]">{errorMessage}</div>
      </div>
    );
  }

  if (mode === "text") {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[#faf8f4]">
        <div className="min-h-0 flex-1 p-4">
          <textarea
            className="h-full w-full resize-none rounded-[12px] border px-4 py-3 outline-none"
            style={{ fontFamily: "'SF Mono','Fira Code',monospace", fontSize: 12.5, lineHeight: 1.75, color: "#2a1f13", background: "#fff", borderColor: "rgba(160,120,80,0.15)" }}
            spellCheck={false}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>
        <div className="flex h-8 shrink-0 items-center gap-3 border-t px-4" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(234,228,218,0.6)" }}>
          <div className="h-1.5 w-1.5 rounded-full transition-opacity" style={{ background: "#c9a56e", opacity: dirty ? 1 : 0 }} />
          <span className="text-[10.5px] tabular-nums" style={{ color: "rgba(0,0,0,0.35)" }}>{content.length} 字符</span>
          <div className="flex-1" />
          <button className="rounded-full px-4 text-[11.5px] font-semibold text-white transition disabled:opacity-40" style={{ height: 22, background: "#5c4332", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }} disabled={saving || !dirty} onClick={saveFile}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  if (mode === "image") {
    return (
      <div className="flex h-full min-h-0 flex-col bg-[#faf8f4]">
        <div className="flex min-h-0 flex-1 items-center justify-center p-4">
          <img src={`/api/fs/download?root=${encodeURIComponent(FS_ROOT)}&path=${encodeURIComponent(filePath)}`} alt={fileName} className="max-h-full max-w-full rounded-[10px]" style={{ objectFit: "contain", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#faf8f4]">
      <div className="text-[40px] opacity-40">📄</div>
      <div className="text-[13px] font-semibold text-[#2a1f13]">{fileName}</div>
      <div className="text-[11.5px]" style={{ color: "rgba(0,0,0,0.4)" }}>此文件类型暂不支持直接查看</div>
      <button className="mt-1 rounded-full px-4 py-1.5 text-[11.5px] font-semibold text-white" style={{ background: "#5c4332", boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }} onClick={downloadFile}>Download</button>
    </div>
  );
}
