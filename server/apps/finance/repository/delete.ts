import { db } from "./client.js";
const deleteTransactionById = (id) => {
  db.prepare("DELETE FROM finance_transactions WHERE id = ?").run(id);
};
export {
  deleteTransactionById
};
