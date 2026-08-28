// 全局路径:一处定义,别处只引用。
//
//   <workspace>/                 用户的工作区(默认 ~/Documents/Wandesk)
//     apps/<id>/                 应用的家 —— 一个目录就是一个应用
//     .wandesk/kernel.db         内核自己的库(会话/消息/压缩/设置/记忆)
//
// 应用的库在 apps/<id>/data.db,和代码做邻居:`sqlite3 apps/notes/data.db` 一句话能查,
// 「AI 能管自己造的应用」才成立。
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 仓库根:开发态是源码目录,打包态是资源目录。 */
export const HOME = process.env.WANDESK_HOME || path.join(__dirname, "..");

/** 工作区根 —— 用户的地盘。应用、数据、文件都长在这里。 */
export const workspace = () => {
  const dir = process.env.WANDESK_WORKSPACE || path.join(os.homedir(), "Documents", "Wandesk");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

export const appsDir = () => {
  const dir = path.join(workspace(), "apps");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

export const kernelDir = () => {
  const dir = path.join(workspace(), ".wandesk");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

export const kernelDbFile = () => path.join(kernelDir(), "kernel.db");

/** 预装应用的出厂模板(随包发,首次启动落地到工作区)。 */
export const presetAppsDir = () => process.env.WANDESK_PRESETS || path.join(HOME, "apps");

/** 壳的前端产物(生产态由内核直接托管)。 */
export const uiDistDir = () => process.env.WANDESK_UI_DIST || path.join(HOME, "dist/ui");
