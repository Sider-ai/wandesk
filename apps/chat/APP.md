# 助理(chat)

跟内核里的 agent 对话。它有 bash / read / write / edit,工作目录就是工作区根,能真的动手:改文件、造应用、跑命令。

## 能做什么

- 多会话,历史落在内核库里;每次调用都会看到桌面上已安装的应用清单和长期记忆。
- 它调用的是与所有应用共用的同一个 agent(`env.AI`),没有任何特权。

## 目录与修改

- `src/` 前端源码(React,来自 AGENT 仓库的 web/ui,与之同步)· `public/` 产物 · `server.js` 后端直接改。
- 改前端:本目录 `npm install && npm run build`。
