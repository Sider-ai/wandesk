# Wandesk 🖥️✨

[English](README.md) | [中文](README.zh-CN.md)

**Wandesk 是一个 AI 桌面：AI 不只是聊天，它可以开发新的应用，而应用也可以反过来和 AI 对话。**

很多 AI 工具仍然像是挂在工作旁边的聊天框。Wandesk 想探索的是另一种形态：一个本地桌面 / 工作台，把聊天、应用、文件、记忆、任务和代码 agent 放在同一个空间里。

真正重要的不是窗口外观，而是这个循环：

> 你描述需求 → AI 帮你创建或修改应用 → 应用成为桌面的一部分 → 应用在需要推理、写作、分析或自动化时，又可以继续调用 AI。

## 为什么不只是聊天？

聊天很强，但很多真实工作仍然需要可见的界面。

笔记应该留在笔记本里。任务应该留在看板上。文件应该能被浏览。财务记录应该能在表格里编辑。代码会话应该有历史、设置、项目上下文和日志。

Wandesk 把对话和界面看成协作关系：

- 💬 **聊天是意图开始的地方**
- 🪟 **应用是工作流停留的地方**
- 🛠️ **AI 可以创建或修改这些应用**
- 🤖 **应用可以通过任务系统请求 AI 干活**
- 📁 **文件、数据、提示词和应用文档都保留在本地并可检查**

所以它不是“一个聊天框处理一切”。它是一个工作空间：AI 可以创建工具、使用工具，也可以被工具调用。

## 核心循环

```text
用户想法
  ↓
Chat / App Workshop
  ↓
AI 修改前端 + 后端 + 应用文档
  ↓
Wandesk 重新加载桌面应用表面
  ↓
新应用可以保存数据、暴露 API，并调用 AI 任务
```

这就是提示词和工作台的区别。提示词会沉进历史里；应用会留在桌面上，继续为你工作。

## 应用也可以和 AI 对话

传统应用里，逻辑通常是固定的：点击按钮，执行函数，更新界面。

在 Wandesk 里，应用可以把意图交给系统任务层，让 AI 处理更灵活的部分。例如：

- 笔记本应用可以请求 AI 改写、总结或扩写一条笔记。
- 财务应用可以请求 AI 分类账目或解释消费。
- GitHub Trending 应用可以请求 AI 分析一个仓库。
- 自定义业务应用可以请求 AI 生成报告、比较方案或填写结构化字段。

任务 API 提供两种基础模式：

```text
POST /api/task/create/instant   短的同步 AI 任务
POST /api/task/create/agent     可调用工具的长 agent 任务
```

应用也可以使用 `server/shared/apps/instantTask.ts` 和 `server/shared/apps/agentTask.ts` 这样的共享 helper。这样 AI 就不是外接的聊天插件，而是应用自己的原生能力。

## AI 可以读懂应用

每个应用都可以携带一个 `APP.md`，说明这个应用是什么、前端在哪里、后端在哪里、数据库在哪里、应该怎么被使用。

这给了 AI 一个直接契约：

```text
apps/<app>/APP.md          面向应用的上下文
server/apps/<app>/APP.md   后端应用上下文
gui/src/apps/<app>/        React UI
server/apps/<app>/         API、service、repository
database/apps/<app>.db     运行时应用数据
```

AI 不需要盲目模拟用户点击界面。它可以读取应用契约、调用 API、检查源码，并进行有针对性的修改。

## 里面有什么

- 🧠 **AI 工作空间基础能力**：聊天、任务、记忆、模型设置和应用提示词
- 🪄 **App Workshop**：描述新工具，把需求送入 AI 工作流
- 🪟 **桌面式界面**：窗口、启动器、壁纸、应用面板和全局提示
- 🛠️ **Agent 工作台**：Codex 和 Claude Code 风格的项目、会话、技能、MCP、历史记录和设置界面
- 📁 **本地优先工具**：文件、笔记本、财务、GitHub Trending、Crypto Bot 等应用模块
- 🌐 **完整全栈边界**：React 前端、TypeScript 后端 API、应用注册表、语言资源和 SQLite 存储
- 🧩 **应用原生文档**：`APP.md` 让应用对 AI 可读

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

## 内置应用

当前应用表面包括：

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

Wandesk 仍是一个早期开源的 AI 桌面 / 工作台项目。应用创建循环、任务层和 agent 工作台都刻意保持小而可改，方便系统快速演化。

欢迎贡献、实验和新的应用想法。🚀

## 相关

- [realuckyang/AIOS](https://github.com/realuckyang/AIOS)：一个相关的 AI 操作系统方向探索，包含应用生成、agent-native workflow 等思路。

## License

ISC
