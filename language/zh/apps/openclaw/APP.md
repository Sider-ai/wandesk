---
name: openclaw
description: OpenClaw 本地控制台,连接 CLI、Gateway、智能体会话、模型和定时任务。
backend: server/apps/openclaw
---

# OpenClaw

OpenClaw 是本机 OpenClaw 的控制台。

- 检测本地 `openclaw` CLI 与 Gateway。
- 通过 `openclaw agent --json` 发送对话,并使用稳定的 Wandesk 会话键。
- 展示 Gateway、模型和最近会话状态。
- 列出可用 OpenClaw 模型,并可设置默认模型。
- 管理 OpenClaw 定时任务。

所有 OpenClaw 状态仍保存在用户的 OpenClaw 目录中。Wandesk 只读取状态并转发明确操作。
