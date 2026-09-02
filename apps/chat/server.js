// Assistant — the UI comes from the AGENT repo's web/ui; the backend is just the kernel's conversation surface.
//
// The whole backend is two lines: that's exactly what "no native apps" is meant to prove —
// even chat is just an ordinary app, using the same binding as a plain notebook app, with no special privileges.
//
// env.AI.fetch forwards the request as-is to the kernel's session API (conversations / messages / persistent SSE / settings / attachments),
// so the AGENT UI runs unmodified; swapping in a different UI against the same endpoint works just as well.
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/")) return env.AI.fetch(req);
    return env.ASSETS.fetch(req);
  },
};
