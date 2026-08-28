import { useEffect, useMemo, useRef, useState } from 'react';
import { db } from '../../system/lib/db';
import './style.css';

// 记账本 — 一本拟物红皮存折(移植自 AIOS,按 Wandesk 架构重做)。
// 皮革书脊 + 烫金书名、金属订线、米色账页 + 点阵字体;按月翻查,行内双击改,底部一行录入。
// 纯本地:一张 app_finance_transactions 表,无 AI。

const APP = 'finance';
type Row = { id: number; type: 'income' | 'expense'; amount: number; note: string; date: string };
type Edit = { id: number; field: 'date' | 'note' | 'amount'; value: string } | null;

const pad = (n: number) => String(n).padStart(2, '0');
const monthKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const fmtAmt = (n: number) =>
  (Number(n) || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (s: string) => (s ? `${s.slice(5, 7)}-${s.slice(8, 10)}` : '');

// 首次打开(整表为空)播种几条示例流水,落在当前月,顺手演示用法
const seedRows = (month: string): [Row['type'], number, string, string][] => [
  ['income', 880000, '卖掉了老家祖传的陨石,鉴定说是火星来的', `${month}-03T09:15:00`],
  ['income', 5200, '帮邻居大妈设计了一款广场舞队服,爆单了', `${month}-08T11:00:00`],
  ['income', 1500, '教楼下咖啡店老板拉花,他按杯付费', `${month}-14T08:30:00`],
  ['expense', 140000, '冲动买了一匹退役赛马,说是要陪它跑步', `${month}-20T14:30:00`],
  ['expense', 299, '给自己买了一本《如何停止乱花钱》', `${month}-26T15:30:00`],
];

export default function Finance({ appId }: { appId: string }) {
  void appId; // 数据固定走本应用自己的表
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
      <header className="fin-spine"><span className="fin-title">记账本</span></header>
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
            <div className="fin-sumcol"><span className="fin-sumlbl">收入</span><span className="fin-inc">+ {fmtAmt(income)}</span></div>
            <div className="fin-sumcol div"><span className="fin-sumlbl">支出</span><span className="fin-exp">- {fmtAmt(expense)}</span></div>
            <div className="fin-sumcol div"><span className="fin-sumlbl bold">结余</span><span className="fin-bal">{fmtAmt(balance)}</span></div>
          </div>
        </div>

        <div className="fin-tablewrap">
          <table className="fin-table fin-dot">
            <thead>
              <tr>
                <th className="w-date">日期</th>
                <th>摘要</th>
                <th className="w-amt">支出</th>
                <th className="w-amt">存入</th>
                <th className="w-op">操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="fin-tr">
                  <td className="c" onDoubleClick={() => beginEdit(row, 'date')}>
                    {editCell(row, 'date', 'c') || <span>{fmtDate(row.date)}</span>}
                  </td>
                  <td className="c" onDoubleClick={() => beginEdit(row, 'note')}>
                    {editCell(row, 'note', 'c') || <span>{row.note || (row.type === 'income' ? '入账' : '支出')}</span>}
                  </td>
                  <td className="r exp" onDoubleClick={() => row.type === 'expense' && beginEdit(row, 'amount')}>
                    {(row.type === 'expense' && editCell(row, 'amount', 'r exp')) || <span>{row.type === 'expense' ? '-' + fmtAmt(row.amount) : ''}</span>}
                  </td>
                  <td className="r inc" onDoubleClick={() => row.type === 'income' && beginEdit(row, 'amount')}>
                    {(row.type === 'income' && editCell(row, 'amount', 'r inc')) || <span>{row.type === 'income' ? '+' + fmtAmt(row.amount) : ''}</span>}
                  </td>
                  <td className="c">
                    <button className="fin-del" onClick={() => remove(row.id)}>删除</button>
                  </td>
                </tr>
              ))}

              <tr className="fin-addrow">
                <td className="c"><input className="fin-inl c" value={form.date} placeholder={todayStr} onChange={(e) => setForm({ ...form, date: e.target.value })} /></td>
                <td className="c"><input className="fin-inl c" value={form.note} placeholder="写点什么…" onChange={(e) => setForm({ ...form, note: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && addRow()} /></td>
                <td className="r"><input className="fin-inl r exp" value={form.withdraw} placeholder="0.00" onChange={(e) => setForm({ ...form, withdraw: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && addRow()} /></td>
                <td className="r"><input className="fin-inl r inc" value={form.deposit} placeholder="0.00" onChange={(e) => setForm({ ...form, deposit: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && addRow()} /></td>
                <td className="c"><button className="fin-add" disabled={saving || (!form.withdraw && !form.deposit)} onClick={addRow}>记一笔</button></td>
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
