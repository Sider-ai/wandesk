# wandesk

Wandesk 开源版本源码仓,也是**全线共享代码的上游基线**(client / cloud 都从这里同步)。AI desktop / local workbench:含前端、后端、应用、语言资源、skills。

- origin: `https://github.com/Sider-ai/wandesk.git`(同时推 Gitee `gitee.com/realuckyang/wandesk.git`)

> 跨仓协作约定见上一级目录的 `../CLAUDE.md`(Wandesk Workspace 协作指南)和 `../wandesk-dev/doc/three-repo-sync.md`(三仓同步)。

## 技术栈

- 后端:TypeScript + `tsx`,入口 `server/main/index.ts` / `server/apps/index.ts`。
- 前端:React 19 + React Router 7 + Vite + Tailwind 4。
- DB:**Node 内置 `node:sqlite`(`DatabaseSync`)**,要求 Node **>= 22.5**。不再用 better-sqlite3,无原生模块。
- i18n:源码写 `__T_<KEY>__` token,`scripts/start.ts <en|zh> --force` 烘焙时静态替换成对应语言文案(语言包在 `language/<lang>/`)。

## 应用

侧边栏 app(`gui/src/apps/index.ts` 注册前端,`server/apps/registry.ts` 注册后端):
chat / tasks / memory / files / notebook / finance(记账)/ ghtrending(开源雷达)/ createapp(应用工坊)/ claude-code / codex / **openclaw** / settings。

- 系统级 app(chat / tasks / settings / memory / files)在 `server/main/`,普通 app 在 `server/apps/<app>/`。
- claude-code / codex / openclaw 是**外部 CLI agent 集成**应用(检测 CLI + 转发 + 可视化),互为参考蓝本。

## 怎么跑(重要:别污染源码)

`npm run dev` 会**就地烘焙**——把源码里的 `__T_` token 替换成字面量,直接在仓库根跑会把 tracked 源码改脏。

维护时用上一级的 **`../wandesk-test/`** 干净运行(把仓库 rsync 到一次性副本里烤+跑,源码保持干净 token 态):

```bash
cd ../wandesk-test
node test.js r3                 # 首次:同步 + 装依赖 + 起 dev(英文)
node test.js r1                 # 日常:同步 + 起 dev
node test.js r2                 # 同步 + 清 db + 起 dev
AIOS_LANG=zh node test.js r1    # 烤中文
# 浏览器开 http://localhost:9502
```

裸命令(会弄脏源码,跑完记得 `git checkout .` 还原):

```bash
npm run dev / dev:zh           # 烘焙 + 并行起 main + apps + vite
npm run build / build:zh       # 烘焙 + vite build
npm run typecheck              # tsc --noEmit
npm run start / start:apps     # 单独起 main / apps
```

## 注意

- 这是**共享代码的基线**:核心改动(gui apps / server / prompt / i18n / 种子)先在这里改、验,再同步到 client(直拷)和 cloud(适配 basePath/LiteLLM,见同步文档)。
- 父目录里 `wandesk-client/`(Tauri 打包)、`wandesk-cloud/`(服务器/Docker 形态)是独立仓,职责不要混进本仓。
- `wandesk-test/` 是维护用的运行 harness,**不在本仓内**(在父目录),开源 clone 拿不到也不需要。
- `apps/` 是 baking 产物,不进 git(`.gitignore` 有 `/apps/`)。
