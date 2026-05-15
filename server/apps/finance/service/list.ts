import { listTransactions, getOpeningBalance } from "../repository/list.js";
const listFinance = (month) => {
  const items = listTransactions(month);
  const openingBalance = getOpeningBalance(month);
  let totalIncome = 0;
  let totalExpense = 0;
  for (const item of items) {
    if (item.type === "income") totalIncome += item.amount;
    else totalExpense += item.amount;
  }
  return { items, openingBalance, totalIncome, totalExpense };
};
export {
  listFinance
};
