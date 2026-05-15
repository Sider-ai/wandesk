# Wandesk 🖥️✨

**Wandesk is an AI desktop and local workbench for agent-native apps.**

It gives AI tools a familiar desktop surface: windows, apps, files, tasks, memory, settings, and coding workspaces all running from one local TypeScript project. Instead of treating AI as a chat box on the side, Wandesk treats AI as the operating layer for real work.

## What It Is

Wandesk is built around a simple idea:

> AI should feel like a workspace, not just a prompt box.

The project combines:

- 🧠 **AI workspace primitives**: chat, tasks, memory, model settings, and app prompts
- 🪟 **Desktop-style UI**: draggable app windows, launcher, wallpaper, global toast, and app panels
- 🛠️ **Agent workbenches**: Codex and Claude Code style apps for projects, sessions, skills, MCP, history, and settings
- 📁 **Local-first tools**: files, notebook, finance, GitHub trending, crypto bot, and other app modules
- 🌐 **Full-stack app boundary**: React frontend, TypeScript backend APIs, app registry, language assets, and SQLite storage
- 🧩 **App-native docs**: every app can carry `APP.md` context for AI-facing behavior

## Why Wandesk

Most AI products still live in a browser tab, a terminal, or a single chat thread. Wandesk explores a different shape: an AI desktop where apps are small, inspectable, local, and agent-aware.

The goal is not to recreate a traditional operating system. The goal is to make a practical workbench where AI can:

- open tools with clear boundaries
- read app-specific instructions
- keep useful local state
- work across files, tasks, notes, and code
- evolve new apps inside the same environment

Wandesk grew from the broader AI operating-system direction explored in [realuckyang/AIOS](https://github.com/realuckyang/AIOS), but this repository focuses on a friendly desktop/workbench experience.

## Tech Stack

- ⚛️ React 19
- 🟦 TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧱 Node.js backend APIs
- 🗄️ SQLite via `better-sqlite3`
- 🔌 WebSocket runtime channel

## Project Layout

```text
gui/              React desktop UI
server/main/      core HTTP / WS APIs and system services
server/apps/      app-specific backend modules
server/shared/    shared backend utilities
apps/             app-facing APP.md context files
language/         locale source for UI text and app docs
scripts/          development and language-baking scripts
skills/           bundled Codex skills
```

Runtime output is intentionally kept out of git:

```text
.aios/
database/
files/
gui/dist/
node_modules/
```

## Apps

Current app surface includes:

- 💬 Chat
- ✅ Tasks
- 📓 Notebook
- 📁 Files
- 🧠 Memory
- ⚙️ Settings
- 🤖 Codex
- 🧑‍💻 Claude Code
- 📈 Finance
- 📰 GitHub Trending
- ₿ Crypto Bot

## Development

Install dependencies:

```bash
npm install
```

Start the English development workspace:

```bash
npm run dev
```

Start the Chinese development workspace:

```bash
npm run dev:zh
```

Build frontend assets:

```bash
npm run build
npm run build:zh
```

Run TypeScript checks:

```bash
npm run typecheck
```

## Language Baking

Wandesk uses language source files under `language/<locale>/` and bakes them into the runtime workspace before development or build commands.

The bake step is handled by:

```bash
tsx scripts/start.ts en --force
tsx scripts/start.ts zh --force
```

This writes runtime state under `.aios/` and generates app-facing docs under `apps/`. For clean local testing, run from a copied runtime workspace instead of committing generated state.

## Repository Rules

- Keep source code in `gui/`, `server/`, `language/`, `scripts/`, `apps/`, and `skills/`
- Do not commit runtime data, databases, uploaded files, build output, or local model config
- Treat `database/`, `files/`, `.aios/`, `gui/dist/`, and `node_modules/` as generated
- Keep secrets out of the repository

## Status

Wandesk is an early open-source AI desktop/workbench project. The architecture is intentionally small and hackable so apps, agents, and workflows can be changed quickly.

Contributions, experiments, and new app ideas are welcome. 🚀

## License

ISC
