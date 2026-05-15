# Wandesk 🖥️✨

[English](README.md) | [中文](README.zh-CN.md)

**Wandesk is an AI desktop where AI does more than chat: it can build new apps, and those apps can talk back to AI.**

Most AI products and open-source projects still use conversation as the primary interaction model. Wandesk explores a different shape: a local desktop/workbench where chat, apps, files, memory, tasks, and coding agents live in one place.

The important part is not the window chrome. The important part is the loop:

> You describe what you need → AI helps create or modify an app → the app becomes part of your desktop → the app can call AI again when it needs reasoning, writing, analysis, or automation.

## Why Not Just Chat?

Chat is powerful, but many real workflows still need a visible interface.

A note should stay in a notebook. A task should stay on a board. A file should be browsable. A finance record should be editable in a table. A coding session should have history, settings, project context, and logs.

Wandesk treats conversation and interface as partners:

- 💬 **Chat is where intent begins**
- 🪟 **Apps are where workflows live**
- 🛠️ **AI can build or change those apps**
- 🤖 **Apps can ask AI to do work through the task system**
- 📁 **Files, data, prompts, and app docs stay inspectable locally**

The result is not "one chat box for everything." It is a workspace where AI can create tools, use tools, and be called by tools.

## The Core Loop

```text
User idea
  ↓
Chat / App Workshop
  ↓
AI edits frontend + backend + app docs
  ↓
Wandesk reloads the desktop app surface
  ↓
The new app can store data, expose APIs, and call AI tasks
```

That is the difference between a prompt and a workbench. A prompt disappears into history; an app stays on your desktop and keeps working for you.

## AI Creates Apps

In Wandesk, creating an app should feel closer to describing a need than starting a software project.

You can open Chat or App Workshop and say what you want:

```text
Create a lightweight CRM for tracking customers, follow-ups, next actions, and deal status.
```

The AI workflow can then work on the app as code:

- 🪟 create the React UI under `gui/src/apps/<app>/`
- 🧱 add backend APIs, services, and repositories under `server/apps/<app>/`
- 🗄️ define local SQLite storage for app data
- 🧩 write `APP.md` so the app is understandable to future AI sessions
- 🔁 request a runtime reload so the new app appears in the desktop

The important part is that the result is not a throwaway generated page. It is meant to become a real Wandesk app: inspectable, editable, local, and able to keep evolving through later conversations.

## Apps Can Talk To AI

In a traditional app, the logic is fixed: click a button, run a function, update the UI.

In Wandesk, an app can send intent to the system task layer and let AI handle the flexible part. For example:

- A notebook app can ask AI to rewrite, summarize, or expand a note.
- A finance app can ask AI to categorize records or explain spending.
- A GitHub Trending app can ask AI to analyze a repository.
- A custom business app can ask AI to generate reports, compare options, or fill structured fields.

The task API gives apps two basic modes:

```text
POST /api/task/create/instant   short synchronous AI work
POST /api/task/create/agent     longer agent work with tool use
```

Apps can also use shared helpers such as `server/shared/apps/instantTask.ts` and `server/shared/apps/agentTask.ts` so AI becomes a native capability of the app, not a bolted-on chat widget.

## AI Can Understand Apps

Every app can carry an `APP.md` file that explains what the app is, where its frontend/backend/database live, and how it should be used.

That gives AI a direct contract:

```text
apps/<app>/APP.md          app-facing context
server/apps/<app>/APP.md   backend app context
gui/src/apps/<app>/        React UI
server/apps/<app>/         API, service, repository
database/apps/<app>.db     app data at runtime
```

Instead of blindly clicking around the UI, AI can read the app contract, call APIs, inspect source, and make targeted changes.

## What Is Inside

- 🧠 **AI workspace primitives**: chat, tasks, memory, model settings, and app prompts
- 🪄 **App Workshop**: a place to describe new tools and send the request into the AI workflow
- 🪟 **Desktop-style UI**: windows, launcher, wallpaper, app panel, and global toast
- 🛠️ **Agent workbenches**: Codex and Claude Code style apps for projects, sessions, skills, MCP, history, and settings
- 📁 **Local-first tools**: files, notebook, finance, GitHub Trending, Crypto Bot, and more
- 🌐 **Full-stack app boundary**: React frontend, TypeScript backend APIs, app registry, language assets, and SQLite storage
- 🧩 **App-native docs**: `APP.md` files make apps legible to AI

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

## Built-In Apps

Current app surface includes:

- 💬 Chat
- 🪄 App Workshop
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

Wandesk is an early open-source AI desktop/workbench project. The app creation loop, task layer, and agent workbenches are intentionally kept small and hackable so the system can evolve quickly.

Contributions, experiments, and new app ideas are welcome. 🚀

## Related

- [realuckyang/AIOS](https://github.com/realuckyang/AIOS): exploring an operating system for the AI era.

## License

ISC
