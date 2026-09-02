// A thin wrapper between the shell and the kernel. The shell only talks to the kernel, never directly to an app — apps live on workerd's own port.
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

/** Gets the iframe URL for one mount point of an app — assembled by the kernel (only it knows which port workerd is on). */
export const appUrl = async (id: string, mount: "window" | "panel" = "window"): Promise<string | null> => {
  const j = await api<{ url?: string }>(`/api/apps/url?id=${encodeURIComponent(id)}&mount=${mount}`);
  return j.url || null;
};
