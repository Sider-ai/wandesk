// Files -- the second proof of the product itself: it's just an ordinary app too, using env.FS.
// Paths are always relative to the workspace root; the kernel rejects any path that escapes it.
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    try {
      if (url.pathname === "/api/list") {
        const out = await env.FS.list(url.searchParams.get("path") || "");
        return json(out);
      }
      if (url.pathname === "/api/read") {
        const out = await env.FS.read(url.searchParams.get("path") || "");
        return json(out);
      }
      if (url.pathname === "/api/write" && req.method === "POST") {
        const { path, content } = await req.json();
        return json(await env.FS.write(path, content));
      }
      if (url.pathname === "/api/delete" && req.method === "POST") {
        const { path } = await req.json();
        return json(await env.FS.delete(path));
      }
      if (url.pathname === "/api/mkdir" && req.method === "POST") {
        const { path } = await req.json();
        return json(await env.FS.mkdir(path));
      }
    } catch (e) {
      return json({ error: String(e?.message || e) }, 200);
    }
    return env.ASSETS.fetch(req);
  },
};
