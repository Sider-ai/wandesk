---
name: files
description: 文件管理应用，用于浏览、读取、写入、上传、下载和删除工作区文件。
backend: server/main/api/fs.js
frontend: gui/src/apps/files
database: none
---

# files

- 定位：核心文件管理应用，直接挂载在主服务上。
- 前端：`gui/src/apps/files`
- 后端：`server/main/api/fs.js`
- 数据：只操作文件系统，主要是项目 `files/` 目录和允许访问的根目录。
- 根目录：`files`、`workspace`、`home`、显式 `absolute` 基准路径。
- 入口：
  - `GET /api/fs/roots`
  - `GET /api/fs/list`
  - `GET /api/fs/read`
  - `POST /api/fs/write`
  - `POST /api/fs/mkdir`
  - `POST /api/fs/delete`
  - `POST /api/fs/upload`
  - `GET /api/fs/download`
