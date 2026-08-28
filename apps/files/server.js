// 文件 —— 产品本体的第二个证明:它也只是个普通应用,用的是 env.FS。
// 路径一律相对工作区根,内核那边会拒掉任何越界。
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
