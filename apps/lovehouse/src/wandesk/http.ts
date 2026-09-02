// Outbound requests. **Changed for v2** — the backend fetches directly, no longer needs a
// host proxy (unrestricted).
export type HttpResult = { ok: boolean; status?: number; body?: string; error?: string };

export async function proxy(
  _appId: string,
  url: string,
  opts: { method?: string; headers?: Record<string, string>; body?: string } = {},
): Promise<HttpResult> {
  const r = await fetch("/api/http", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url, method: opts.method || "GET", headers: opts.headers, body: opts.body }),
  });
  return r.json();
}
