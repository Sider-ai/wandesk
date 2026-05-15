import { useEffect, useRef } from "react";
import type { WindowState } from "../types";
import { windowManager } from "../system/windows";

export default function AppWindow({ win }: { win: WindowState }) {
  const dragRef = useRef<{ sx: number; sy: number; x: number; y: number } | null>(null);
  const resizeRef = useRef<{ sx: number; sy: number; w: number; h: number } | null>(null);
  const Component = win.component;

  useEffect(() => {
    function move(event: PointerEvent) {
      if (dragRef.current) {
        const nextX = dragRef.current.x + event.clientX - dragRef.current.sx;
        const nextY = dragRef.current.y + event.clientY - dragRef.current.sy;
        windowManager.updatePosition(win.id, Math.max(0, nextX), Math.max(0, nextY));
      }
      if (resizeRef.current) {
        windowManager.updateSize(win.id, resizeRef.current.w + event.clientX - resizeRef.current.sx, resizeRef.current.h + event.clientY - resizeRef.current.sy);
      }
    }
    function up() {
      dragRef.current = null;
      resizeRef.current = null;
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [win.id]);

  if (win.state === "minimized") return null;

  return (
    <div
      className="fixed overflow-hidden rounded-[14px] border border-white/50 bg-[#f7f4ef] shadow-[0_22px_70px_rgba(0,0,0,0.28)]"
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.zIndex }}
      onPointerDown={() => windowManager.focus(win.id)}
    >
      <div
        className="flex h-10 cursor-default select-none items-center gap-2 border-b px-3"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(247,244,239,0.92)" }}
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest("[data-window-control]")) return;
          if (win.state === "maximized") return;
          dragRef.current = { sx: event.clientX, sy: event.clientY, x: win.x, y: win.y };
          (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        }}
        onDoubleClick={(event) => {
          if ((event.target as HTMLElement).closest("[data-window-control]")) return;
          windowManager.maximize(win.id);
        }}
      >
        <span className="text-[15px]">{win.icon}</span>
        <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold" style={{ color: "#2a1f13" }}>{win.title}</span>
        <button
          data-window-control
          className="h-3.5 w-3.5 rounded-full bg-[#f6c15f]"
          onPointerDown={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
          onClick={(event) => { event.stopPropagation(); windowManager.minimize(win.id); }}
          title="Minimize"
        />
        <button
          data-window-control
          className="h-3.5 w-3.5 rounded-full bg-[#67c86f]"
          onPointerDown={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
          onClick={(event) => { event.stopPropagation(); windowManager.maximize(win.id); }}
          title="Maximize"
        />
        <button
          data-window-control
          className="h-3.5 w-3.5 rounded-full bg-[#ef6a5d]"
          onPointerDown={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
          onClick={(event) => { event.stopPropagation(); windowManager.close(win.id); }}
          title="Close"
        />
      </div>
      <div className="flex h-[calc(100%-40px)] min-h-0 flex-col overflow-hidden">
        <Component {...(win.props || {})} windowId={win.id} />
      </div>
      {win.state !== "maximized" && (
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
          onPointerDown={(event) => {
            event.stopPropagation();
            resizeRef.current = { sx: event.clientX, sy: event.clientY, w: win.w, h: win.h };
            (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
          }}
        />
      )}
    </div>
  );
}
