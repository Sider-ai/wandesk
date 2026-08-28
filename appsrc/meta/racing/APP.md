# 极品飞车

Wandesk 原生 Three.js 街机赛车游戏。React 管理 HUD、菜单与窗口生命周期，TypeScript
游戏引擎管理渲染、物理、AI、音频和帧循环。

## 结构

- `ui/src/apps/racing/index.tsx`：React 生命周期入口。
- `ui/src/apps/racing/components/`：HUD、标题、暂停、结算和加载界面。
- `ui/src/apps/racing/engine/runtime.ts`：中央生命周期、比赛状态和主循环编排。
- `ui/src/apps/racing/engine/track.ts`：赛道采样、路面与场景环境。
- `ui/src/apps/racing/engine/car-model.ts`：程序化超跑建模。
- `ui/src/apps/racing/engine/ai.ts`：AI 走线、速度控制和追赶机制。
- `ui/src/apps/racing/engine/physics.ts`：玩家车辆动力学、赛道约束和车辆碰撞解算。
- `ui/src/apps/racing/engine/camera.ts`：标题运镜、发车镜头和追尾相机。
- `ui/src/apps/racing/engine/audio.ts`：WebAudio 引擎、风噪、漂移与氮气声。
- `ui/src/apps/racing/engine/effects.ts`：烟雾、尾焰和胎痕对象池。
- `ui/src/apps/racing/engine/input.ts`：窗口内键盘输入与调试输入。
- `ui/src/apps/racing/lib/`：调校参数、类型与数学工具。
- `ui/src/apps/racing/style.css`：完全限定在 `.racing-root` 下的游戏样式。

Three.js 固定为本地 npm 依赖 `0.170.0`，游戏运行不依赖 CDN。

## 操作

- `W` / `↑`：油门
- `S` / `↓`：刹车、倒车
- `A` / `D`：转向
- `Space`：手刹漂移
- `Shift`：氮气
- `Esc`：暂停
- `R`：重新开始
