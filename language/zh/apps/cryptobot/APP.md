---
name: cryptobot
description: OKX 自动交易应用，负责目标配置、周期执行、决策记录和权益曲线。
backend: server/apps/cryptobot
frontend: gui/src/apps/cryptobot
database: database/apps/cryptobot.db
---

# cryptobot

- 定位：自主交易应用，按周期触发 AI 做交易决策。
- 前端：`gui/src/apps/cryptobot`
- 后端：`server/apps/cryptobot`
- 数据：`database/apps/cryptobot.db`
- 入口：
  - `/apps/cryptobot/status`
  - `/apps/cryptobot/exchange`
  - `/apps/cryptobot/goal`
  - `/apps/cryptobot/start`
  - `/apps/cryptobot/stop`
  - `/apps/cryptobot/equity`
  - `/apps/cryptobot/decisions`
