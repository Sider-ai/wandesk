import { createAppDb } from "../../../shared/apps/db/createAppDb.js";
const db = createAppDb("cryptobot.db");
const parseNum = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
export {
  db,
  nowIso,
  parseNum
};
