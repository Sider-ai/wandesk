---
name: openclaw
description: OpenClaw desk for the local CLI, Gateway, agent sessions, models, and scheduled work.
backend: server/apps/openclaw
---

# OpenClaw

OpenClaw is the local control desk for a running OpenClaw installation.

- Detects the local `openclaw` CLI and Gateway.
- Sends chat turns through `openclaw agent --json` with a stable Wandesk session key.
- Shows Gateway, model, and recent session state.
- Lists available OpenClaw models and can set the default model.
- Manages OpenClaw cron jobs.

All OpenClaw state remains in the user's OpenClaw home. Wandesk only reads status and forwards explicit actions.
