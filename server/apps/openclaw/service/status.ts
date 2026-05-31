import { runCmd } from "./exec.js";
import { runOpenClawJson } from "./openclaw.js";
import { normalizeSessionKey } from "./sessionKey.js";

const GATEWAY = "http://localhost:18789";
const DASHBOARD_URL = "http://127.0.0.1:18789/";

const probeGatewayRoot = async () => {
  try {
    const res = await fetch(`${GATEWAY}/`, { signal: AbortSignal.timeout(3000) });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
};

const readGatewayStatus = async () => {
  try {
    const { data } = await runOpenClawJson(["gateway", "status", "--json"], 15000);
    return {
      ok: true,
      data,
      gateway: Boolean(data?.rpc?.ok || data?.service?.runtime?.status === "running" || data?.gateway?.probeUrl),
      serviceStatus: data?.service?.runtime?.status || data?.service?.loadedText || "",
      authCapability: data?.rpc?.auth?.capability || data?.rpc?.capability || "",
      bind: data?.gateway?.bindHost && data?.gateway?.port ? `${data.gateway.bindHost}:${data.gateway.port}` : "",
      issue: data?.service?.configAudit?.issues?.[0]?.message || ""
    };
  } catch (err: any) {
    const rootReachable = await probeGatewayRoot();
    return {
      ok: false,
      data: null,
      gateway: rootReachable,
      serviceStatus: rootReachable ? "reachable" : "",
      authCapability: "",
      bind: rootReachable ? "127.0.0.1:18789" : "",
      issue: err?.message || ""
    };
  }
};

const readModelStatus = async () => {
  try {
    const { data } = await runOpenClawJson(["models", "status", "--json"], 15000);
    const missing = Array.isArray(data?.auth?.missingProvidersInUse) ? data.auth.missingProvidersInUse : [];
    return {
      ok: true,
      data,
      model: data?.resolvedDefault || data?.defaultModel || "",
      modelConfigured: Boolean((data?.resolvedDefault || data?.defaultModel) && !missing.length),
      missingProviders: missing
    };
  } catch (err: any) {
    return { ok: false, data: null, model: "", modelConfigured: false, missingProviders: [], issue: err?.message || "" };
  }
};

const readSessionSummary = async () => {
  try {
    const { data } = await runOpenClawJson(["sessions", "--json", "--limit", "8"], 15000);
    const sessions = Array.isArray(data?.sessions) ? data.sessions : [];
    return {
      ok: true,
      count: Number(data?.count ?? data?.totalCount ?? sessions.length) || 0,
      sessions: sessions.slice(0, 4).map((item: any) => ({
        key: String(item?.key || ""),
        sessionKey: normalizeSessionKey(item?.key || item?.sessionKey || item?.sessionId),
        model: [item?.modelProvider, item?.model].filter(Boolean).join("/"),
        updatedAt: item?.updatedAt || null,
        totalTokens: item?.totalTokens || 0
      }))
    };
  } catch {
    return { ok: false, count: 0, sessions: [] };
  }
};

const getStatus = async () => {
  const ver = await runCmd("openclaw", ["--version"], { timeout: 5000 });
  if (!ver.ok) return { online: false, version: null, gateway: false };

  const [gatewayStatus, modelStatus, sessionSummary] = await Promise.all([
    readGatewayStatus(),
    readModelStatus(),
    readSessionSummary()
  ]);

  return {
    online: true,
    version: ver.stdout.trim(),
    gateway: gatewayStatus.gateway,
    gatewayUrl: DASHBOARD_URL,
    serviceStatus: gatewayStatus.serviceStatus,
    authCapability: gatewayStatus.authCapability,
    bind: gatewayStatus.bind,
    gatewayIssue: gatewayStatus.issue,
    model: modelStatus.model,
    modelConfigured: modelStatus.modelConfigured,
    missingProviders: modelStatus.missingProviders,
    modelIssue: modelStatus.issue || "",
    sessionsCount: sessionSummary.count,
    recentSessions: sessionSummary.sessions
  };
};

export { getStatus };
