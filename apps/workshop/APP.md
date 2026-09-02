# 应用工坊(workshop)

说一句话,造一个应用。它把需求交给 agent,agent 在 `apps/<id>/` 写下 app.json、server.js、public/index.html 和 APP.md,桌面立刻长出图标。

## 能做什么

- 造新应用:描述功能,流式看它在写什么。
- 改现有应用:告诉它改哪个,它直接改那个目录。
- 造出来的应用没有构建步骤,前端是单文件,谁都能打开就改。

## 目录与修改

- `server.js` 里的 BRIEF 是给 agent 的造应用规则,改它就改了工坊的产出风格。
- `public/index.html` 单文件前端。
