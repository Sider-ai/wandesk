import { saveConfig } from "../repository/config.js";
const saveGoal = (body: any = {}) => {
  const goal = String(body.goal || "").trim();
  saveConfig({ goal });
  return { success: true };
};
export {
  saveGoal
};
