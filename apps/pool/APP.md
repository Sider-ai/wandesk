# 台球 (pool)

一张绿呢台球桌的 2D 物理游戏。纯前端 canvas,无数据库、无 AI。

## 玩法

所有球停稳后,从白球拖出杆线瞄准、拉得越远力越大,松手击球。彩球进袋得分;白球进袋算犯规,
自动摆回。全部彩球清台即胜。

## 实现

单文件 canvas + requestAnimationFrame。物理:每球位置/速度,每帧摩擦减速、库边反弹、
圆-圆等质量弹性碰撞、六个袋口吸球。响应容器尺寸自适应。

## 目录与修改

- `app.json` 清单 · `APP.md` 本文件 · `server.js` 后端(Worker,建表脚本在里面)· `public/` 前端产物 · `src/` 前端源码(React)
- **改前端**:改 `src/`,然后在本目录 `npm install && npm run build`,产物落回 `public/`,窗口刷新即生效。需要本机装有 Node.js;不改就不需要。
- **改后端**:直接改 `server.js`,下一次请求即生效,不用重启。
- **数据**:`data.db` 是本应用的 SQLite,`sqlite3 data.db` 可直接查;表结构见 `server.js` 顶部的 SCHEMA。
