import { createTransaction } from "../repository/create.js";
const createFinance = (body: any = {}) => {
  const type = String(body.type || "").trim();
  const amount = Number(body.amount);
  const note = String(body.note || "");
  if (!["income", "expense"].includes(type)) {
    return { success: false, message: "type must be income or expense" };
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, message: "amount must be a number greater than 0" };
  }
  const date = body.date ? String(body.date) : void 0;
  createTransaction({ type, amount, note, date });
  return { success: true };
};
export {
  createFinance
};
