import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import type { WindowState } from "../types";
import { windowManager } from "../system/windows";

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

type ResizeState = {
  direction: ResizeDirection;
  sx: number;
  sy: number;
  x: number;
  y: number;
  w: number;
  h: number;
  minW: number;
  minH: number;
};

const TASKBAR_HEIGHT = 44;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getResizedRect(state: ResizeState, clientX: number, clientY: number) {
  const dx = clientX - state.sx;
  const dy = clientY - state.sy;
  const right = state.x + state.w;
  const bottom = state.y + state.h;
  const maxRight = window.innerWidth;
  const maxBottom = window.innerHeight - TASKBAR_HEIGHT;
  let x = state.x;
  let y = state.y;
  let w = state.w;
  let h = state.h;

  if (state.direction.includes("e")) {
    w = clamp(state.w + dx, state.minW, Math.max(state.minW, maxRight - state.x));
  }
  if (state.direction.includes("s")) {
    h = clamp(state.h + dy, state.minH, Math.max(state.minH, maxBottom - state.y));
  }
  if (state.direction.includes("w")) {
    x = clamp(state.x + dx, 0, right - state.minW);
    w = right - x;
  }
  if (state.direction.includes("n")) {
    y = clamp(state.y + dy, 0, bottom - state.minH);
    h = bottom - y;
  }

  return { x, y, w, h };
}

const resizeHandles: Array<{ direction: ResizeDirection; className: string }> = [
  { direction: "n", className: "top-0 left-3 right-3 h-2 cursor-n-resize" },
  { direction: "s", className: "bottom-0 left-3 right-3 h-2 cursor-s-resize" },
  { direction: "e", className: "right-0 top-3 bottom-3 w-2 cursor-e-resize" },
  { direction: "w", className: "left-0 top-3 bottom-3 w-2 cursor-w-resize" },
  { direction: "ne", className: "right-0 top-0 h-4 w-4 cursor-nesw-resize" },
  { direction: "nw", className: "left-0 top-0 h-4 w-4 cursor-nwse-resize" },
  { direction: "se", className: "right-0 bottom-0 h-4 w-4 cursor-nwse-resize" },
  { direction: "sw", className: "left-0 bottom-0 h-4 w-4 cursor-nesw-resize" }
];

export default function AppWindow({ win }: { win: WindowState }) {
  const dragRef = useRef<{ sx: number; sy: number; x: number; y: number } | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);
  const Component = win.component;

  useEffect(() => {
    function move(event: PointerEvent) {
      if (dragRef.current) {
        const nextX = dragRef.current.x + event.clientX - dragRef.current.sx;
        const nextY = dragRef.current.y + event.clientY - dragRef.current.sy;
        windowManager.updatePosition(win.id, Math.max(0, nextX), Math.max(0, nextY));
      }
      if (resizeRef.current) {
        windowManager.updateRect(win.id, getResizedRect(resizeRef.current, event.clientX, event.clientY));
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

  function startResize(direction: ResizeDirection, event: ReactPointerEvent<HTMLDivElement>) {
    if (win.state === "maximized") return;
    event.stopPropagation();
    windowManager.focus(win.id);
    resizeRef.current = {
      direction,
      sx: event.clientX,
      sy: event.clientY,
      x: win.x,
      y: win.y,
      w: win.w,
      h: win.h,
      minW: win.minW,
      minH: win.minH
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  return (
    <div
      className={`fixed overflow-hidden border border-white/50 bg-[#f7f4ef] shadow-[0_22px_70px_rgba(0,0,0,0.28)] ${win.state === "maximized" ? "rounded-none" : "rounded-[14px]"}`}
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
      {win.state !== "maximized" && resizeHandles.map((handle) => (
        <div
          key={handle.direction}
          data-window-resize
          className={`absolute z-10 ${handle.className}`}
          onPointerDown={(event) => startResize(handle.direction, event)}
        />
      ))}
    </div>
  );
}
