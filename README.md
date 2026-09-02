<div align="center">

# Wandesk

**One shell, one AI kernel that knows everything, one workerd. Everything else is an app.**

An open-source AI desktop. Describe an app and the built-in agent writes it into your workspace; the desktop grows an icon on the spot. Every app is a standard Cloudflare Worker site with its own origin and its own SQLite. Bring your own model, all local, no signup.

[Website](https://wandesk.ai) · [Chinese README](README.zh-CN.md) · [App Contract](CONTRACT.md) · [Discord](https://discord.gg/VUfTzCvz)

</div>

---

## Run from source

> Requires Node.js 22+. Chrome (or the desktop shell) — Safari does not resolve `*.localhost`.

```bash
git clone https://github.com/Sider-ai/wandesk.git
cd wandesk
npm install
npm run build:overseer   # compile the overseer (the supervising layer inside workerd)
npm run dev              # kernel on 9600, shell on 5180
```

Open <http://localhost:5180>. Right-click the desktop → Settings next to "Personalize", fill in any Responses- or Chat-Completions-compatible endpoint and a key. Then double-click **App Workshop** and describe an app.

Single-port production build:

```bash
npm run build && npm start   # http://localhost:9600
```

Desktop app (Electron):

```bash
npm run app                  # build and open the desktop shell
npm run dist:mac             # macOS .app (signed if a Developer ID is in the keychain)
npm run dist:mac:release     # signed + notarized .dmg — see build/README.md
npm run dist:win             # Windows installer — run on Windows
```

> Prefer a download? Packaged macOS / Windows builds are at **[wandesk.ai](https://wandesk.ai)**.

---

## How it is built

```text
shell/          🖥 Shell: only draws
  ui/           React — desktop, windows, taskbar, AppFrame (iframe host for apps)
  desktop/      Electron: boots the kernel, points a window at it
kernel/         🧠 Kernel: knows everything
  ai/ agent/    the AI core (pure JS, zero deps, kept in sync with the AGENT repo)
  syscall/      one file per binding: ai / db / assets / proc / fs / ui
  apps/         app lifecycle: scan / token / preset landing / directory watch
  memory/       long-term memory — injected only through env.AI, apps never read it raw
  data/         the kernel's own SQLite (sessions / memory / settings / activity)
runtime/        ⚙️ workerd: user space for apps
  overseer.js   routes <token>.localhost, injects binding shims, hosts AppStore (env.DB's SQLite)
  supervisor.ts starts and stops workerd
apps/           📦 preinstalled apps — each one a complete Worker site
```

## What an app looks like

```text
apps/notes/
├── app.json     { id, name, icon, mounts }   ← four fields, that's it
├── server.js    export default { async fetch(req, env) {…} }
└── public/      index.html + style.css
```

**Install = the directory exists. Remove = delete the directory.** The AI creates apps with `write`; the host changes nothing and never restarts. A new directory lands, the desktop grows an icon.

The full contract is in **[CONTRACT.md](CONTRACT.md)**.

## One origin per app

Apps live at `http://<token>.localhost:<port>/` — at the root of their own site, so absolute paths like `/style.css` and `fetch("/api/…")` just work, and `localStorage` is isolated per app. The token is derived from the install key and stays stable across restarts.

## No native apps

Everything in the activity bar and on the desktop is an app, **including the assistant and the file browser**. They get the same bindings as the apps you make, run in the same workerd, and keep their data in their own database (`apps/<id>/data.db` opens with `sqlite3`).

The only things in the shell that are not apps are Settings and Personalize — they configure the framework itself. Configuring the framework belongs to the shell; doing work is always an app.

## env.AI: the single intelligence surface

> Apps do not share data. Apps share one agent that knows everything.

An app does not need to know what else is on the system. It says one thing:

```js
return env.AI.stream({ summary: "Assistant: answer the user", prompt: text });
```

Memory, context and tools converge in the kernel. The kernel therefore never grows a domain concept — it never learns what a "note" is, and that is what lets the AI make apps without limit.

## Preinstalled apps

| App | | |
|---|---|---|
| ✦ Assistant | 🪄 App Workshop | 🗂 Files |
| 📔 Notebook | 👛 Ledger | 📖 Reader |
| ⛅ Weather | 🗞️ Hacker News | 💭 Imagine |
| 🔮 I Ching | 💕 Love House | 📱 Phone |
| 🃏 Three-Card Poker | 🎱 Pool | 🏎️ Dusk Racer |
| 🚀 Aircraft | | |

They ship with the package, land in your workspace on first launch, and from then on are indistinguishable from apps you made — edit them, delete them. Each one ships with its source in `apps/<id>/src`; to rebuild after editing, run `npm install && npm run build` inside that app's directory.

## Where data lives

| | Location |
|---|---|
| Workspace | `~/wandesk` (override with `WANDESK_WORKSPACE`) |
| Kernel DB | `<workspace>/.wandesk/kernel.db` |
| App DBs | `<workspace>/.wandesk/store/…/*.sqlite` (`apps/<id>/data.db` is a link to it) |
| Your files | `<workspace>/` |

## A few honest notes

- The agent behind `env.AI.run` has an **unsandboxed shell** and every binding is wide open — use it on a machine you trust.
- workerd is about 150MB per platform and ships inside the release package.

## Community

- Website: <https://wandesk.ai> · Chinese site: <https://wandesk.cn>
- Discord: <https://discord.gg/VUfTzCvz>
- Issues: <https://github.com/Sider-ai/wandesk/issues>

PRs, bug reports, and app ideas are welcome. For anything bigger than a small fix, open an issue first.

Looking for the previous generation (Tauri shell, per-app React modules)? It is preserved on the [`v1`](https://github.com/Sider-ai/wandesk/tree/v1) branch.

## License

[ISC](LICENSE)
