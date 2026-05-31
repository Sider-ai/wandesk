import { runCmd } from "./exec.js";

const GATEWAY = "http://localhost:18789";

const getStatus = async () => {
  const ver = await runCmd("openclaw", ["--version"], { timeout: 5000 });
  if (!ver.ok) return { online: false, version: null, gateway: false };

  let gateway = false;
  try {
    const res = await fetch(`${GATEWAY}/`, { signal: AbortSignal.timeout(3000) });
    gateway = res.ok || res.status < 500;
  } catch {
    // gateway unreachable
  }

  return { online: true, version: ver.stdout.trim(), gateway };
};

export { getStatus };
