# Wandesk App Contract (v1)

> The shell only draws; the kernel knows everything; every app is a worker site —
> **no native apps, not a single exception.**

This document is the single canonical source: the manifest glossary = the binding
list = the SDK docs, one document doing all three jobs.

## 1. An app = a directory in the workspace, itself a standard Cloudflare Worker site

```
<workspace>/apps/<id>/
  app.json     manifest
  APP.md       what the AI reads (required): a one-sentence intro in the first
               paragraph, injected into the prompt by the kernel; everything after
               that describes data and usage
  server.js    Worker: export default { async fetch(req, env) {…} }
  public/      static assets (env.ASSETS reads from here)
  src/         frontend source (optional): if it exists, edit it and rebuild;
               if not, edit public/ directly
  package.json only present if src/ exists: the dependency list + build script;
               node_modules is not shipped with the package — whoever changes it installs it
  data.db      data — a link to the real database, sitting right next to the code so
               you and the AI can both crack it open with sqlite3
```

The real database lives under `<workspace>/.wandesk/store/`, managed by workerd's own
SQLite (see section 2); the `data.db` link is set up by the kernel the first time the
app opens its database — you never create it yourself.

**"Installed"** = the directory exists (auto-registered by the scan); **"removed"** =
the directory is deleted. The AI can build an app with just the `write` tool —
**it never touches the host's source, and nothing restarts.** The kernel watches
`apps/`; the moment a new directory lands, the desktop grows an icon.

Preinstalled apps ship with the package and land in the workspace on first launch;
after that they're indistinguishable from apps the user made — freely editable or
removable.

The manifest has exactly four fields (plus an optional `description`):

```json
{ "id": "notes", "name": "Notes", "icon": "📔",
  "mounts": { "window": "/", "panel": "/panel.html" } }
```

- **A mount point is a route path, not a filename**: `window` opens a window, `panel`
  pins a sidebar; at least one is required, defaulting to `window: "/"`.
  Two mounts of the same app are two instances sharing the same backend and data.
- There is no `capabilities` field — see section 5, "Current trade-offs."

### APP.md: the app's self-introduction

Like SKILL.md, one per app, living in its own directory. First line is the title,
first paragraph is a one-sentence summary, and everything after describes data
tables, capabilities, and how to call it.
The kernel injects every app's "icon + name + summary" into the prompt for every
AI call (both the assistant and `env.AI`), leaving the model to `read apps/<id>/APP.md`
for the details itself. When the manifest omits `description`, the summary is taken
from APP.md's first paragraph.

### Source and build: code you can edit, dependencies that don't ship

Preinstalled apps come with `src/` (React) and `package.json`; `public/` is the
compiled output, ready to run out of the box. To change the frontend, run
`npm install && npm run build` inside the app's directory — the output lands back in
`public/`, and the kernel's directory watcher picks up the change and refreshes the
window. The host takes no part in compiling — it ships no esbuild, no node_modules —
whoever changes it installs it, and that needs Node.js on the local machine.

`server.js` is always source — edit it and the change takes effect on the next
request. Apps built by the App Workshop are single-file frontends with no `src/`;
edit `public/` directly.

The upgrade check for preinstalled apps only looks at `src/`, `app.json`, `APP.md`,
`server.js`, and `package.json`; `public/`, `node_modules/`, and `data.db` don't count.

## 2. Architecture: workerd is the one and only user space

```
Shell (desktop / windows / taskbar / wallpaper)     ← only draws, has no idea what "Notes" is
──────────────────────────────────────────
Kernel   env.AI — the single intelligence surface, knows everything
         everything else is a binding: DB / ASSETS / PROC / FS / UI
──────────────────────────────────────────
Apps (all of them, including the assistant / files / app workshop) ← pure compute workers, all treated the same
```

This is isomorphic with the Cloudflare platform — not a metaphor, the exact same
pattern:

| binding | locally | maps to, in the cloud |
|---|---|---|
| `env.DB` | workerd's built-in SQLite (`.wandesk/store/`, `apps/<id>/data.db` is a link to it) | **D1** (same interface, not a line of code changes) |
| `env.ASSETS` | `apps/<id>/public/` | Workers Assets |
| `env.AI` / `PROC` / `FS` / `UI` | Wandesk-specific | none — degrades gracefully in the cloud |

```js
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === "/api/notes") {
      const { results } = await env.DB.prepare("SELECT * FROM notes ORDER BY id DESC").all();
      return Response.json(results);
    }
    return env.ASSETS.fetch(req);
  },
};
```

**The frontend shares an origin with its own backend** — `fetch("/api/…")` directly,
no SDK needed.
**Outbound network access is a plain `fetch()`** — no allowlist, no proxying.

`env.DB` never goes through the kernel: each app gets its own Durable Object
(`AppStore`), with the SQLite engine running right inside the workerd process —
this is exactly how D1 is built on Cloudflare. Queries no longer pass through Node,
so no number of apps can back up the kernel.
When the kernel or the AI needs to touch an app's data, it goes through the kernel's
`POST /api/apps/db { id, sql, params }`, which is the same execution point as the
app's own `env.DB`; for read-only inspection, `sqlite3 apps/<id>/data.db` works too.

## 3. env.AI — the single intelligence surface

This is the dividing line between Wandesk and an ordinary worker platform, and where
"apps share context" lands:

> **Apps don't share data. What apps share is one agent that knows everything.**

An app doesn't need to know what else is on the system — it just says one thing.
Memory, context, and tool convergence all happen at the kernel layer — the kernel
therefore never has to grow a single domain concept; it never learns what a
"bookmark" is.

| API | use |
|---|---|
| `env.AI.ask({ summary, prompt, system?, data? })` | a one-shot completion, no tools. Get a title, polish a paragraph |
| `env.AI.run({ summary, prompt })` | a full agent turn with `bash` / `read` / `write` / `edit`, returns final text |
| `env.AI.stream({ summary, prompt })` | same as `run`, but returns a `Response` — **the app just `return`s it directly**, and SSE flows straight through to its own frontend |

- **`summary` is required** — a one-line description that lands in the activity feed,
  so the user can see in the taskbar which app is burning tokens;
- The kernel is the AGENT repo's `ai/` + `agent/`, driver-based (`responses` /
  `chat` dual drivers) — switching providers only means changing the URL.
  **Changing the kernel must stay in sync on both sides**; it is not part of
  day-to-day iteration;
- `stream` relies on "streaming response within a single HTTP request" — the only
  push path that works inside workerd, see section 8.

```js
// The entire backend logic of the assistant app
if (url.pathname === "/api/send") {
  const { text } = await req.json();
  return env.AI.stream({ summary: `Assistant: ${text.slice(0, 24)}`, prompt: text });
}
```

## 4. Other bindings

| binding | API |
|---|---|
| `env.DB` | D1 interface: `prepare(sql).bind(…).all() / .first() / .run() / .raw()`, `exec(createTableScript)`, `batch([…])` (a single transaction) |
| `env.ASSETS` | `fetch(req)` reads from `public/`; falls back to `index.html` (SPA) on a miss that doesn't look like a filename |
| `env.PROC` | managed subprocesses: `spawn(cmd, args, cwd)` / `exec(…)` / `list()` / `log(id, tail)` / `kill(id)` |
| `env.FS` | the user's real files (relative to the workspace root): `list` / `read` / `readBase64` / `write` / `mkdir` / `delete` |
| `env.UI` | the shell: `toast(text)` / `openApp(id, route)` / `openExternal(url)` |
| `env.log(...)` | server-side logs flow back to the kernel console — so the AI can see what it's debugging in its own backend |

The frontend also has a mirrored SDK at `<script src="/_wd/sdk.js">`, used only when
touching **the shell itself**:

```js
window.wandesk.context()                     // { appId, mount }
window.wandesk.ui.toast / confirm / title / openApp / openExternal / copyText / close
window.wandesk.on(event, fn) / emit(event, payload)   // between instances of the same app (window ↔ panel)
```

## 5. One origin per app

Apps are mounted at **`http://<token>.localhost:<port>/`** — standing at the root of
their own site. This isn't a detail, it's the premise the whole contract rests on:
absolute paths like `/style.css` and `fetch("/api/…")` have to just work.
(Earlier, apps were mounted under a `/app/<token>/` path prefix, which broke every
absolute path out of the app's own root — the contract couldn't hold on that basis.)

- **The token is stable across restarts**: derived by HMAC from the install key plus
  the app id. Otherwise the origin would change on every startup, and the app's
  `localStorage` / `IndexedDB` would be wiped every restart;
- **Origins are naturally isolated**: apps can't cross-contaminate `localStorage`
  with each other; the shell is on a different origin, so the iframe can't reach the
  shell's DOM;
- `*.localhost` resolves directly to 127.0.0.1 in the browser (native support in
  Chromium / Firefox). The desktop shell is Electron, so the production path is
  stable; Safari doesn't support `*.localhost`, so use Chrome in browser mode.

## 6. Current trade-offs: full capability access

**Apps declare nothing — every binding is available unconditionally.** Reasoning:
apps are built by the user and the AI themselves, this isn't an app store; a
capability gateway trades isolation for experience, and in this scenario the loss
outweighs the gain.

`appId` is passed down by `HostGate` on every syscall, and apps can't forge it. It's
kept at zero cost, so there's somewhere to tighten this up later if needed.

> ⚠️ Apps can reach the network, spawn processes, and read/write real files; the agent
> behind `env.AI.run` holds an unsandboxed `bash`. This is the normal trust level for
> a local agent tool — the same order of magnitude of trust as the `bash` tool itself.

## 7. Data ownership

- **Domain data belongs to the app**: each app builds its own schema in its own
  database; the kernel provides no domain API at all — this is the precondition for
  the AI to be able to build apps without limit.
  Deleting an app's directory doesn't delete its database (just like deleting a
  Worker doesn't delete its D1) — the data stays in `.wandesk/store/` and comes back
  on reinstall;
- **The product's own data belongs to the kernel**: memory and the activity feed are
  only ever aggregated through `env.AI`; apps never read the raw text;
- **Real files belong to the user**: `env.FS`, always sandboxed to the workspace.

## 8. Known limitations

- **Server → client push**: works within a single HTTP request (streaming responses /
  SSE, which is exactly what `env.AI.stream` uses); a backend proactively pushing an
  event on some other connection doesn't work — workerd treats it as a cross-request
  context and cancels it.
  Bypassing this to get push and scheduled wake-ups (alarms) requires moving the
  session into a Durable Object — `env.DB` is already standing on a DO, so this step
  isn't far off.
- An app's backend is **loaded on demand** (starts on its first request), versioned by
  a content hash of `server.js` — edit it, and the next request gets the new version.
- workerd is about 150MB per platform; Windows and Linux each need their own binary.

## 9. Language

The product ships English-only today. The mechanism below exists so a second
language can be added later without redesigning anything: the shell's interface
language, the `settings.language` key, `window.wandesk.lang`, the `{ zh, en }`
manifest fields, and `APP.en.md` all remain in place, unused beyond `"en"` for now.

The kernel's `data/settings.ts` is the single source of truth:

- **Settings key `language`**: stored in the settings table, one more KV entry
  alongside the model connection. `currentLanguage()` reads it first, and falls back
  to the process environment when unset (`LANG` / `LC_ALL` starting with `en` → `en`,
  otherwise `zh`). The shell's settings panel changes it through the existing
  `POST /api/settings` — there's no dedicated language endpoint.
- **Changing the language broadcasts an event**: whenever `language` written via
  `POST /api/settings` actually changes, the kernel broadcasts
  `EV.LANGUAGE_CHANGED` (`"language.changed"`, carrying `{ language }`). The shell
  subscribes: it re-renders itself, and **reloads the iframe of every open app
  window** — an app only reads `window.wandesk.lang` once, at page load, so without a
  reload it never sees the new language.

- **How an app reads the language**: after loading `<script src="/_wd/sdk.js">`,
  `window.wandesk.lang` holds the current language string (`"zh"` or `"en"`); the
  kernel has also already set `document.documentElement.lang` to `zh-CN` / `en`. This
  SDK is assembled by the kernel **fresh on every request**, and the response carries
  `cache-control: no-store` — don't expect the browser or any layer to cache a stale
  language.

- **Copy convention inside an app**: an app with a `src/wandesk/` directory has a
  `src/wandesk/i18n.ts` in it:

  ```ts
  export const lang: "zh" | "en";
  export const t: (key: string, vars?: Record<string, string | number>) => string;
  ```

  The copy itself lives in `src/locales/zh.json` and `src/locales/en.json` (plain
  key → text objects); components only ever write `t("key")`, with `{name}`
  placeholders for interpolation — `t("greet", { name })` substitutes it. A missing
  key falls back to Chinese, and if that's missing too, it falls back to the key
  itself — the interface never breaks over a missing translation, it just shows an
  untranslated key. `zh.json` / `en.json` use esbuild's native JSON import, no extra
  configuration needed.

- **The bilingual fields in app.json**: `name` and `description` may be a plain
  string (Chinese by default), or written as

  ```json
  { "name": { "zh": "Notes", "en": "Notes" }, "description": { "zh": "…", "en": "…" } }
  ```

  The kernel picks by `currentLanguage()`, falling back to `zh` if the current
  language is missing, and to whichever language is present if even `zh` is missing.
  Externally (`/api/apps`, and `appsBlock()` injected into prompts) only the already
  resolved string is ever exposed — neither the shell nor the AI ever sees the raw
  bilingual object.

- **The English version of `APP.md`**: when the language is `en` and the app's
  directory has an `APP.en.md`, that's what gets read; otherwise it falls back to
  `APP.md`. Not having an `APP.en.md` isn't an error — most apps can get by with only
  a Chinese description.

- **The language note the kernel gives the AI**: `kernel/apps/scan.ts`'s
  `languageBlock()` generates a "user interface language" prompt block, placed after
  `appsBlock()` and before `memoryBlock()`, and injected into every call to
  `kernel/syscall/ai.ts` (`env.AI.ask/run/stream`) and `kernel/conv/index.ts` (the
  assistant app) — so every agent knows whether to reply in Chinese or English
  without the app ever having to ask.
