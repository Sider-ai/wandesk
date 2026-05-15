# Wandesk

[English](README.md) | [中文](README.zh-CN.md)

**Wandesk 是一个开源 AI 桌面和本地工作台。**

它的核心想法很简单：AI 不应该只存在于聊天框里。人依然需要应用、窗口、文件、记忆、表格、笔记本和工作空间。Wandesk 把这些形态放到一起，让 AI 可以聊天、使用应用、开发应用，也让应用可以反过来和 AI 协作。

## 截图

### Chat

![Wandesk Chat](docs/images/wandesk-chat.png)

Chat 是桌面里的意图入口。它可以读取本地上下文、检查工作区、调用工具，并和系统里的其他能力协同。

### App Workshop

![Wandesk App Workshop](docs/images/wandesk-app-workshop.png)

App Workshop 可以把一个应用想法变成具体的构建请求。选择模板、描述工作流，然后让 AI 开始创建本地应用。

### Notebook

![Wandesk Notebook](docs/images/wandesk-notebook.png)

Notebook 把轻量笔记留在一个可见的应用里，而不是埋在聊天记录中。笔记也可以成为后续 AI 工作的上下文。

### Memory

![Wandesk Memory](docs/images/wandesk-memory.png)

Memory 用来存储 AI 可复用的长期上下文。系统内置记忆可以告诉 AI Wandesk 应用应该怎么开发，用户也可以加入自己的偏好、事实和规则。

### Claude Code Workbench

![Wandesk Claude Code](docs/images/wandesk-claude-code.png)

Claude Code 被放进一个桌面应用里，包含 chat、projects、memory files、plans、history、skills、plugins、agents、MCP、stats、settings 和 account 等视图。

### Ledger

![Wandesk Ledger](docs/images/wandesk-ledger.png)

Ledger 是一个本地优先的财务应用。它展示了 Wandesk 可以承载普通 GUI 工具和独立数据模型，而不只是 AI 聊天页面。

### Open Source Radar

![Wandesk Open Source Radar](docs/images/wandesk-open-source-radar.png)

Open Source Radar 用来追踪 GitHub 趋势项目，也可以让 AI 对仓库做摘要和分析。

## Wandesk 能做什么

- 💬 **和 AI 聊天**，同时保留本地工作区上下文。
- 🪟 **运行真实应用**，用桌面式窗口、启动器和任务栏组织工作。
- 🧠 **保存记忆**，让 AI 记住稳定事实、偏好和系统指导。
- 🪄 **创建新应用**，让 AI 编写 React UI、TypeScript 后端 API、SQLite 存储和 `APP.md` 文档。
- 🔁 **让应用调用 AI**，通过任务 API 做摘要、分析、改写、编码和更长的 agent 工作。
- 🛠️ **使用 agent 工作台**，把 Claude Code、Codex 等能力放进同一个桌面。

## 为什么仍然需要应用

对话很有用，但它不应该替代所有界面。

笔记应该像笔记本。财务记录应该能在表格里编辑。代码 agent 需要项目、历史、设置、记忆文件和日志。Wandesk 把聊天和 GUI 看成互补关系：聊天表达意图，应用承载工作流，AI 在这些应用之间移动。

## 应用开发

Wandesk 应用是本地的、可检查的、可继续修改的。一个新应用通常会涉及：

```text
gui/src/apps/<app>/          React UI
server/apps/<app>/           API、service、repository
language/<lang>/apps/<app>/  APP.md 源文档
apps/<app>/APP.md            烘培后的运行态应用上下文
database/apps/<app>.db       运行时 SQLite 数据
```

目标不是一次性的生成页面，而是一个真正的本地应用，可以在后续 AI 会话中继续演化。

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Node.js 后端 API
- SQLite，通过 `better-sqlite3`
- WebSocket 运行时通道

## 项目结构

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

## 开发

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

## 语言烘培

Wandesk 使用 `language/<locale>/` 下的源文件，并在运行工作区里执行烘培：

```bash
tsx scripts/start.ts en --force
tsx scripts/start.ts zh --force
```

这个过程会生成 `apps/` 下的运行态应用文档，并把语言状态写入 `.aios/`。

## 相关

- [realuckyang/AIOS](https://github.com/realuckyang/AIOS)：探索 AI 时代的操作系统。

## License

ISC
