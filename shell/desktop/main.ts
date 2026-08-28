// Electron 主进程:一个窗口,指向本机内核。
//
// 壳在这里只做「窗口」这件事本身 —— 桌面、图标、任务栏全在网页里,
// 因为它们和浏览器版是同一份代码。
import { app, BrowserWindow, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { startKernel, stopKernel } from "./boot.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOME = path.join(__dirname, "../..");

let win: BrowserWindow | null = null;

const createWindow = async () => {
  win = new BrowserWindow({
    width: 1280, height: 840, minWidth: 900, minHeight: 600,
    title: "Wandesk",
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    backgroundColor: "#f6f6f7",
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });

  // 应用里的 target=_blank 交给系统浏览器,不在壳里开新窗口
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) void shell.openExternal(url);
    return { action: "deny" };
  });

  try {
    const origin = await startKernel(HOME);
    await win.loadURL(origin);
  } catch (e: any) {
    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(
      `<body style="font:14px -apple-system;padding:40px;color:#444">内核启动失败:${e?.message || e}</body>`,
    )}`);
  }
  win.on("closed", () => { win = null; });
};

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { stopKernel(); if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (!BrowserWindow.getAllWindows().length) void createWindow(); });
app.on("before-quit", stopKernel);
