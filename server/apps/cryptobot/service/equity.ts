import { listEquity as listEquityRepo } from "../repository/equity.js";
const listEquity = ({ limit = 300 } : any = {}) => {
  const points = listEquityRepo(limit);
  return { success: true, points };
};
export {
  listEquity
};
