// 壳与内核之间的小封装。壳只跟内核说话,从不直接碰应用 —— 应用在 workerd 自己的端口上。
export const api = async <T = any>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(path, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers || {}) },
  });
  return res.json() as Promise<T>;
};

export const post = <T = any>(path: string, body: unknown) =>
  api<T>(path, { method: "POST", body: JSON.stringify(body) });

export type AppMeta = {
  id: string;
  name: string;
  icon: string;
  description?: string;
  mounts: { window?: string; panel?: string };
};

export const fetchApps = async (): Promise<AppMeta[]> => {
  const j = await api<{ apps?: AppMeta[] }>("/api/apps");
  return j.apps || [];
};

/** 拿某个应用某个挂载点的 iframe URL —— 由内核拼(它才知道 workerd 在哪个端口)。 */
export const appUrl = async (id: string, mount: "window" | "panel" = "window"): Promise<string | null> => {
  const j = await api<{ url?: string }>(`/api/apps/url?id=${encodeURIComponent(id)}&mount=${mount}`);
  return j.url || null;
};
