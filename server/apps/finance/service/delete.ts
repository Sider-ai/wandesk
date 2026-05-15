import { deleteTransactionById } from "../repository/delete.js";
const deleteFinance = (body: any = {}) => {
  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, message: "Invalid id" };
  }
  deleteTransactionById(id);
  return { success: true };
};
export {
  deleteFinance
};
