import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "../../stores/toast";
import { windowManager } from "../../system/windows";
import FileViewer from "./viewer";

type FsItem = {
  name: string;
  type: "dir" | "file";
  path: string;
};

type ContextMenu = {
  visible: boolean;
  x: number;
  y: number;
  item: FsItem | null;
};

type ModalState = null | {
  type: "prompt" | "confirm";
  title: string;
  placeholder?: string;
  value?: string;
  danger?: boolean;
};

const CTX_W = 188;
const CTX_H = 180;
const TEXT_EXT = new Set([".txt", ".md", ".json", ".csv", ".log"]);
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const FS_ROOT = "files";

const fileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ""));
  reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
  reader.readAsDataURL(file);
});

const extMatches = (path: string, set: Set<string>) => {
  const lower = path.toLowerCase();
  return Array.from(set).some((ext) => lower.endsWith(ext));
};

export default function FilesApp() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<FsItem[]>([]);
  const [currentPath, setCurrentPath] = useState("");
  const [selectedItem, setSelectedItem] = useState<FsItem | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu>({ visible: false, x: 0, y: 0, item: null });
  const [modal, setModal] = useState<ModalState>(null);
  const resolverRef = useRef<((value: string | boolean | null) => void) | null>(null);
  const uploadInput = useRef<HTMLInputElement | null>(null);

  const request = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) throw new Error(data.message || data.error || `${res.status}`);
    return data;
  };

  const breadcrumbs = useMemo(() => {
    const parts = String(currentPath || "").split("/").filter(Boolean);
    return [
      { name: "Files", icon: "🗂", path: "" },
      ...parts.map((name, index) => ({ name, icon: "📁", path: parts.slice(0, index + 1).join("/") }))
    ];
  }, [currentPath]);

  const statusText = useMemo(() => {
    if (loading) return "Loading...";
    const dirs = items.filter((item) => item.type === "dir").length;
    const files = items.filter((item) => item.type === "file").length;
    const parts = [];
    if (dirs) parts.push(`${dirs} folders`);
    if (files) parts.push(`${files} files`);
    if (selectedItem) parts.push(`Selected:${selectedItem.name}`);
    return parts.join("　·　") || "Empty folder";
  }, [items, loading, selectedItem]);

  const closeContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0, item: null });

  const loadItems = async (path = "") => {
    setLoading(true);
    try {
      const data = await request(`/api/fs/list?root=${encodeURIComponent(FS_ROOT)}&path=${encodeURIComponent(path)}`);
      setItems(Array.isArray(data.data) ? data.data : []);
      setCurrentPath(data.path ?? "");
      setSelectedItem(null);
      closeContextMenu();
    } catch (err) {
      toast.show((err as Error).message || "Failed to load files", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems("");
  }, []);

  const openDirectory = (path = "") => loadItems(path);

  const isViewable = (path = "") => extMatches(path, TEXT_EXT) || extMatches(path, IMAGE_EXT);

  const downloadFile = (item: FsItem) => {
    closeContextMenu();
    window.open(`/api/fs/download?root=${encodeURIComponent(FS_ROOT)}&path=${encodeURIComponent(item.path)}`, "_blank");
  };

  const handleOpen = async (item: FsItem) => {
    closeContextMenu();
    if (item.type === "dir") {
      await openDirectory(item.path);
      return;
    }
    if (isViewable(item.path)) {
      await windowManager.openComponent({
        key: `file-view:${item.path}`,
        appId: "files",
        title: item.name,
        icon: "📄",
        component: FileViewer,
        defaultDesktopWindowSize: { w: 560, h: 420 },
        minDesktopWindowSize: { w: 320, h: 240 },
        props: { path: item.path },
        singleton: true
      });
    } else {
      downloadFile(item);
    }
  };

  const selectItem = (item: FsItem) => {
    setSelectedItem(item);
    closeContextMenu();
  };

  const clearSelection = () => {
    setSelectedItem(null);
    closeContextMenu();
  };

  const placeMenu = (event: React.MouseEvent, item: FsItem | null = null) => {
    if (item) setSelectedItem(item);
    const x = Math.min(event.clientX + 4, window.innerWidth - CTX_W - 8);
    const y = Math.min(event.clientY + 4, window.innerHeight - CTX_H - 8);
    setContextMenu({ visible: true, x, y, item });
  };

  const buildPath = (name: string) => currentPath ? `${currentPath}/${name}` : name;

  const openPrompt = ({ title, placeholder = "", defaultValue = "" }: { title: string; placeholder?: string; defaultValue?: string }) => new Promise<string | null>((resolve) => {
    resolverRef.current = (value) => {
      if (typeof value === "string") resolve(value);
      else resolve(null);
    };
    setModal({ type: "prompt", title, placeholder, value: defaultValue, danger: false });
  });

  const openConfirm = ({ title, danger = false }: { title: string; danger?: boolean }) => new Promise<boolean>((resolve) => {
    resolverRef.current = (value) => resolve(value === true);
    setModal({ type: "confirm", title, danger });
  });

  const closeModal = (result: string | boolean | null) => {
    const resolver = resolverRef.current;
    resolverRef.current = null;
    setModal(null);
    if (resolver) resolver(result);
  };

  const submitModal = () => {
    if (!modal) return;
    closeModal(modal.type === "prompt" ? (modal.value || "") : true);
  };

  const createDir = async () => {
    closeContextMenu();
    const name = await openPrompt({ title: "Enter the new folder name" });
    if (!name?.trim()) return;
    try {
      await request("/api/fs/mkdir", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ root: FS_ROOT, path: buildPath(name.trim()) }) });
      await loadItems(currentPath);
    } catch (err) {
      toast.show((err as Error).message || "创建失败", { type: "error" });
    }
  };

  const createFile = async () => {
    closeContextMenu();
    const name = await openPrompt({ title: "Enter the new file name (for example note.md)" });
    if (!name?.trim()) return;
    try {
      await request("/api/fs/write", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ root: FS_ROOT, path: buildPath(name.trim()), content: "", create: true }) });
      await loadItems(currentPath);
    } catch (err) {
      toast.show((err as Error).message || "创建失败", { type: "error" });
    }
  };

  const triggerUpload = () => {
    closeContextMenu();
    uploadInput.current?.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = await fileToBase64(file);
      await request("/api/fs/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ root: FS_ROOT, name: file.name, data, dir: currentPath })
      });
      event.target.value = "";
      await loadItems(currentPath);
    } catch (err) {
      toast.show((err as Error).message || "上传失败", { type: "error" });
    }
  };

  const deleteFile = async (item: FsItem) => {
    closeContextMenu();
    const ok = await openConfirm({ title: `Delete file "${item.name}"?`, danger: true });
    if (!ok) return;
    try {
      await request("/api/fs/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ root: FS_ROOT, path: item.path }) });
      windowManager.closeByKey(`file-view:${item.path}`);
      await loadItems(currentPath);
    } catch (err) {
      toast.show((err as Error).message || "删除失败", { type: "error" });
    }
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f7f4ef]" onClick={closeContextMenu}>
      <input ref={uploadInput} type="file" className="hidden" onChange={handleUpload} />

      <div className="flex h-9 shrink-0 items-center gap-0 border-b px-4" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(247,244,239,0.9)" }}>
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path || "root"} className="inline-flex items-center">
            <button
              className={`inline-flex max-w-[160px] items-center gap-[4px] rounded-[7px] px-[7px] py-[3px] text-[12px] font-semibold transition ${index === breadcrumbs.length - 1 ? "cursor-default text-[#2a1f13]" : "text-[rgba(42,31,19,0.5)] hover:bg-black/[0.06] hover:text-[#2a1f13]"}`}
              onClick={(event) => {
                event.stopPropagation();
                if (index < breadcrumbs.length - 1) openDirectory(crumb.path);
              }}
            >
              <span className="text-[11px]">{crumb.icon}</span>
              <span className="truncate">{crumb.name}</span>
            </button>
            {index < breadcrumbs.length - 1 && <span className="mx-0.5 select-none text-[11px]" style={{ color: "rgba(0,0,0,0.2)" }}>›</span>}
          </span>
        ))}
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto p-5 [scrollbar-width:thin]"
        onContextMenu={(event) => {
          event.preventDefault();
          if ((event.target as HTMLElement).closest("[data-item]")) return;
          placeMenu(event, null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) clearSelection();
        }}
      >
        {loading ? (
          <div className="py-16 text-center text-[13px]" style={{ color: "rgba(0,0,0,0.35)" }}>Loading file list...</div>
        ) : !items.length ? (
          <div className="flex h-full flex-col items-center justify-center py-16">
            <div className="text-[40px] opacity-40">📁</div>
            <div className="mt-3 text-[15px] font-semibold text-[#2a1f13]">This directory is still empty</div>
            <div className="mt-1 text-[12.5px]" style={{ color: "rgba(0,0,0,0.4)" }}>You can upload files through chat first, or come back later to check again.</div>
          </div>
        ) : (
          <div className="grid content-start justify-start" style={{ gridTemplateColumns: "repeat(auto-fill,88px)", gap: "6px 4px" }}>
            {items.map((item) => (
              <div
                key={item.path}
                data-item="1"
                className={`flex select-none flex-col items-center gap-[5px] rounded-[12px] border-[1.5px] px-[6px] py-[10px] text-center transition ${selectedItem?.path === item.path ? "" : "hover:bg-[rgba(140,100,60,0.07)]"}`}
                style={selectedItem?.path === item.path ? { background: "rgba(140,100,60,0.13)", borderColor: "rgba(140,100,60,0.25)" } : { borderColor: "transparent" }}
                onClick={(event) => { event.stopPropagation(); selectItem(item); }}
                onDoubleClick={(event) => { event.stopPropagation(); handleOpen(item); }}
                onContextMenu={(event) => { event.preventDefault(); event.stopPropagation(); placeMenu(event, item); }}
              >
                {item.type === "dir" ? <FolderIcon /> : <FileIcon />}
                <div className="line-clamp-2 break-all text-[11.5px] font-medium leading-[1.3]" style={{ maxWidth: 78, color: "#2a1f13" }}>{item.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex h-7 shrink-0 items-center border-t px-4" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(238,232,222,0.7)" }}>
        <span className="text-[11px]" style={{ color: "rgba(0,0,0,0.35)" }}>{statusText}</span>
      </div>

      {contextMenu.visible && (
        <div className="fixed z-50 overflow-hidden border p-1 backdrop-blur" style={{ minWidth: 180, borderRadius: 13, borderColor: "rgba(0,0,0,0.1)", background: "rgba(250,247,242,0.97)", boxShadow: "0 2px 8px rgba(0,0,0,0.08),0 16px 48px rgba(0,0,0,0.16)", left: contextMenu.x, top: contextMenu.y }} onClick={(event) => event.stopPropagation()}>
          {!contextMenu.item ? (
            <>
              <ContextRow onClick={createDir}>📁 New Folder</ContextRow>
              <ContextRow onClick={createFile}>📄 New File</ContextRow>
              <ContextSep />
              <ContextRow onClick={triggerUpload}>⬆ Upload</ContextRow>
            </>
          ) : contextMenu.item.type === "dir" ? (
            <>
              <ContextRow onClick={() => handleOpen(contextMenu.item!)}>📂 Open</ContextRow>
              <ContextSep />
              <ContextRow onClick={createDir}>📁 New Folder</ContextRow>
              <ContextRow onClick={createFile}>📄 New File</ContextRow>
              <ContextSep />
              <ContextRow onClick={triggerUpload}>⬆ Upload</ContextRow>
              <ContextSep />
              <ContextRow danger onClick={() => deleteFile(contextMenu.item!)}>🗑 Delete</ContextRow>
            </>
          ) : (
            <>
              <ContextRow onClick={() => handleOpen(contextMenu.item!)}>👁 Preview</ContextRow>
              <ContextRow onClick={() => downloadFile(contextMenu.item!)}>⬇ Download</ContextRow>
              <ContextSep />
              <ContextRow danger onClick={() => deleteFile(contextMenu.item!)}>🗑 Delete</ContextRow>
            </>
          )}
        </div>
      )}

      {modal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6 py-8">
          <button type="button" className="absolute inset-0 border-none bg-[rgba(28,20,12,0.36)]" onClick={() => closeModal(modal.type === "prompt" ? null : false)} />
          <div className="relative z-10 flex w-full max-w-[400px] flex-col overflow-hidden rounded-[18px] border bg-[#fbfaf7] shadow-[0_18px_48px_rgba(0,0,0,0.22)]" style={{ borderColor: "rgba(92,67,50,0.16)" }}>
            <div className="px-5 pb-3 pt-5">
              <div className="text-[14.5px] font-semibold text-[#2a1f13]">{modal.title}</div>
              {modal.type === "prompt" && (
                <input
                  className="mt-3 w-full rounded-[9px] border px-3 py-2 text-[13px] outline-none transition-colors"
                  style={{ borderColor: "rgba(92,67,50,0.18)", background: "#fff", color: "#2a1f13" }}
                  value={modal.value || ""}
                  placeholder={modal.placeholder}
                  onChange={(event) => setModal((prev) => prev ? { ...prev, value: event.target.value } : prev)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitModal();
                    if (event.key === "Escape") closeModal(null);
                  }}
                  autoFocus
                />
              )}
            </div>
            <div className="flex items-center justify-end gap-2 border-t px-5 py-3" style={{ borderColor: "rgba(92,67,50,0.1)" }}>
              <button type="button" className="rounded-[9px] border px-4 py-[6px] text-[12px] font-semibold transition-colors hover:bg-black/[0.03]" style={{ borderColor: "rgba(92,67,50,0.16)", background: "#fff", color: "rgba(61,47,30,0.6)" }} onClick={() => closeModal(modal.type === "prompt" ? null : false)}>Cancel</button>
              <button type="button" className="rounded-[9px] px-4 py-[6px] text-[12px] font-semibold text-white transition-all hover:brightness-110" style={{ background: modal.danger ? "#b03a20" : "#5c4332" }} onClick={submitModal}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContextRow({ children, danger = false, onClick }: { children: ReactNode; danger?: boolean; onClick: () => void }) {
  return (
    <button
      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] font-medium transition ${danger ? "text-[#b03a20] hover:bg-[rgba(176,58,32,0.09)]" : "text-[#2a1f13] hover:bg-[rgba(140,100,60,0.1)]"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ContextSep() {
  return <div className="mx-1.5 my-[3px] h-px bg-black/[0.07]" />;
}

function FolderIcon() {
  return (
    <svg width="52" height="44" viewBox="0 0 52 44" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id="wandesk-folder-tab" x1="4" y1="3" x2="25" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d4b276" />
          <stop offset="1" stopColor="#b98d4d" />
        </linearGradient>
        <linearGradient id="wandesk-folder-body" x1="5" y1="9" x2="47" y2="41" gradientUnits="userSpaceOnUse">
          <stop stopColor="#dec08a" />
          <stop offset="1" stopColor="#c09350" />
        </linearGradient>
      </defs>
      <path d="M5 9.5C5 7.6 6.6 6 8.5 6h12.2c1.3 0 2.5.6 3.2 1.7l2 2.8H43c2.2 0 4 1.8 4 4v2.5H5V9.5Z" fill="url(#wandesk-folder-tab)" />
      <path d="M4 15h44c1.7 0 3 1.5 2.7 3.2l-3.2 19.2C47.1 39.5 45.4 41 43.3 41H8.7c-2.1 0-3.8-1.5-4.2-3.6L1.3 18.2C1 16.5 2.3 15 4 15Z" fill="url(#wandesk-folder-body)" />
      <path d="M7 18h39l-.4 2.4H7.4L7 18Z" fill="rgba(255,255,255,0.22)" />
      <path d="M4 15h44c1.7 0 3 1.5 2.7 3.2l-3.2 19.2C47.1 39.5 45.4 41 43.3 41H8.7c-2.1 0-3.8-1.5-4.2-3.6L1.3 18.2C1 16.5 2.3 15 4 15Z" fill="none" stroke="rgba(112,72,28,0.16)" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="42" height="48" viewBox="0 0 42 48" aria-hidden="true" className="shrink-0">
      <path d="M7 2.5h18.8L36 12.7V42c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4V6.5c0-2.2 1.8-4 4-4Z" fill="#fff" stroke="rgba(0,0,0,0.08)" />
      <path d="M25.5 3v8.1c0 1.3 1.1 2.4 2.4 2.4H36" fill="#e8e3da" stroke="rgba(0,0,0,0.05)" />
      <path d="M10 22h22M10 28h22M10 34h15" stroke="rgba(160,120,80,0.24)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
