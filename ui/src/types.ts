import type { ComponentType } from "react";

export type AppDefinition = {
  id: string;
  name: string;
  icon: string;
  component: ComponentType<AppWindowProps>;
  defaultDesktopWindowSize: { w: number; h: number };
  minDesktopWindowSize?: { w: number; h: number };
};

export type AppWindowProps = {
  windowId: string;
} & Record<string, unknown>;

export type WindowState = {
  id: string;
  appId: string;
  windowKey: string;
  title: string;
  icon: string;
  component: ComponentType<AppWindowProps>;
  props?: Record<string, unknown>;
  x: number;
  y: number;
  w: number;
  h: number;
  minW: number;
  minH: number;
  zIndex: number;
  state: "normal" | "minimized" | "maximized";
  prevRect: null | Pick<WindowState, "x" | "y" | "w" | "h">;
};
