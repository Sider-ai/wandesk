import { updateTransaction } from "../repository/update.js";
const updateFinance = (body: any = {}) => {
  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, message: "Invalid id" };
  }
  const fields: Record<string, any> = {};
  if (body.type !== void 0) {
    if (!["income", "expense"].includes(body.type)) return { success: false, message: "Invalid type" };
    fields.type = body.type;
  }
  if (body.amount !== void 0) {
    const amt = Number(body.amount);
    if (!Number.isFinite(amt) || amt <= 0) return { success: false, message: "Invalid amount" };
    fields.amount = amt;
  }
  if (body.note !== void 0) fields.note = String(body.note);
  if (body.date !== void 0) fields.date = String(body.date);
  updateTransaction(id, fields);
  return { success: true };
};
export {
  updateFinance
};
