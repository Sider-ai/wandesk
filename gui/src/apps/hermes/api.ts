import type { HermesChatResponse, HermesMessage, HermesRoutine, HermesSession, HermesStatus } from "./types";

const BASE = "/apps/hermes";

const readJson = async <T>(res: Response): Promise<T> => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data as T;
};

const getStatus = async () => readJson<HermesStatus>(await fetch(`${BASE}/status`));

const getSessions = async (limit = 20) => {
  const data = await readJson<{ success: boolean; count: number; sessions: HermesSession[] }>(await fetch(`${BASE}/sessions?limit=${limit}`));
  return data.sessions || [];
};

const getMessages = async (sessionId: string) => {
  const data = await readJson<{ success: boolean; sessionId: string; messages: HermesMessage[] }>(await fetch(`${BASE}/messages?sessionId=${encodeURIComponent(sessionId)}`));
  return data.messages || [];
};

const getRoutines = async () => {
  const data = await readJson<{ success: boolean; count: number; routines: HermesRoutine[]; raw?: string }>(await fetch(`${BASE}/routines`));
  return data;
};

const sendMessage = async (message: string, sessionId?: string) => readJson<HermesChatResponse>(await fetch(`${BASE}/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message, sessionId })
}));

const startDashboard = async () => readJson<{ success: boolean; running: boolean; dashboardUrl: string }>(await fetch(`${BASE}/dashboard/start`, { method: "POST" }));

export { getMessages, getRoutines, getSessions, getStatus, sendMessage, startDashboard };
