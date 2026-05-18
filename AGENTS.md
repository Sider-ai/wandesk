# wandesk

Wandesk 开源版本源码仓。AI desktop / local workbench；开源产品本体，含前端、后端、应用、语言资源、skills。

- origin: `https://github.com/Sider-ai/wandesk.git`

## 技术栈

- 后端：TypeScript + `tsx`，入口 `server/main/index.ts` / `server/apps/index.ts`。
- 前端：React 19 + React Router 7 + Vite + Tailwind 4。
- DB：`better-sqlite3`。
- 语言烘焙：`scripts/start.ts`（`en` / `zh`，加 `--force` 强烈烘焙）。

## 命令

```bash
npm run dev        # 英文烘焙后并行启动 main + apps + vite
npm run dev:zh     # 中文烘焙后启动
npm run build      # 英文烘焙 + vite build
npm run build:zh   # 中文烘焙 + vite build
npm run typecheck  # tsc --noEmit
npm run start      # 只起 main
npm run start:apps # 只起 apps
```

## 注意

- 桌面 `wandesk/` 父目录里另有 `wandesk-client/`、`wandesk-cloud/`、`wandesk-test/` 等独立仓，不要把它们的职责混进本仓。
- 客户端壳、Tauri 打包、安装包产物属于 `wandesk-client/`；服务器/Cloud 版本属于 `wandesk-cloud/`。
