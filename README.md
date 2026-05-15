# Wandesk

[English](README.md) | [中文](README.zh-CN.md)

**Wandesk is an open-source AI desktop and local workbench for agent-native apps.**

AI should not only live in chat. Wandesk gives AI a desktop: windows, apps, files, memory, notebooks, ledgers, coding workbenches, and app creation tools. Chat remains important, but apps carry the workflows.

## ✨ Highlights

- **AI desktop**: launcher, taskbar, windows, wallpaper, and local apps.
- **App creation**: describe an app idea and let AI turn it into a local full-stack app.
- **App-native AI**: apps can call AI for analysis, writing, summaries, code work, and longer agent tasks.
- **Long-term memory**: reusable system and user context is stored as editable memories.
- **Agent workbenches**: Claude Code and Codex-style spaces for projects, skills, MCP, history, settings, and account state.
- **Local-first runtime**: React + TypeScript + Node.js APIs + SQLite.

## 🚀 Install

Prerequisites: Git, Node.js 20+, and npm.

macOS:

```bash
curl -fsSL https://raw.githubusercontent.com/Sider-ai/wandesk/main/install-macos.sh | sh
```

Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/Sider-ai/wandesk/main/install-linux.sh | sh
```

Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/Sider-ai/wandesk/main/install-windows.ps1 | iex"
```

After installation, open:

```text
http://localhost:9502
```

## 🧠 Why Wandesk

Most AI tools start from conversation. Wandesk starts from work.

Real work needs visible shapes: notes stay in notebooks, finance records stay in tables, files stay browsable, and coding sessions need projects, history, memory files, and logs. Wandesk lets AI move through those places instead of flattening everything into one chat thread.

## 🪄 App Creation

Wandesk apps are local, inspectable, and editable. A new app usually touches:

```text
gui/src/apps/<app>/          React UI
server/apps/<app>/           API, service, repository
language/<lang>/apps/<app>/  APP.md source
apps/<app>/APP.md            baked runtime app context
database/apps/<app>.db       runtime SQLite data
```

The goal is a real local app that can keep evolving through future AI sessions, not a disposable generated page.

## 🖼️ Screenshots

### Chat

![Wandesk Chat](docs/images/wandesk-chat.png)

Chat is the intent layer of the desktop. It can use local context, inspect the workspace, call tools, and coordinate work with the rest of the system.

### App Workshop

![Wandesk App Workshop](docs/images/wandesk-app-workshop.png)

App Workshop turns an app idea into a concrete build request. Pick a template, describe the workflow, and let AI start creating the local app.

### Notebook

![Wandesk Notebook](docs/images/wandesk-notebook.png)

Notebook keeps lightweight notes in a visual app instead of burying them inside a conversation thread.

### Memory

![Wandesk Memory](docs/images/wandesk-memory.png)

Memory stores reusable long-term context for AI, including built-in guidance for how Wandesk apps are structured.

### Claude Code Workbench

![Wandesk Claude Code](docs/images/wandesk-claude-code.png)

Claude Code is presented as a desktop app with tabs for chat, projects, memory files, plans, history, skills, plugins, agents, MCP, stats, settings, and account state.

### Ledger

![Wandesk Ledger](docs/images/wandesk-ledger.png)

Ledger shows how Wandesk can host ordinary GUI tools with their own data model, not just AI chat views.

### Open Source Radar

![Wandesk Open Source Radar](docs/images/wandesk-open-source-radar.png)

Open Source Radar tracks trending GitHub projects and can ask AI to summarize or analyze selected repositories.

## 🧩 Built-In Apps

- Chat
- App Workshop
- Tasks
- Notebook
- Files
- Memory
- Settings
- Claude Code
- Codex
- Ledger
- Open Source Radar

## 🏗️ Architecture

```text
gui/              React desktop UI
server/main/      core HTTP / WS APIs and system services
server/apps/      app-specific backend modules
server/shared/    shared backend utilities
apps/             baked app-facing APP.md context files
language/         locale source for UI text, prompts, and app docs
scripts/          development and language-baking scripts
skills/           bundled Codex skills
```

Generated/runtime output is not source:

```text
.aios/
database/
files/
gui/dist/
node_modules/
```

## 🧱 Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Node.js backend APIs
- SQLite via `better-sqlite3`
- WebSocket runtime channel

## 🛠️ Development

```bash
npm install
npm run dev
npm run typecheck
```

Chinese development build:

```bash
npm run dev:zh
```

Build frontend assets:

```bash
npm run build
npm run build:zh
```

## 🌐 Language Baking

Wandesk uses source files under `language/<locale>/` and bakes them into the runtime workspace:

```bash
tsx scripts/start.ts en --force
tsx scripts/start.ts zh --force
```

This generates runtime app docs under `apps/` and writes locale state under `.aios/`.

## 🔗 Related

- [realuckyang/AIOS](https://github.com/realuckyang/AIOS): exploring an operating system for the AI era.

## 📄 License

ISC
