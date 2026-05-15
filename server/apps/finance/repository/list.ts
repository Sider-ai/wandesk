import { db } from "./client.js";
const listTransactions = (month) => {
  const m = month || currentMonth();
  return db.prepare(
    "SELECT * FROM finance_transactions WHERE strftime('%Y-%m', date) = ? ORDER BY date ASC"
  ).all(m);
};
const getOpeningBalance = (month) => {
  const m = month || currentMonth();
  const row = db.prepare(
    "SELECT COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE -amount END), 0) AS bal FROM finance_transactions WHERE date < ? || '-01'"
  ).get(m);
  return row.bal;
};
const currentMonth = () => {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
export {
  getOpeningBalance,
  listTransactions
};
