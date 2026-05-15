# Wandesk

[English](README.md) | [中文](README.zh-CN.md)

**Wandesk 是一个开源 AI 桌面和本地工作台，用来承载 agent-native 应用。**

AI 不应该只存在于聊天框里。Wandesk 给 AI 一个桌面：窗口、应用、文件、记忆、笔记本、账本、代码工作台和应用创建工具。聊天依然重要，但真正承载工作流的是应用。

## ✨ 亮点

- **AI 桌面**：启动器、任务栏、窗口、壁纸和本地应用。
- **应用创建**：描述一个应用想法，让 AI 把它变成一个本地全栈应用。
- **应用原生 AI**：应用可以调用 AI 做分析、写作、摘要、代码工作和更长的 agent 任务。
- **长期记忆**：系统和用户上下文以可编辑的 memory 形式保存。
- **Agent 工作台**：Claude Code 和 Codex 风格的项目、技能、MCP、历史、设置和账户视图。
- **本地优先运行时**：React + TypeScript + Node.js API + SQLite。

## 🚀 安装

前置要求：Git、Node.js 20+ 和 npm。

macOS：

```bash
curl -fsSL https://raw.githubusercontent.com/Sider-ai/wandesk/main/install-macos.sh | sh
```

Linux：

```bash
curl -fsSL https://raw.githubusercontent.com/Sider-ai/wandesk/main/install-linux.sh | sh
```

Windows PowerShell：

```powershell
powershell -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/Sider-ai/wandesk/main/install-windows.ps1 | iex"
```

安装后打开：

```text
http://localhost:9502
```

## 🧠 为什么需要 Wandesk

大多数 AI 工具从对话开始。Wandesk 从工作开始。

真实工作需要可见的形态：笔记留在笔记本里，财务记录留在表格里，文件可以浏览，代码会话需要项目、历史、记忆文件和日志。Wandesk 让 AI 在这些地方之间移动，而不是把一切压平成一个聊天线程。

## 🪄 应用创建

Wandesk 应用是本地的、可检查的、可继续修改的。一个新应用通常会涉及：

```text
gui/src/apps/<app>/          React UI
server/apps/<app>/           API、service、repository
language/<lang>/apps/<app>/  APP.md 源文档
apps/<app>/APP.md            烘培后的运行态应用上下文
database/apps/<app>.db       运行时 SQLite 数据
```

目标不是一次性的生成页面，而是一个可以在后续 AI 会话中继续演化的真实本地应用。

## 🖼️ 截图

### Chat

![Wandesk Chat](docs/images/wandesk-chat.png)

Chat 是桌面里的意图入口。它可以读取本地上下文、检查工作区、调用工具，并和系统里的其他能力协同。

### App Workshop

![Wandesk App Workshop](docs/images/wandesk-app-workshop.png)

App Workshop 可以把一个应用想法变成具体的构建请求。选择模板、描述工作流，然后让 AI 开始创建本地应用。

### Notebook

![Wandesk Notebook](docs/images/wandesk-notebook.png)

Notebook 把轻量笔记留在一个可见的应用里，而不是埋在聊天记录中。

### Memory

![Wandesk Memory](docs/images/wandesk-memory.png)

Memory 用来存储 AI 可复用的长期上下文，包括系统内置的 Wandesk 应用开发指导。

### Claude Code Workbench

![Wandesk Claude Code](docs/images/wandesk-claude-code.png)

Claude Code 被放进一个桌面应用里，包含 chat、projects、memory files、plans、history、skills、plugins、agents、MCP、stats、settings 和 account 等视图。

### Ledger

![Wandesk Ledger](docs/images/wandesk-ledger.png)

Ledger 展示了 Wandesk 可以承载普通 GUI 工具和独立数据模型，而不只是 AI 聊天页面。

### Open Source Radar

![Wandesk Open Source Radar](docs/images/wandesk-open-source-radar.png)

Open Source Radar 用来追踪 GitHub 趋势项目，也可以让 AI 对仓库做摘要和分析。

## 🧩 内置应用

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

## 🏗️ 架构

```text
gui/              React 桌面 UI
server/main/      核心 HTTP / WS API 和系统服务
server/apps/      应用级后端模块
server/shared/    后端共享工具
apps/             烘培后的 APP.md 应用上下文
language/         UI 文本、prompt 和应用文档的多语言源
scripts/          开发与语言烘培脚本
skills/           内置 Codex skills
```

生成态和运行态目录不是源码：

```text
.aios/
database/
files/
gui/dist/
node_modules/
```

## 🧱 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Node.js 后端 API
- SQLite，通过 `better-sqlite3`
- WebSocket 运行时通道

## 🛠️ 开发

```bash
npm install
npm run dev
npm run typecheck
```

中文开发环境：

```bash
npm run dev:zh
```

构建前端资源：

```bash
npm run build
npm run build:zh
```

## 🌐 语言烘培

Wandesk 使用 `language/<locale>/` 下的源文件，并在运行工作区里执行烘培：

```bash
tsx scripts/start.ts en --force
tsx scripts/start.ts zh --force
```

这个过程会生成 `apps/` 下的运行态应用文档，并把语言状态写入 `.aios/`。

## 🔗 相关

- [realuckyang/AIOS](https://github.com/realuckyang/AIOS)：探索 AI 时代的操作系统。

## 📄 License

ISC
