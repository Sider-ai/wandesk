// 出网。**为 v2 改过** —— 后端直接 fetch(),不再需要宿主代理(能力全开)。
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
