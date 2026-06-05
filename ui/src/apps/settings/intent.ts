export const intent = {
  async open({ existingWindow, openWindow, focusWindow, payload }: any) {
    const action = payload.action || "open";
    if (action !== "open") throw new Error(`Unsupported settings intent action: ${action}`);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      return existingWindow;
    }
    return openWindow();
  }
};

export default { intent };
