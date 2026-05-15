import { getTaskById } from "../../repository/task/records.js";
const getTaskDetail = ({ id }) => {
  return getTaskById(id);
};
export {
  getTaskDetail
};
