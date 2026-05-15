---
name: createapp
description: 应用创建器，通过对话生成和修改应用代码。
backend: server/apps/createapp
frontend: gui/src/apps/createapp
database: database/apps/createapp.db
---

# createapp

- 定位：面向开发者的应用生成与改造工具。
- 前端：`gui/src/apps/createapp`
- 后端：`server/apps/createapp`
- 数据：`database/apps/createapp.db`
- 入口：`/apps/createapp/*`
- 约定：
  - 代码改动后优先走 `/api/runtime/reload/request`
  - 只做预检时走 `/api/runtime/reload/test`
