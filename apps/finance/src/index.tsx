import { useEffect, useMemo, useRef, useState } from 'react';
import { db } from './wandesk/db';
import './style.css';

// Ledger — a skeuomorphic red leather passbook (ported from AIOS, rebuilt for the Wandesk architecture).
// Leather spine + gold-stamped title, metal binding, cream ledger pages + dot-matrix font;
// browse by month, double-click a row to edit, one entry row at the bottom.
// Purely local: a single app_finance_transactions table, no AI.

const APP = 'finance';
type Row = { id: number; type: 'income' | 'expense'; amount: number; note: string; date: string };
type Edit = { id: number; field: 'date' | 'note' | 'amount'; value: string } | null;

const pad = (n: number) => String(n).padStart(2, '0');
const monthKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const fmtAmt = (n: number) =>
  (Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (s: string) => (s ? `${s.slice(5, 7)}-${s.slice(8, 10)}` : '');

// First open (table is empty): seed a few sample entries in the current month, as a quick demo
const seedRows = (month: string): [Row['type'], number, string, string][] => [
  ['income', 880000, 'Sold a meteorite that had been in the family for generations — turns out it was from Mars', `${month}-03T09:15:00`],
  ['income', 5200, 'Designed a matching outfit for the neighborhood dance troupe, orders went through the roof', `${month}-08T11:00:00`],
  ['income', 1500, 'Taught the barista downstairs latte art, he pays by the cup', `${month}-14T08:30:00`],
  ['expense', 140000, 'Impulse-bought a retired racehorse, said I would jog with it', `${month}-20T14:30:00`],
  ['expense', 299, 'Bought myself a copy of "How to Stop Overspending"', `${month}-26T15:30:00`],
];

export default function Finance({ appId }: { appId: string }) {
  void appId; // Data always goes through this app's own table
  const [month, setMonth] = useState(() => monthKey(new Date()));
  const [rows, setRows] = useState<Row[]>([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState<Edit>(null);
  const [form, setForm] = useState({ date: '', note: '', withdraw: '', deposit: '' });
  const seeded = useRef(false);

  const thisMonth = monthKey(new Date());
  const isCurrent = month === thisMonth;
  const todayStr = useMemo(() => { const d = new Date(); return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }, []);
  const balance = income - expense;
  const displayMonth = month.replace('-', ' / ');

  async function load(m: string) {
    const r = await db(APP, 'SELECT id, type, amount, note, date FROM app_finance_transactions WHERE substr(date,1,7)=? ORDER BY date ASC, id ASC', [m]);
    setRows((r.rows as Row[]) || []);
    const t = await db(APP, "SELECT type, COALESCE(SUM(amount),0) s FROM app_finance_transactions WHERE substr(date,1,7)=? GROUP BY type", [m]);
    let inc = 0, exp = 0;
    for (const row of (t.rows as { type: string; s: number }[]) || []) {
      if (row.type === 'income') inc = row.s; else if (row.type === 'expense') exp = row.s;
    }
    setIncome(inc); setExpense(exp);
  }

  useEffect(() => {
    (async () => {
      if (!seeded.current) {
        seeded.current = true;
        const c = await db(APP, 'SELECT COUNT(*) n FROM app_finance_transactions');
        if (((c.rows?.[0] as { n: number })?.n ?? 0) === 0) {
          for (const [type, amount, note, date] of seedRows(thisMonth)) {
            await db(APP, 'INSERT INTO app_finance_transactions (type, amount, note, date) VALUES (?, ?, ?, ?)', [type, amount, note, date]);
          }
        }
      }
      await load(month);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  function shiftMonth(delta: number) {
    if (delta > 0 && isCurrent) return;
    const [y, m] = month.split('-').map(Number);
    setMonth(monthKey(new Date(y, m - 1 + delta, 1)));
  }

  async function addRow() {
    const withdraw = parseFloat(form.withdraw) || 0;
    const deposit = parseFloat(form.deposit) || 0;
    if ((!withdraw && !deposit) || saving) return;
    setSaving(true);
    try {
      const type: Row['type'] = deposit > 0 ? 'income' : 'expense';
      const amount = deposit > 0 ? deposit : withdraw;
      const dayIn = form.date.trim() || todayStr;
      const day = (dayIn.includes('-') ? dayIn.split('-').pop()! : dayIn).padStart(2, '0');
      await db(APP, 'INSERT INTO app_finance_transactions (type, amount, note, date) VALUES (?, ?, ?, ?)', [type, amount, form.note.trim(), `${month}-${day}T12:00:00`]);
      setForm({ date: '', note: '', withdraw: '', deposit: '' });
      await load(month);
    } finally { setSaving(false); }
  }

  function beginEdit(row: Row, field: 'date' | 'note' | 'amount') {
    const value = field === 'date' ? fmtDate(row.date) : field === 'amount' ? String(row.amount) : row.note;
    setEdit({ id: row.id, field, value });
  }

  async function commitEdit() {
    if (!edit) return;
    const row = rows.find((r) => r.id === edit.id);
    const cur = edit;
    setEdit(null);
    if (!row) return;
    if (cur.field === 'date') {
      const day = (cur.value.includes('-') ? cur.value.split('-').pop()! : cur.value).padStart(2, '0');
      if (fmtDate(row.date).slice(-2) === day) return;
      await db(APP, 'UPDATE app_finance_transactions SET date=? WHERE id=?', [`${month}-${day}T12:00:00`, cur.id]);
    } else if (cur.field === 'amount') {
      const amt = parseFloat(cur.value);
      if (!amt || amt <= 0 || amt === row.amount) return;
      await db(APP, 'UPDATE app_finance_transactions SET amount=? WHERE id=?', [amt, cur.id]);
    } else {
      if (cur.value === row.note) return;
      await db(APP, 'UPDATE app_finance_transactions SET note=? WHERE id=?', [cur.value, cur.id]);
    }
    await load(month);
  }

  async function remove(id: number) {
    await db(APP, 'DELETE FROM app_finance_transactions WHERE id=?', [id]);
    await load(month);
  }

  const editKeys = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) commitEdit();
    else if (e.key === 'Escape') setEdit(null);
  };
  const editCell = (row: Row, field: NonNullable<Edit>['field'], cls: string) =>
    edit && edit.id === row.id && edit.field === field ? (
      <input
        className={`fin-inl ${cls}`}
        autoFocus
        value={edit.value}
        onChange={(e) => setEdit({ ...edit, value: e.target.value })}
        onBlur={commitEdit}
        onKeyDown={editKeys}
      />
    ) : null;

  return (
    <div className="fin-root">
      <header className="fin-spine"><span className="fin-title">LEDGER</span></header>
      <div className="fin-binding" />

      <div className="fin-pages">
        <div className="fin-crease" aria-hidden />

        <div className="fin-head fin-dot">
          <div className="fin-monthnav">
            <button onClick={() => shiftMonth(-1)}>◄</button>
            <span className="fin-month">{displayMonth}</span>
            <button className={isCurrent ? 'off' : ''} disabled={isCurrent} onClick={() => shiftMonth(1)}>►</button>
          </div>
          <div className="fin-summary">
            <div className="fin-sumcol"><span className="fin-sumlbl">Income</span><span className="fin-inc">+ {fmtAmt(income)}</span></div>
            <div className="fin-sumcol div"><span className="fin-sumlbl">Expense</span><span className="fin-exp">- {fmtAmt(expense)}</span></div>
            <div className="fin-sumcol div"><span className="fin-sumlbl bold">Balance</span><span className="fin-bal">{fmtAmt(balance)}</span></div>
          </div>
        </div>

        <div className="fin-tablewrap">
          <table className="fin-table fin-dot">
            <thead>
              <tr>
                <th className="w-date">Date</th>
                <th>Note</th>
                <th className="w-amt">Withdrawn</th>
                <th className="w-amt">Deposited</th>
                <th className="w-op">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="fin-tr">
                  <td className="c" onDoubleClick={() => beginEdit(row, 'date')}>
                    {editCell(row, 'date', 'c') || <span>{fmtDate(row.date)}</span>}
                  </td>
                  <td className="c" onDoubleClick={() => beginEdit(row, 'note')}>
                    {editCell(row, 'note', 'c') || <span>{row.note || (row.type === 'income' ? 'Deposit' : 'Expense')}</span>}
                  </td>
                  <td className="r exp" onDoubleClick={() => row.type === 'expense' && beginEdit(row, 'amount')}>
                    {(row.type === 'expense' && editCell(row, 'amount', 'r exp')) || <span>{row.type === 'expense' ? '-' + fmtAmt(row.amount) : ''}</span>}
                  </td>
                  <td className="r inc" onDoubleClick={() => row.type === 'income' && beginEdit(row, 'amount')}>
                    {(row.type === 'income' && editCell(row, 'amount', 'r inc')) || <span>{row.type === 'income' ? '+' + fmtAmt(row.amount) : ''}</span>}
                  </td>
                  <td className="c">
                    <button className="fin-del" onClick={() => remove(row.id)}>Delete</button>
                  </td>
                </tr>
              ))}

              <tr className="fin-addrow">
                <td className="c"><input className="fin-inl c" value={form.date} placeholder={todayStr} onChange={(e) => setForm({ ...form, date: e.target.value })} /></td>
                <td className="c"><input className="fin-inl c" value={form.note} placeholder="Write something…" onChange={(e) => setForm({ ...form, note: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && addRow()} /></td>
                <td className="r"><input className="fin-inl r exp" value={form.withdraw} placeholder="0.00" onChange={(e) => setForm({ ...form, withdraw: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && addRow()} /></td>
                <td className="r"><input className="fin-inl r inc" value={form.deposit} placeholder="0.00" onChange={(e) => setForm({ ...form, deposit: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && addRow()} /></td>
                <td className="c"><button className="fin-add" disabled={saving || (!form.withdraw && !form.deposit)} onClick={addRow}>Add entry</button></td>
              </tr>

              {Array.from({ length: 6 }, (_, i) => (
                <tr key={'e' + i} className="fin-empty">{Array.from({ length: 5 }, (_, c) => <td key={c} />)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
