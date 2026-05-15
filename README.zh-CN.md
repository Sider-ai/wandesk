# Wandesk 🖥️✨

[English](README.md) | [中文](README.zh-CN.md)

**Wandesk 是一个面向 AI 原生应用的桌面与本地工作台。**

它给 AI 工具一个更熟悉的桌面空间：窗口、应用、文件、任务、记忆、设置、代码工作区，都运行在同一个本地 TypeScript 项目里。Wandesk 不把 AI 只当成旁边的聊天框，而是把它看作真实工作的操作层。

## 它是什么

Wandesk 建立在一个很简单的想法上：

> AI 应该像一个工作空间，而不只是一个提示词输入框。

这个项目组合了：

- 🧠 **AI 工作空间基础能力**：聊天、任务、记忆、模型设置和应用提示词
- 🪟 **桌面式界面**：可拖拽应用窗口、启动器、壁纸、全局提示和应用面板
- 🛠️ **Agent 工作台**：Codex 和 Claude Code 风格的项目、会话、技能、MCP、历史记录和设置界面
- 📁 **本地优先工具**：文件、笔记本、财务、GitHub Trending、Crypto Bot 等应用模块
- 🌐 **完整全栈边界**：React 前端、TypeScript 后端 API、应用注册表、语言资源和 SQLite 存储
- 🧩 **应用原生文档**：每个应用都可以携带面向 AI 的 `APP.md` 上下文

## 为什么做 Wandesk

很多 AI 产品仍然停留在浏览器标签页、终端或单个聊天线程里。Wandesk 探索的是另一种形态：一个 AI 桌面，其中应用是小的、可读的、本地的，并且天然理解 agent 工作流。

它不是要重新发明传统操作系统。它更像一个实用的工作台，让 AI 可以：

- 打开边界清晰的工具
- 读取应用自己的说明
- 保留有用的本地状态
- 在文件、任务、笔记和代码之间协作
- 在同一个环境里继续演化新应用

Wandesk 的思想源头之一来自 [realuckyang/AIOS](https://github.com/realuckyang/AIOS) 所探索的 AI 操作系统方向；这个仓库更聚焦于友好的桌面与工作台体验。

## 技术栈

- ⚛️ React 19
- 🟦 TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧱 Node.js 后端 API
- 🗄️ SQLite，通过 `better-sqlite3`
- 🔌 WebSocket 运行时通道

## 项目结构

```text
gui/              React 桌面 UI
server/main/      核心 HTTP / WS API 和系统服务
server/apps/      应用级后端模块
server/shared/    后端共享工具
apps/             面向应用的 APP.md 上下文文件
language/         UI 文本和应用文档的多语言源文件
scripts/          开发与语言烘焙脚本
skills/           内置 Codex skills
```

运行时输出不会进入 git：

```text
.aios/
database/
files/
gui/dist/
node_modules/
```

## 应用

当前应用表面包括：

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

## 开发

安装依赖：

```bash
npm install
```

启动英文开发工作区：

```bash
npm run dev
```

启动中文开发工作区：

```bash
npm run dev:zh
```

构建前端资源：

```bash
npm run build
npm run build:zh
```

运行 TypeScript 检查：

```bash
npm run typecheck
```

## 语言烘焙

Wandesk 使用 `language/<locale>/` 下的语言源文件，并在开发或构建前把它们烘焙到运行工作区。

烘焙入口是：

```bash
tsx scripts/start.ts en --force
tsx scripts/start.ts zh --force
```

这个步骤会把运行状态写入 `.aios/`，并生成应用侧文档到 `apps/`。如果要做干净的本地测试，建议在复制出来的运行工作区里执行，不要提交生成态内容。

## 仓库规则

- 源码保留在 `gui/`、`server/`、`language/`、`scripts/`、`apps/` 和 `skills/`
- 不提交运行数据、数据库、上传文件、构建输出或本地模型配置
- `database/`、`files/`、`.aios/`、`gui/dist/` 和 `node_modules/` 都视为生成目录
- 不要把密钥提交进仓库

## 状态

Wandesk 仍是一个早期开源的 AI 桌面 / 工作台项目。架构刻意保持小而可改，方便快速调整应用、agent 和工作流。

欢迎贡献、实验和新的应用想法。🚀

## License

ISC
