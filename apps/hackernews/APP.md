# Hacker News (hackernews)

HN 头条阅读器。用 Algolia HN API 一次取一页,切换热门(front_page)/最新(date 排序)/
Ask HN。纯联网、无数据库。

## 数据

无本地表。`proxy(appId, url)` 拉 `https://hn.algolia.com/api/v1/search…`,解析 body JSON 的 `hits`。

## 界面

顶部分段(热门/最新/Ask)+ 列表:序号、标题、分数、作者、评论数、来源域名。
点标题 `window.open` 原文;点评论 `window.open` 到 `news.ycombinator.com/item?id=…`。

## 目录与修改

- `app.json` 清单 · `APP.md` 本文件 · `server.js` 后端(Worker,建表脚本在里面)· `public/` 前端产物 · `src/` 前端源码(React)
- **改前端**:改 `src/`,然后在本目录 `npm install && npm run build`,产物落回 `public/`,窗口刷新即生效。需要本机装有 Node.js;不改就不需要。
- **改后端**:直接改 `server.js`,下一次请求即生效,不用重启。
- **数据**:`data.db` 是本应用的 SQLite,`sqlite3 data.db` 可直接查;表结构见 `server.js` 顶部的 SCHEMA。
