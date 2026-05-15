import { db } from "./client.js";
const createTransaction = ({ type, amount, note, date }) => {
  if (date) {
    db.prepare("INSERT INTO finance_transactions (type, amount, note, date) VALUES (?, ?, ?, ?)").run(type, amount, note, date);
  } else {
    db.prepare("INSERT INTO finance_transactions (type, amount, note) VALUES (?, ?, ?)").run(type, amount, note);
  }
};
export {
  createTransaction
};
