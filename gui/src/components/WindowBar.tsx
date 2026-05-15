import { LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppearance } from "../stores/appearance";
import { useWindows, windowManager } from "../system/windows";

export default function WindowBar({ launcherOpen, onToggleLauncher }: { launcherOpen: boolean; onToggleLauncher: () => void }) {
  const windows = useWindows();
  const { desktopTheme } = useAppearance();
  const dark = desktopTheme === "dark";
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const windowClass = (win: (typeof windows)[number]) => {
    if (win.state === "minimized") {
      return dark
        ? "border-transparent opacity-45 hover:border-white/[0.08] hover:bg-white/[0.06] hover:opacity-75"
        : "border-transparent opacity-40 hover:border-black/[0.07] hover:bg-black/[0.04] hover:opacity-70";
    }
    if (windowManager.isActive(win.id)) {
      return dark
        ? "border-white/[0.12] bg-white/[0.1]"
        : "border-black/[0.12] bg-black/[0.06]";
    }
    return dark
      ? "border-transparent hover:border-white/[0.08] hover:bg-white/[0.06]"
      : "border-transparent hover:border-black/[0.07] hover:bg-black/[0.04]";
  };

  return (
    <div className={`fixed bottom-0 left-0 z-[250] flex h-11 w-screen items-center gap-2 border-t px-2 backdrop-blur-2xl ${dark ? "border-white/[0.08] bg-black/42" : "border-white/60 bg-white/56"}`}>
      <button className={`flex h-8 w-8 items-center justify-center rounded-xl transition active:scale-95 ${launcherOpen ? (dark ? "bg-white/[0.14]" : "bg-black/[0.08]") : (dark ? "hover:bg-white/[0.08]" : "hover:bg-black/[0.05]")}`} onClick={onToggleLauncher}>
        <LayoutGrid className={`h-[17px] w-[17px] ${dark ? "text-white" : "text-[#222]"}`} />
      </button>
      <div className={`mx-1.5 h-[22px] w-px flex-shrink-0 ${dark ? "bg-white/[0.08]" : "bg-black/[0.07]"}`} />
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
        {windows.map((win) => (
          <button
            key={win.id}
            className={`flex h-8 min-w-[72px] max-w-[150px] flex-shrink-0 items-center gap-1.5 rounded-[7px] border px-[9px] text-left transition-all ${windowClass(win)}`}
            onClick={() => windowManager.toggleFromTaskbar(win.id)}
          >
            <span className="text-[15px]">{win.icon}</span>
            <span className={`flex-1 truncate text-[12px] font-medium ${dark ? "text-white" : "text-[#222]"}`}>{win.title}</span>
          </button>
        ))}
      </div>
      <div className={`mx-1.5 h-[22px] w-px flex-shrink-0 ${dark ? "bg-white/[0.08]" : "bg-black/[0.07]"}`} />
      <div className="w-[84px] text-right">
        <div className={`text-[13px] font-semibold leading-[1.25] ${dark ? "text-white" : "text-[#222]"}`}>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        <div className={`text-[10px] leading-[1.25] ${dark ? "text-white/45" : "text-black/[0.38]"}`}>{now.toLocaleDateString([], { month: "numeric", day: "numeric" })}</div>
      </div>
    </div>
  );
}
