import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { apps } from "../apps";
import { useAppearance } from "../stores/appearance";

export default function LauncherPanel({ onOpen, onClose }: { onOpen: (appId: string) => void; onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [restarting, setRestarting] = useState(false);
  const { desktopTheme } = useAppearance();
  const dark = desktopTheme === "dark";
  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? apps.filter((app) => app.name.toLowerCase().includes(q)) : apps;
  }, [search]);

  async function restart() {
    if (restarting) return;
    setRestarting(true);
    try {
      await fetch("/api/runtime/reload/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ build: false, restartApps: true, restartServer: false })
      });
    } catch {
    } finally {
      setRestarting(false);
    }
  }

  return (
    <div className={`fixed bottom-[54px] left-3 z-[300] w-[360px] rounded-2xl border p-3 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-2xl ${dark ? "border-white/[0.10] bg-[#111]/65" : "border-white/60 bg-white/70"}`} onClick={(event) => event.stopPropagation()}>
      <input
        autoFocus
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search apps"
        className={`mb-2.5 h-9 w-full rounded-xl border px-3 text-[13px] outline-none ${dark ? "border-white/[0.10] bg-white/[0.08] text-white placeholder:text-white/35" : "border-black/[0.08] bg-white/70 text-[#222] placeholder:text-black/35"}`}
      />
      <div className="grid max-h-[360px] grid-cols-4 gap-2 overflow-y-auto pr-1">
        {filteredApps.map((app) => (
          <button key={app.id} className={`flex h-[72px] flex-col items-center justify-center gap-1 rounded-xl transition active:scale-95 ${dark ? "hover:bg-white/[0.08]" : "hover:bg-black/[0.05]"}`} onClick={() => onOpen(app.id)}>
            <span className="text-[25px] leading-none">{app.icon}</span>
            <span className={`max-w-full truncate text-center text-[10.5px] font-medium ${dark ? "text-white/78" : "text-[#444]"}`}>{app.name}</span>
          </button>
        ))}
      </div>
      <div className={`mt-2.5 flex items-center justify-end border-t pt-2.5 ${dark ? "border-white/[0.08]" : "border-black/[0.06]"}`}>
        <button
          className={`flex h-[26px] items-center rounded-[6px] px-2 transition-colors disabled:opacity-40 ${dark ? "text-white/42 hover:bg-white/[0.08] hover:text-white" : "text-black/[0.4] hover:bg-black/[0.06] hover:text-[#222]"}`}
          disabled={restarting}
          onClick={() => void restart()}
          title="Restart App Service"
        >
          <RotateCcw className={`h-[13px] w-[13px] ${restarting ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}
