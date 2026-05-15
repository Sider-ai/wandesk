import { type MouseEvent, useEffect, useState } from "react";
import { apps, getApp } from "../apps";
import AppWindow from "../components/AppWindow";
import ContextMenu from "../components/ContextMenu";
import GlobalToast from "../components/GlobalToast";
import LauncherPanel from "../components/LauncherPanel";
import ReloadModal from "../components/ReloadModal";
import WallpaperPicker from "../components/WallpaperPicker";
import WindowBar from "../components/WindowBar";
import { useAppearance } from "../stores/appearance";
import { connect } from "../system/ws";
import { useWindows, windowManager } from "../system/windows";

export default function DesktopView() {
  const windows = useWindows();
  const { currentWallpaper, desktopTheme } = useAppearance();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const dark = desktopTheme === "dark";

  useEffect(() => {
    connect();
  }, []);

  function openApp(appId: string) {
    const app = getApp(appId);
    if (app) windowManager.openWindow(app);
    setSelectedId(null);
    setLauncherOpen(false);
  }

  function showContextMenu(event: MouseEvent) {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: Math.min(event.clientX, window.innerWidth - 200),
      y: Math.min(event.clientY, window.innerHeight - 260)
    });
  }

  return (
    <div className="h-[100dvh] w-screen overflow-hidden font-['Barlow',system-ui,sans-serif]">
      <div className={`desktop relative h-[calc(100dvh-44px)] w-screen transition-[background] duration-500 ${currentWallpaper.id}`} onClick={() => setSelectedId(null)} onContextMenu={showContextMenu}>
        <div className="desktop-icons absolute inset-6 z-[1]">
          {apps.map((app) => (
            <button
              key={app.id}
              className={`flex cursor-pointer select-none flex-col items-center gap-1.5 rounded-[10px] px-1 py-2 transition-all duration-150 active:scale-95 ${selectedId === app.id ? (dark ? "bg-white/[0.12] ring-1 ring-white/[0.22]" : "bg-black/[0.08] ring-1 ring-black/[0.18]") : (dark ? "hover:bg-white/[0.08]" : "hover:bg-white/50")}`}
              onClick={(event) => {
                event.stopPropagation();
                setSelectedId(app.id);
              }}
              onDoubleClick={(event) => {
                event.stopPropagation();
                openApp(app.id);
              }}
            >
              <span className={`text-[26px] transition-transform duration-200 ${selectedId !== app.id ? "-translate-y-0.5" : ""}`}>{app.icon}</span>
              <span className={`line-clamp-2 max-w-[80px] text-center text-[11px] font-semibold leading-tight break-words ${dark ? "text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.72)]" : "text-[#222] [text-shadow:0_1px_4px_rgba(255,255,255,0.9)]"}`}>{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      {windows.map((win) => <AppWindow key={win.id} win={win} />)}
      {launcherOpen && <LauncherPanel onOpen={openApp} onClose={() => setLauncherOpen(false)} />}
      <ContextMenu menu={contextMenu} dark={dark} onClose={() => setContextMenu((menu) => ({ ...menu, visible: false }))} onWallpaper={() => setPickerOpen(true)} />
      <WallpaperPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
      <ReloadModal />
      <WindowBar launcherOpen={launcherOpen} onToggleLauncher={() => setLauncherOpen((open) => !open)} />
      <GlobalToast />
    </div>
  );
}
