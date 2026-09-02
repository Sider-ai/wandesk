# Ledger (finance)

A skeuomorphic black leather passbook: leather spine + gold-stamped title, metal binding,
cream ledger pages + blue watermark pattern, dot-matrix printer font.
Browse by month (◄ ►, can't go past the current month), a single transactions table,
double-click a row inline to edit, one entry row at the bottom to record.
Purely local, no AI.

## Data

`app_finance_transactions`: one row per entry. `type` income/expense, `amount` the amount,
`note` a description, `date` stored as `YYYY-MM-DDT12:00:00` (grouped by month via
`substr(date,1,7)`). If the table is empty on first open, a few sample entries are seeded
as a quick demo of how it works.

## Interface

- Header: month navigation + summary box (this month's income / expense / balance).
- Ledger table: date / note / withdrawn / deposited / action. Expenses are recorded in the
  "Withdrawn" column (red), income in the "Deposited" column (green); double-click a cell to
  edit date/note/amount, fill in the bottom row and press Enter to add an entry, hover to reveal
  delete. Trailing blank rows keep the passbook look.

## Directory & making changes

- `app.json` manifest · `APP.md` this file · `server.js` backend (Worker, table-creation script
  is in here) · `public/` frontend build output · `src/` frontend source (React)
- **Editing the frontend**: edit `src/`, then run `npm install && npm run build` in this
  directory; the output lands back in `public/`, and a window refresh picks it up. Requires
  Node.js locally; not needed if you're not touching the frontend.
- **Editing the backend**: edit `server.js` directly; takes effect on the next request, no
  restart needed.
- **Data**: `data.db` is this app's SQLite database — query it directly with `sqlite3 data.db`;
  the table schema is in the SCHEMA constant at the top of `server.js`.
