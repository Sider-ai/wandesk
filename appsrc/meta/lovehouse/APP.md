# 恋爱屋 (lovehouse)

一个虚拟恋爱陪伴应用。**带真实长期记忆的有状态对话**的参考单元,完全建立在通用的
`db` + `agent` 能力之上——没有 per-app 后端,不改平台。

## 数据(`database/wandesk.db`,表一律 `app_lovehouse_*` 前缀)

- `app_lovehouse_messages(role, content, created_at)` — 完整对话,唯一真相:渲染气泡、每轮重建上下文都从这里来,重启不丢。
- `app_lovehouse_memories(content, created_at)` — 精选的长期记忆(高信号、去重、封顶)。
- `app_lovehouse_state(key, value)` — 好感度等内部状态。
- `app_lovehouse_moments(...)` — 她发的动态(说说),含点赞/评论。

## 一轮如何发生(`ui/src/apps/lovehouse/index.tsx`)

1. 把用户消息写进 `app_lovehouse_messages`(via `db`)。
2. 读最近消息 + 全部记忆(via `db`),拼提示词:`【你记得的事】… 【最近对话】… 【对方刚说】…`。
3. 调 `agent(appId, prompt, { system: PERSONA })`——人设是应用自己的,走 system;不用 resume,
   后端 `app_lovehouse_messages` 表始终是唯一真相。
4. 从回复里解析 `<mem>…</mem>` → 与已有记忆去重 → 存(封顶 30)。
5. 把回复写回 `app_lovehouse_messages`。

## 结构

状态/人设/格式在 `lib/`,数据层在 `db.ts`,视图在 `components/`(Portrait / ChatPane /
MomentsPane),`index.tsx` 只做组装。

## 备注

- 人设(PERSONA)在前端,作为 `system` 传入。想连 JS 包也藏起来,以后可移到服务端文件。
- 清空聊天+记忆:删掉 `app_lovehouse_*` 这几张表即可。
