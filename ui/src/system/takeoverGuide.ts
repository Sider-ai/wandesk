const TAKEOVER_GUIDE_FILE = "WANDESK_TAKEOVER.md";
const TAKEOVER_GUIDE_PATH_PLACEHOLDER = "{{WANDESK_TAKEOVER_PATH}}";

let cachedAgentGuidePath = "";
let pendingAgentGuidePath: Promise<string> | null = null;

const joinGuidePath = (base = "") => {
  const normalized = String(base || "").replace(/\\/g, "/").replace(/\/+$/, "");
  return `${normalized || "."}/${TAKEOVER_GUIDE_FILE}`;
};

const readWorkspaceRoot = async () => {
  const res = await fetch("/api/fs/roots", { credentials: "include" });
  if (!res.ok) throw new Error("failed to load workspace roots");
  const data = await res.json();
  const roots = Array.isArray(data?.data) ? data.data : [];
  const workspace = roots.find((item: any) => item?.id === "workspace");
  const base = String(workspace?.base || "").trim();
  if (!base) throw new Error("workspace root is missing");
  return base;
};

export const resolveTakeoverGuidePath = async () => {
  if (cachedAgentGuidePath) return cachedAgentGuidePath;
  if (!pendingAgentGuidePath) {
    pendingAgentGuidePath = readWorkspaceRoot().then((base) => {
      cachedAgentGuidePath = joinGuidePath(base);
      return cachedAgentGuidePath;
    }).finally(() => {
      pendingAgentGuidePath = null;
    });
  }
  return pendingAgentGuidePath;
};

export const buildTakeoverPrompt = (template: string, fallbackPath: string, guidePath = "") => {
  const path = guidePath || fallbackPath;
  return String(template || "").split(TAKEOVER_GUIDE_PATH_PLACEHOLDER).join(path);
};
