import { ensureDataDirs, FILES_DIR, IS_DESKTOP } from "../../../shared/paths.js";
const initSystemDirs = () => {
  ensureDataDirs();
};
export {
  FILES_DIR,
  IS_DESKTOP,
  initSystemDirs
};
