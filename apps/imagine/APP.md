# 想象 (imagine)

创意发散画布(参考 Picker Local,在 Wandesk 里轻量重做)。一句话生成一版**自包含 HTML** 设计稿,
从任一版继续发散成一棵树,单击节点在**新窗口**打开大图。纯前端,无后端。

## 轻量取舍

- **纯前端**:用 `db(appId, sql)` 存树、`agent(appId, prompt)` 生成、`window.open(blob)` 看稿。
- **只做 HTML**:产物固定是内联 CSS/JS、无外链的单文件 HTML。
- **上下文靠文本传递**(不用 session/fork):发散时把父节点的完整 HTML 塞进 prompt,让 AI 在其上改。
  每次生成 = 一次独立 `agent()` 调用,天然不串味,也不碰共享引擎。
- 生成在应用打开时进行(前端 `agent()` 在途),关掉窗口中断的节点会停在 generating——先这样。

## 数据

`app_imagine_projects`(id/title/prompt)· `app_imagine_nodes`(id/project_id/parent_id/instruction/
title/html/status/error)。`status`:generating | done | error。tree 查询不取 html(按节点懒加载)。

## 画布(性能优化保真移植自 Picker)

视口裁剪(只渲染视口内 +700px 的节点)· 边裁剪 · 按缩放门控预览(k<0.3 不渲染 iframe)·
缩略图 iframe `sandbox=""` 不跑脚本 · memo 节点卡 · 子树折叠 · CSS transform 做 pan/zoom · 小地图。

## 目录与修改

- `app.json` 清单 · `APP.md` 本文件 · `server.js` 后端(Worker,建表脚本在里面)· `public/` 前端产物 · `src/` 前端源码(React)
- **改前端**:改 `src/`,然后在本目录 `npm install && npm run build`,产物落回 `public/`,窗口刷新即生效。需要本机装有 Node.js;不改就不需要。
- **改后端**:直接改 `server.js`,下一次请求即生效,不用重启。
- **数据**:`data.db` 是本应用的 SQLite,`sqlite3 data.db` 可直接查;表结构见 `server.js` 顶部的 SCHEMA。
