import { createPortal } from "react-dom";
import { getApp } from "../apps";
import { windowManager } from "../system/windows";

type ContextMenuState = {
  visible: boolean;
  x: number;
  y: number;
};

type ContextMenuProps = {
  menu: ContextMenuState;
  dark: boolean;
  onClose: () => void;
  onWallpaper: () => void;
};

export default function ContextMenu({ menu, dark, onClose, onWallpaper }: ContextMenuProps) {
  if (!menu.visible) return null;

  const openApp = (appId: string) => {
    onClose();
    const app = getApp(appId);
    if (app) windowManager.openWindow(app);
  };
  const refresh = () => {
    onClose();
    location.reload();
  };
  const itemClass = dark ? "text-white hover:bg-white/[0.08]" : "text-[#222] hover:bg-black/[0.05]";
  const dividerClass = dark ? "bg-white/[0.08]" : "bg-black/[0.06]";
  const menuClass = dark ? "border-white/[0.08] bg-[#141a2b]/[0.84]" : "border-white/[0.5] bg-white/[0.78]";

  const item = (icon: string, label: string, action: () => void) => (
    <button
      type="button"
      className={`flex w-full cursor-pointer items-center gap-2 rounded-[8px] px-3 py-2 text-left text-[13px] font-medium transition-all duration-100 ${itemClass}`}
      onClick={action}
    >
      <span className="text-sm">{icon}</span>
      {label}
    </button>
  );

  return createPortal(
    <div className="fixed inset-0 z-[500]" onClick={onClose} onContextMenu={(event) => { event.preventDefault(); onClose(); }}>
      <div
        className={`absolute min-w-[180px] rounded-xl border p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.06)] backdrop-blur-2xl ${menuClass}`}
        style={{ left: menu.x, top: menu.y }}
        onClick={(event) => event.stopPropagation()}
      >
        {item("💬", "New Chat", () => openApp("chat"))}
        {item("➕", "New App", () => openApp("createapp"))}
        <div className={`mx-2 my-1 h-px ${dividerClass}`} />
        {item("🔄", "Refresh", refresh)}
        <div className={`mx-2 my-1 h-px ${dividerClass}`} />
        {item("🖼️", "Change Wallpaper", () => { onClose(); onWallpaper(); })}
        {item("⚙️", "System Settings", () => openApp("settings"))}
      </div>
    </div>,
    document.body
  );
}
