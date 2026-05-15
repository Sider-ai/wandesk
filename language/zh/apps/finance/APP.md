---
name: finance
description: 记账应用，记录收入、支出和备注。
backend: server/apps/finance
frontend: gui/src/apps/finance
database: database/apps/finance.db
---

# finance

- 定位：轻量记账应用。
- 前端：`gui/src/apps/finance`
- 后端：`server/apps/finance`
- 数据：`database/apps/finance.db`
- 入口：
  - `GET /apps/finance/list`
  - `POST /apps/finance/create`
  - `POST /apps/finance/delete`
