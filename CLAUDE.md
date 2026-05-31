# CLAUDE.md

本仓(`wandesk/`)是 Wandesk **开源版,也是全线共享代码的上游基线**。

如果你是来改代码的协作者(Claude Code / Codex 等):

1. 先读本目录的 **`AGENTS.md`** —— 技术栈、应用结构、怎么干净运行(用 `../wandesk-test/`,别就地烤脏源码)。
2. 跨仓改动前读上一级的 **`../CLAUDE.md`**(Wandesk Workspace 协作指南)和 **`../wandesk-dev/doc/three-repo-sync.md`**(三仓同步规则)。

核心约定:

- **这里是基线**。共享代码(`gui/` apps、`server/`、prompt、i18n、种子)先在本仓改、验,再同步到 `wandesk-client`(直拷)和 `wandesk-cloud`(适配 basePath / LiteLLM 托管)。不要在 client 先改共享代码再反向补 OSS(会漂移)。
- **i18n**:面向用户的字符串一律用 `__T_<KEY>__` token,翻译进 `language/{en,zh}/`;三仓 key 必须一致。
- **DB**:`node:sqlite`(`DatabaseSync`),Node >= 22.5,无原生模块。
- **干净运行**:`cd ../wandesk-test && node test.js r1`(中文 `AIOS_LANG=zh`)。直接 `npm run dev` 会把 `__T_` token 烤进源码、弄脏 git。
- **不要 commit**:`apps/`(baking 产物)、`database/`、`files/`、`node_modules/`、`gui/dist/`、任何密钥/token。
