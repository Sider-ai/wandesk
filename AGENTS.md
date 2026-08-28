# Wandesk 仓库约定

给在本仓库工作的所有智能体与人。只写「会被违反的」,不写显然的。
应用相关的一切先读 **[APP.md](APP.md)** —— 那是唯一正典。

## 三个顶层目录 = 三个角色

```
shell/     壳    —— 只管画。桌面、窗口、任务栏、壁纸。不知道「笔记」是什么
kernel/    内核  —— 知道一切。ai agent + syscall + 应用注册表
runtime/   workerd —— 应用的用户态
apps/      应用  —— 不属于框架,是内容
```

前三个是框架,`apps/` 是内容。加一个应用**不该碰前三个目录里的任何文件**。

## 三条边界规则

1. **kernel 不认识应用** —— 不许出现 `if (appId === "notes")`。注册表是 `apps/` 目录本身,
   不是代码里的数组。这条一破,「AI 造应用」就退回成「改产品源码」。
2. **shell 不认识领域** —— 壳只知道「窗口里有个 iframe」。所有领域名词只存在于 `apps/` 里。
   壳里唯一的例外是 `SHELL_PANELS`(设置、个性化),**它们配置的是框架本身**——
   凡是「配置框架」的界面属于壳,凡是「做事」的一律是应用。这条线不含糊,别往壳里塞第三种东西。
3. **应用不认识彼此** —— 各揣各的 `data.db`。要「共享上下文」就调 `env.AI`,汇聚发生在内核。

## 内核

- `kernel/ai/` 与 `kernel/agent/` **与 AGENT 仓库双向同步**,改它必须两边同步,不在日常迭代范围。
  它们是纯 JS、零依赖,不要往里加 TypeScript、不要加 Wandesk 的概念。
- `kernel/syscall/` 一个文件一个 binding。加一个 binding = 加一个文件 + 在
  `api/app.ts` 的 `HANDLERS` 里加一行 + 在 `runtime/overseer.js` 的 `HostGate` 和垫片里各加一段。
  三处齐了才算加完,漏一处应用侧就是 `undefined is not a function`。
- `api/` 很薄:只解析请求、拼响应。业务在 `syscall/` 与 `data/`。
- `data/` 只装产品本体的运行时状态。**任何领域表都不该出现在 `schema.sql` 里** ——
  那是应用自己 `data.db` 的事。

## 数据落在哪

| | 位置 | 谁能碰 |
|---|---|---|
| 内核库 | `<workspace>/.wandesk/kernel.db` | 只有 kernel |
| 应用库 | `<workspace>/apps/<id>/data.db` | 该应用 + 用户 `sqlite3` 直接撬 |
| 用户文件 | `<workspace>/` | 用户 + `env.FS` + agent 的 bash |

## 通用

- `npm run typecheck` 两个工程都要过,是每次交付的守门。
- 行为冻结的重构与功能开发分开提交,不混。
- 注释中文,命名向周围代码看齐,一次改动小而聚焦。
- 改了 `runtime/overseer.js` 要重跑 `npm run build:overseer`,否则跑的还是旧产物。
