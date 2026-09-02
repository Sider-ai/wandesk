# 极品飞车

Wandesk 原生 Three.js 街机赛车游戏。React 管理 HUD、菜单与窗口生命周期，TypeScript
游戏引擎管理渲染、物理、AI、音频和帧循环。

## 操作

- `W` / `↑`：油门
- `S` / `↓`：刹车、倒车
- `A` / `D`：转向
- `Space`：手刹漂移
- `Shift`：氮气
- `Esc`：暂停
- `R`：重新开始

## 目录与修改

- `app.json` 清单 · `APP.md` 本文件 · `server.js` 后端(Worker,建表脚本在里面)· `public/` 前端产物 · `src/` 前端源码(React)
- **改前端**:改 `src/`,然后在本目录 `npm install && npm run build`,产物落回 `public/`,窗口刷新即生效。需要本机装有 Node.js;不改就不需要。
- **改后端**:直接改 `server.js`,下一次请求即生效,不用重启。
- **数据**:`data.db` 是本应用的 SQLite,`sqlite3 data.db` 可直接查;表结构见 `server.js` 顶部的 SCHEMA。
