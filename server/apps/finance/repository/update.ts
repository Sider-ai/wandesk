import { db } from "./client.js";
const updateTransaction = (id, fields) => {
  const sets = [];
  const vals = [];
  for (const [k, v] of Object.entries(fields)) {
    if (["type", "amount", "note", "date"].includes(k) && v !== void 0) {
      sets.push(`${k} = ?`);
      vals.push(v);
    }
  }
  if (!sets.length) return;
  vals.push(id);
  db.prepare(`UPDATE finance_transactions SET ${sets.join(", ")} WHERE id = ?`).run(...vals);
};
export {
  updateTransaction
};
