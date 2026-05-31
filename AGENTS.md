# Wandesk — Developer Guide (AGENTS.md)

Wandesk is an **AI desktop / local workbench**: a graphical workspace where the user describes an app and the AI builds it locally, alongside chat, files, tasks, and memory. This repo (`wandesk/`) is the **open-source product and upstream baseline** for shared runtime code.

- Public upstream: `github.com/Sider-ai/wandesk.git`.
- Maintainer mirrors may exist, but do not document private remotes, credentials, or deployment details here.
- Commit messages in this OSS upstream repo must be written in English.

---

## Tech stack

- **Backend**: TypeScript run directly with `tsx` (no build step). Two Node processes:
  - `server/main/index.ts` — main service, port `9502`: chat/WS, AI engine, tasks, settings, memory, files.
  - `server/apps/index.ts` — apps service, port `9503`: routes `/apps/<app>/*` to registered apps.
- **Frontend**: React 19 + React Router 7 + Vite + Tailwind 4, in `gui/`. Vite dev on `5173`, proxies `/api` `/apps` `/ws` to `9502`.
- **Database**: Node's built-in **`node:sqlite`** (`DatabaseSync`). Requires **Node >= 22.5**. No native modules, no `better-sqlite3`.
- **i18n**: source contains `__T_<KEY>__` tokens; a bake step (`scripts/start.ts`) statically replaces them with the chosen language's strings from `language/<lang>/`. See [i18n](#i18n--baking).

---

## Directory map

```
server/
  main/                 main service (system capabilities)
    index.ts            entry, binds 9502
    api/                HTTP/WS route handlers (auth, chat, task, runtime, settings, fs…)
    service/            business logic (chat, task, prompt, settings, runtime, auth)
      prompt/           system-prompt assembly (one file per section)
    repository/         DB access (client.ts opens database/aios.db; per-table modules)
    ai/                 AI execution loop, tool calling (functions/handler/runner/tools)
    llm/                provider request/response pipeline (input normalizers, requesters, parsers)
  apps/                 regular apps with their own backend boundary
    registry.ts         appLoaders array — register every app's backend here
    index.ts            loads registry, inits apps, routes /apps/*
    <app>/              one folder per app (api/ service/ repository/ APP.md)
  shared/               cross-cutting low-level helpers ONLY
    http/               readBody, json
    apps/db/createAppDb.ts   helper to open database/apps/<app>.db
gui/
  src/
    apps/               one folder per desktop app UI; index.ts registers them
    components/         shared UI pieces (LauncherPanel, ReloadModal, window chrome…)
    system/             ws client, window manager, etc.
    views/              top-level views (DesktopView, WelcomeView)
    data/               static data (providers.ts)
    stores/             shared client state
language/<en|zh>/       i18n source: gui/ + server/ JSON token files, apps/<app>/APP.md, WANDESK_TAKEOVER.md
scripts/start.ts        the bake script (token replacement + app/doc mirroring)
skills/                 bundled local skills
apps/                   BAKING OUTPUT (apps/<app>/APP.md) — NOT committed (.gitignore)
```

---

## Running (don't pollute the source)

`npm run dev` **bakes in place** — it replaces `__T_` tokens in the source with literals, so running it in the repo root dirties tracked files. For maintenance, run from a disposable copy outside the repo root, bake and run there, and keep the source tree clean (tokens intact):

```bash
rsync -a --delete --exclude node_modules --exclude .git ./ /tmp/wandesk-run/
cd /tmp/wandesk-run
npm install
npm run dev                     # English
AIOS_LANG=zh npm run dev        # Chinese
# open http://localhost:9502
```

Raw scripts (these dirty the source — run `git checkout .` afterwards):

```bash
npm run dev / dev:zh            # bake + start main + apps + vite in parallel
npm run build / build:zh        # bake + vite build
npm run typecheck               # tsc --noEmit
npm run start / start:apps      # start main / apps only
```

---

## Backend architecture

Layered, do not collapse layers into entry files:

- **api/** — thin HTTP/WS handlers. Read body with `readBody(req)` from `server/shared/http/readBody.js`; respond with `json(res, data, status?)`. Return `false` from an app's `handleApi` for an unmatched path so the apps server can emit the 404.
- **service/** — business logic. Provider-protocol fields are produced only at the service boundary (e.g. tasks express `responseFormat: "json"`; the task service translates to `response_format`). Don't hand-write the same low-level protocol param in multiple call sites.
- **repository/** — SQL access only. System tables live in `database/aios.db` (opened by `server/main/repository/client.ts`); app DBs in `database/apps/<app>.db`.

### node:sqlite usage

```ts
import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(path);
db.exec("PRAGMA journal_mode = WAL");          // not db.pragma(...)
const row = db.prepare("SELECT …").get(id);
const info = db.prepare("INSERT …").run(...);
return Number(info.lastInsertRowid);            // node:sqlite returns BigInt — coerce
// read-only: new DatabaseSync(path, { readOnly: true })
```

For app databases use `createAppDb("<app>.db")` from `server/shared/apps/db/createAppDb.ts`.

---

## Adding a regular app

A regular app = a folder under `server/apps/<app>/` + a folder under `gui/src/apps/<app>/`, registered on both sides.

**Backend** (`server/apps/<app>/`):
- `index.ts` default-exports `{ name, match: (path) => path.startsWith("/apps/<app>/"), handleApi, [initDb], [initRuntime] }`.
- `api/index.ts` — route handlers. `service/` — logic. `repository/` — DB (+ `repository/init.ts` for table creation, seeded data).
- `APP.md` — the doc the AI reads about this app (frontmatter `name` / `description`; document the API). English.
- Register: add `() => import("./<app>/index.js")` to `server/apps/registry.ts`.

**Frontend** (`gui/src/apps/<app>/`):
- `index.tsx` — the app shell (thin: layout/tabs, mounts children). `components/`, `hooks/`, `api.ts`, `types.ts` for anything non-trivial.
- Fetch the backend at `/apps/<app>/*`.
- Register in `gui/src/apps/index.ts`: import the component and add `{ id, name: "__T_APP_NAME_<APP>__", icon, component, defaultDesktopWindowSize, [minDesktopWindowSize] }`. Add the `app_name_<app>` token to `language/{en,zh}/gui/framework.json`.

`claude-code`, `codex`, `openclaw` are **external-CLI-agent integration** apps (detect CLI → forward → visualize). Use them as blueprints when integrating another agent framework.

### API conventions

- Regular app endpoints: `/apps/<app>/...`. System endpoints: `/api/...`.
- `GET` for reads, `POST` + JSON body for changes.
- Return JSON with the shared `json()` helper.

---

## i18n / baking

Every user-facing string is a token `"__T_<UPPERCASE_KEY>__"` in source. At startup the bake (`scripts/start.ts <lang> --force`) loads `language/<lang>/**/*.json`, builds a map (json key → `__T_<KEY.upper>__`), and replaces tokens across `.ts/.tsx/.json/.md`. It also mirrors `language/<lang>/apps/<app>/APP.md` into runtime `apps/`, and mirrors `language/<lang>/WANDESK_TAKEOVER.md` into the runtime workspace root.

`AGENTS.md` is this repository's developer guide. Do not use it as the user-facing external-agent takeover document; that role belongs to `WANDESK_TAKEOVER.md`.

**Adding a UI string:**
1. Put a token such as `"__T_<MYAPP_THING>__"` in the source (double-quote context; for bare JSX text use `{"__T_<MYAPP_THING>__"}`), replacing the angle-bracketed key with the real key.
2. Add `"myapp_thing": "English"` to the matching file under `language/en/gui/`: app UI goes in `views/apps/<app>.json`, shared shell strings in `framework.json`, and cross-app common strings in `common.json`. Add the same key to `language/zh/gui/...`.
3. Keys must be unique and identical across all three repos (OSS/client/cloud) — never re-translate per repo.
4. Verify: bake en and zh both leave **0 unresolved `__T_` tokens** (the harness / `scripts/start.ts` reports this).

Seeded DB content (notebook/finance seeds, the App Creation Guide memory) is tokenized too — keep it that way.

---

## System prompt (the in-app AI)

`server/main/service/prompt/index.ts` assembles the AI's system prompt from sections, each its own file: `default` (identity), `environment`, `model`, `tools`, `apps` (installed app list from APP.md), `chats` (recent conversations), `tasks` (recent app tasks), `remarks`, `system-docs`, `memory`, plus per-message app context. To change the agent's behavior, edit `default.ts`'s token (`language/<lang>/server/prompt.json` → `system_default_prompt`) or the relevant section; `restartServer` reload picks it up.

---

## Reload mechanism

Backend code changes need a reload (Node caches the ESM module graph). The AI requests reloads via `POST /api/runtime/reload/request` with `build` / `restartApps` / `restartServer` flags — this broadcasts to the UI's `ReloadModal` for user confirmation, then `/api/runtime/reload` runs (probes the new process on a sidecar port; only swaps if healthy). Do **not** call the final reload endpoint directly, and do **not** `pkill`/`kill` the 9502/9503 services to "restart".

- `restartApps` when `server/apps/` changed (incl. `registry.ts`).
- `restartServer` when `server/main/` or `server/shared/` changed.
- `build` (Vite) when `gui/` changed.

---

## Ports & env

| Process | Port | Notes |
|---|---|---|
| main | 9502 | `AIOS_MAIN_HOST` (default `127.0.0.1` here), `AIOS_MAIN_PORT` |
| apps | 9503 | `AIOS_APPS_HOST` / `AIOS_APPS_PORT` |
| vite dev | 5173 | dev only |

Inter-process auth via `AIOS_API_TOKEN` (shared). `AIOS_LANG` selects the bake locale.

---

## Code conventions

- Keep entry files thin; split a file once it passes ~250–300 lines (components → `components/`, logic → `hooks/`, fetches → `api.ts`).
- Frontend default style is **skeuomorphic**: warm tones, soft shadows, paper/wood/fabric texture, tactile rounded controls. Match existing apps (`memory`, `notebook`, `chat`) before inventing a new look; reuse system Tailwind tokens. No flat/Material/glassmorphism unless asked.
- Every new window must be usable at its `defaultDesktopWindowSize` and degrade to `minDesktopWindowSize`.
- Keep DDL clean (`repository/init.ts` holds the current final schema — no legacy-compat branches).
- No system-level global Topbar/Sidebar component; each app owns its own chrome.

---

## Do NOT commit

`apps/` (baking output), `database/`, `files/`, `node_modules/`, `gui/dist/`, `.aios/`, any API keys / tokens / secrets.

---

## Baseline discipline (cross-repo)

This repo is upstream for shared runtime code: GUI apps, server, prompt, i18n, seeds, and local skills. Downstream packages or deployment variants should consume clean copies of shared code and keep packaging/deployment-only files outside this repo. Do not back-port shared behavior from a downstream package into OSS unless the same change belongs here as the single source of truth.
