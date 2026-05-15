import { listDecisions as listDecisionsRepo } from "../repository/decisions.js";
const listDecisions = ({ limit = 50 } : any = {}) => {
  const items = listDecisionsRepo(limit);
  return { success: true, items };
};
export {
  listDecisions
};
