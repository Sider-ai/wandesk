# Wandesk Takeover Guide

This guide is for an external agent helping the user operate Wandesk on this machine.

This is the runtime guide. It is not `AGENTS.md`. `AGENTS.md` is for Wandesk development and repository collaboration, and usually contains source, baking, and contribution rules that end users do not need.

## Start Here

- Treat the directory containing this file as the Wandesk workspace root.
- This workspace is already baked. Do not inspect or edit `language/`, and do not ask the user to manage language packs.
- Read app-specific runtime docs from `apps/<app>/APP.md` when you need to operate a particular app.
- Prefer public Wandesk APIs over editing databases directly. Use direct database access only when the user explicitly needs inspection or repair.

## Runtime Layout

- `apps/` contains generated app documentation for agents.
- `files/` contains user-managed files and uploads.
- `database/aios.db` is the main system database.
- `database/apps/<app>.db` contains per-app data.
- `gui/`, `server/`, and `scripts/` are runtime implementation sources. Do not edit system-level directories unless the user is asking you to develop Wandesk itself.

## Local API

Use the main Wandesk service, usually:

```text
http://127.0.0.1:9602
```

If authentication is enabled and an API token is available, send it as:

```text
Authorization: Bearer $AIOS_API_TOKEN
```

Useful entry points:

- `GET /api/health` checks whether Wandesk is reachable.
- `GET /api/fs/roots` returns the current workspace and file roots.
- `GET /api/fs/list?root=workspace&path=...` lists files.
- `GET /api/fs/read?root=workspace&path=...` reads text files.
- `POST /api/fs/write` writes text files.
- `GET /apps/<app>/...` and `POST /apps/<app>/...` operate app backends through the main service.

Do not call the apps service port directly. Go through `/apps/...` on the main service so Wandesk's auth and proxy rules are respected.

## Operating Apps

1. Read `apps/<app>/APP.md`.
2. Inspect the app state through its HTTP endpoints or database only as needed.
3. Make the smallest change that completes the user's request.
4. If backend or frontend source changes are made, ask Wandesk to reload through `POST /api/runtime/reload/request` with the appropriate flags. Do not call `/api/runtime/reload` directly unless the user explicitly asks to bypass the confirmation modal.

Common reload flags:

- `build: true` after frontend changes.
- `restartApps: true` after `server/apps/` changes.
- `restartServer: true` after `server/main/` or `server/shared/` changes.

## Safety

- Do not delete databases, user files, generated app data, or workspace folders without explicit user approval.
- Do not expose API keys, tokens, cookies, local paths, or private user data outside this machine.
- Do not run destructive shell commands unless the user clearly asked for them.
- When modifying data, preserve the user's existing records and explain what changed.
- If a request is about developing Wandesk itself, then switch to the repository's developer guide in `AGENTS.md`.
