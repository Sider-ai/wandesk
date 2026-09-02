// App Workshop -- the landing point of the "AI builds an app" loop.
//
// It has no privileges of its own: it calls env.AI.run, and the agent behind that run
// holds write / bash, with the workspace root as its working directory. The agent writes
// three files into apps/<id>/, the kernel's directory watcher picks up the change, broadcasts
// apps.changed, and the desktop grows a new icon -- nobody touches the host source and nothing restarts.
//
// That is the entire meaning of "installed = the directory exists."
const BRIEF = `You are building an app for Wandesk. An app is a directory in the workspace, and it is itself a standard Cloudflare Worker site.

Create apps/<id>/ under the working directory, with exactly four things:

1. apps/<id>/app.json -- exactly four fields, no more, no less:
   { "id": "<lowercase-hyphenated>", "name": "<App Name>", "icon": "<one emoji>", "mounts": { "window": "/" } }
   You may add one more field, "description" (one sentence).

2. apps/<id>/server.js -- the Worker:
   export default { async fetch(req, env) { … } }
   - Handle /api/* yourself; for everything else return env.ASSETS.fetch(req)
   - Use env.DB (the D1 interface) for data: env.DB.exec(create-table script),
     env.DB.prepare(sql).bind(...).all() / .first() / .run()
   - To use AI, call env.AI.ask({ summary, prompt, system }). summary is required and must be one sentence.
   - Create tables with lazy ensure (exec once, on the first request) -- never await at the top level of the module.

3. apps/<id>/public/index.html -- the front end, a single file with its own <style>.
   It shares an origin with its own backend, so fetch("/api/…") directly; no SDK is needed.
   Only add <script src="/_wd/sdk.js"></script> and use window.wandesk.ui.* when you need to touch the shell (show a toast, change the title).

4. apps/<id>/APP.md -- documentation for the AI: first line "# Name (id)", first paragraph one sentence saying what it is,
   followed by its data tables and what it can do. The kernel injects that one sentence into every future AI call, so every agent knows this app exists.

Constraints:
- Write only these four files -- do not touch anything outside apps/, and do not install dependencies;
- Use vanilla JS on the front end -- no React, no build step;
- Write the UI in English;
- Make it something people can actually use, not a placeholder;
- When you're done, answer with one sentence describing what you built -- no code.`;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/api/build" && req.method === "POST") {
      const { request } = await req.json();
      const want = String(request || "").trim();
      if (!want) return json({ error: "Tell us what you want" }, 400);

      // Stream: building an app takes several tool-use rounds, and the user needs to see it working
      return env.AI.stream({
        summary: `Building app: ${want.slice(0, 24)}`,
        system: BRIEF,
        prompt: `The app the user wants: ${want}`,
      });
    }

    return env.ASSETS.fetch(req);
  },
};
