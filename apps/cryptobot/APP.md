---
name: cryptobot
description: OKX automated trading app responsible for goal configuration, scheduled execution, decision logs, and the equity curve.
backend: server/apps/cryptobot
frontend: gui/src/apps/cryptobot
database: database/apps/cryptobot.db
---

# cryptobot

- Role: an autonomous trading app that triggers AI trading decisions on a schedule.
- Frontend: `gui/src/apps/cryptobot`
- Backend: `server/apps/cryptobot`
- Data: `database/apps/cryptobot.db`
- Entry points:
  - `/apps/cryptobot/status`
  - `/apps/cryptobot/exchange`
  - `/apps/cryptobot/goal`
  - `/apps/cryptobot/start`
  - `/apps/cryptobot/stop`
  - `/apps/cryptobot/equity`
  - `/apps/cryptobot/decisions`
