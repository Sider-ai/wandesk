import { stopBot } from "../runtime/index.js";
const stop = () => {
  stopBot();
  return { success: true };
};
export {
  stop
};
