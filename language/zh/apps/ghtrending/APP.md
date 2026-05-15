---
name: ghtrending
description: GitHub 趋势发现应用，支持仓库分析和摘要生成。
backend: server/apps/ghtrending
frontend: gui/src/apps/ghtrending
database: database/apps/ghtrending.db
---

# ghtrending

- 定位：列出近期创建且增长较快的 GitHub 仓库，分析选中仓库，并保存分析历史。
- 前端：`gui/src/apps/ghtrending`
- 后端：`server/apps/ghtrending`
- 数据：`database/apps/ghtrending.db`
- 外部服务：GitHub Search API
- 入口：
  - `GET /apps/ghtrending/list`
  - `POST /apps/ghtrending/analyze`
  - `POST /apps/ghtrending/digest`
  - `POST /apps/ghtrending/check`
  - `GET /apps/ghtrending/history`
