---
name: Hermes
description: 操作本机 Hermes Agent，包括状态、会话、对话、控制台和定时例程。
---

# Hermes

Hermes 将 Wandesk 连接到本机 `hermes` CLI。它用于管理长期运行的本机智能体：会话、记忆、消息网关、定时例程和本地控制台。

## API

- `GET /apps/hermes/status`
- `GET /apps/hermes/sessions?limit=20`
- `GET /apps/hermes/messages?sessionId=<id>`
- `GET /apps/hermes/routines`
- `POST /apps/hermes/chat`
- `POST /apps/hermes/dashboard/start`

应用使用本机 Hermes 配置，不向前端暴露密钥或 dashboard session token。
