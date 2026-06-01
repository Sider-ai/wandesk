# CLAUDE.md

This repo (`wandesk/`) is the open-source Wandesk build **and the upstream baseline** for shared code (the desktop client and the cloud build derive from it).

If you're an agent here to write code, **read [`AGENTS.md`](./AGENTS.md) first** — it's the full developer guide (architecture, how to add apps, DB, i18n/baking, prompt system, reload, conventions). This file only highlights the rules that are easy to get wrong.

## Run it the clean way

`npm run dev` bakes `__T_` tokens into the source in place and dirties git. Use the sibling harness instead:

```bash
cd ../wandesk-test && node test.js r1      # English; AIOS_LANG=zh for Chinese; r3 the first time
# http://localhost:9502
```

There is also an optional desktop shell in `tauri/` (`npm run tauri:dev` / `tauri:build`, needs Rust). It is the upstream for the signed client's shell — edit shared shell code here. See [`tauri/README.md`](tauri/README.md).

## Hard rules

- **Baseline direction is one-way.** Change shared code here, then sync down to client/cloud. Never change shared code in the client and back-port to OSS. See `../wandesk-dev/doc/three-repo-sync.md`.
- **i18n keys are shared and identical across all three repos.** Add a UI string as a `__T_<KEY>__` token + entries in `language/{en,zh}/...`; never hard-code English, never re-translate per repo. Both `en` and `zh` bakes must leave 0 unresolved tokens.
- **DB is `node:sqlite`** (`DatabaseSync`), Node >= 22.5. `db.exec("PRAGMA …")` not `db.pragma`; coerce `lastInsertRowid` with `Number()`.
- **Restart via the reload endpoint**, not by killing 9502/9503. `POST /api/runtime/reload/request` with `restartApps` (server/apps changed) / `restartServer` (server/main|shared changed) / `build` (gui changed).
- **Keep layers separate** (`api` / `service` / `repository`) and files small (split past ~250–300 lines). Frontend style is skeuomorphic — match existing apps.
- **Never commit** `apps/` (baking output), `database/`, `files/`, `node_modules/`, `gui/dist/`, secrets.

## Releasing

Push both remotes: `git push origin main && git push gitee main`.
