# Wandesk desktop shell (Tauri)

A thin [Tauri v2](https://tauri.app) wrapper that runs Wandesk as a native
desktop app: tray icon, single-instance lock, window lifecycle, and a sidecar
process manager that boots the two Node services and points the app window at
the local server once it is healthy.

This is **optional**. Wandesk is a plain Node app — you can ignore this folder
entirely and run it in a browser (`npm run dev`) or deploy it to a server. The
shell just packages that same app for the desktop.

## Requirements

- **Node >= 22.5** on your PATH (this open-source build uses your system Node;
  it does not bundle a private runtime).
- A **Rust toolchain** (`rustup`) and the
  [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your OS.

## Run / build

From the repository root:

```bash
npm install            # once, installs @tauri-apps/cli too
npm run tauri:dev      # develop: launches the desktop app (debug)
npm run tauri:build    # produce an unsigned .app / .dmg (or your OS equivalent)
```

Both commands first assemble `tauri/resources/aios` — a copy of the source tree
plus `node_modules`. On first launch the shell copies that into your per-user
data directory, bakes i18n for your system language, builds the frontend and
compiles the server there, then starts the services. Your repo checkout stays
untouched (i18n tokens intact).

## What this build intentionally leaves out

Code signing, notarization, auto-update, and a bundled Node/Git runtime are
**distribution concerns** and live in the maintainer's packaging pipeline, not
here. The `dau` Cargo feature (anonymous daily-active ping) is **off** by
default and ships no analytics module in this repo. The result of
`npm run tauri:build` is a working but **unsigned** app meant for local use,
self-distribution, or as a starting point for your own packaging.

## Layout

```
tauri/
  src/            Rust: shell setup (lib.rs), tray/windows (shell/),
                  sidecar process manager + workspace prep (workspace/)
  ui/             static shell assets (splash that redirects to the local
                  server, About window)
  capabilities/   Tauri permission set
  icons/          app icons
  tauri.conf.json Tauri config
```
