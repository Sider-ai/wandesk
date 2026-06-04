# Wandesk 接管文档

这份文档给正在帮助用户操作本机 Wandesk 的外部 agent 使用。

这是运行态接管文档，不是 `AGENTS.md`。`AGENTS.md` 是 Wandesk 开发与仓库协作规则，通常包含源码、烘焙、提交、同步等开发流程，终端用户并不需要关心。

## 先读这里

- 包含本文件的目录就是当前 Wandesk 工作区根目录。
- 当前工作区已经完成烘培。不要研究或修改 `language/`，也不要要求用户维护语言包。
- 需要操作某个应用时，先阅读 `apps/<app>/APP.md` 里的运行态应用说明。
- 优先通过 Wandesk API 操作，不要直接改数据库。只有在用户明确需要检查或修复数据时，才直接读取数据库。

## 运行态目录

- `apps/` 保存给 agent 阅读的应用说明文档。
- `files/` 保存用户文件和上传内容。
- `database/aios.db` 是系统主数据库。
- `database/apps/<app>.db` 保存各应用自己的数据。
- `gui/`、`server/`、`scripts/` 是运行态实现源码。除非用户明确要求开发 Wandesk 本身，否则不要修改系统级目录。

## 本地接口

使用 Wandesk 主服务，通常是：

```text
http://127.0.0.1:9602
```

如果系统开启了鉴权，并且当前环境提供了 API token，请这样发送：

```text
Authorization: Bearer $AIOS_API_TOKEN
```

常用入口：

- `GET /api/health` 检查 Wandesk 是否可访问。
- `GET /api/fs/roots` 获取当前工作区和文件根目录。
- `GET /api/fs/list?root=workspace&path=...` 列目录。
- `GET /api/fs/read?root=workspace&path=...` 读取文本文件。
- `POST /api/fs/write` 写入文本文件。
- `GET /apps/<app>/...` 和 `POST /apps/<app>/...` 通过主服务操作应用后端。

不要直接访问 apps 服务端口。应用接口统一走主服务的 `/apps/...`，这样才能遵守 Wandesk 的鉴权和代理规则。

## 操作应用

1. 先读 `apps/<app>/APP.md`。
2. 按需通过 HTTP 接口或数据库检查应用状态。
3. 用最小改动完成用户请求。
4. 如果修改了前端或后端源码，先通过 `POST /api/runtime/reload/request` 请求 Wandesk 重新加载，并带上合适的参数。不要直接调用 `/api/runtime/reload`，除非用户明确要求绕过确认弹窗。

常用 reload 参数：

- 修改前端后使用 `build: true`。
- 修改 `server/apps/` 后使用 `restartApps: true`。
- 修改 `server/main/` 或 `server/shared/` 后使用 `restartServer: true`。

## 安全规则

- 未经用户明确同意，不要删除数据库、用户文件、应用数据或工作区目录。
- 不要把 API key、token、cookie、本机路径或用户隐私数据泄露到这台机器之外。
- 不要执行破坏性 shell 命令，除非用户明确要求。
- 修改数据时保留用户已有记录，并说明你改了什么。
- 如果用户要求开发 Wandesk 本身，再切换阅读仓库开发指南 `AGENTS.md`。
