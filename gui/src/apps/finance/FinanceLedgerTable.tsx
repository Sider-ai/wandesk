type FinanceRow = {
  id: number | string;
  date?: string;
  note?: string;
  type?: "income" | "expense";
  amount?: number;
};

type Editing = {
  active: boolean;
  id: number | string | null;
  field: string;
  value: string;
  original: string;
};

type FormState = {
  newDate: string;
  newNote: string;
  newWithdraw: string;
  newDeposit: string;
};

const cellClass = "border border-[rgba(82,113,255,0.3)] px-2 py-2 text-[13px] sm:px-4 sm:py-3 sm:text-[15px]";
const inputClass = "inline-input w-full border-0 border-b border-dashed border-[rgba(11,28,103,0.3)] bg-transparent px-1 py-0.5 text-inherit outline-none transition-all placeholder:italic placeholder:text-[rgba(11,28,103,0.3)] focus:border-solid focus:border-[#0b1c67] focus:bg-white/50";

export default function FinanceLedgerTable({
  rows,
  editing,
  setEditingValue,
  form,
  setForm,
  todayStr,
  saving,
  fmtDate,
  fmtAmt,
  startEdit,
  saveEdit,
  cancelEdit,
  remove,
  save
}: {
  rows: FinanceRow[];
  editing: Editing;
  setEditingValue: (value: string) => void;
  form: FormState;
  setForm: (patch: Partial<FormState>) => void;
  todayStr: string;
  saving: boolean;
  fmtDate: (value?: string) => string;
  fmtAmt: (value?: number) => string;
  startEdit: (row: FinanceRow, field: string) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  remove: (id: number | string) => void;
  save: () => void;
}) {
  const editInput = (row: FinanceRow, field: string, className = "") => editing.active && editing.id === row.id && editing.field === field ? (
    <input
      value={editing.value}
      onChange={(event) => setEditingValue(event.target.value)}
      className={`${inputClass} ${className}`}
      onBlur={saveEdit}
      onKeyDown={(event) => {
        if (event.key === "Enter") saveEdit();
        if (event.key === "Escape") cancelEdit();
      }}
      autoFocus
    />
  ) : null;

  return (
    <div className="passbook-table-wrapper mx-3 mb-4 flex-1 overflow-y-auto rounded border border-[rgba(82,113,255,0.4)] bg-white/40 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sm:mx-10 sm:mb-10 sm:ml-[60px]">
      <table className="dot-matrix w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky top-0 z-10 w-[12%] border border-[rgba(82,113,255,0.4)] bg-[rgba(82,113,255,0.15)] px-2 py-3 text-center text-xs font-bold text-[#1a2a40] backdrop-blur-[4px] sm:text-sm">Date</th>
            <th className="sticky top-0 z-10 border border-[rgba(82,113,255,0.4)] bg-[rgba(82,113,255,0.15)] px-2 py-3 text-center text-xs font-bold text-[#1a2a40] backdrop-blur-[4px] sm:text-sm">Summary</th>
            <th className="sticky top-0 z-10 w-[15%] border border-[rgba(82,113,255,0.4)] bg-[rgba(82,113,255,0.15)] px-2 py-3 text-center text-xs font-bold text-[#1a2a40] backdrop-blur-[4px] sm:text-sm">Expense</th>
            <th className="sticky top-0 z-10 w-[15%] border border-[rgba(82,113,255,0.4)] bg-[rgba(82,113,255,0.15)] px-2 py-3 text-center text-xs font-bold text-[#1a2a40] backdrop-blur-[4px] sm:text-sm">Deposit</th>
            <th className="sticky top-0 z-10 w-[10%] border border-[rgba(82,113,255,0.4)] bg-[rgba(82,113,255,0.15)] px-2 py-3 text-center text-xs font-bold text-[#1a2a40] backdrop-blur-[4px] sm:text-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="group transition-colors hover:bg-[rgba(82,113,255,0.05)]">
              <td className={`${cellClass} text-center`} onDoubleClick={() => startEdit(row, "date")}>
                {editInput(row, "date", "text-center") || <span>{fmtDate(row.date)}</span>}
              </td>
              <td className={`${cellClass} text-center`} onDoubleClick={() => startEdit(row, "note")}>
                {editInput(row, "note", "text-center") || <span>{row.note || (row.type === "income" ? "Deposit" : "Expense")}</span>}
              </td>
              <td className={`${cellClass} text-right font-bold ${row.type === "expense" ? "text-red-700" : ""}`} onDoubleClick={() => row.type === "expense" && startEdit(row, "amount")}>
                {row.type === "expense" && editInput(row, "amount", "text-right font-bold text-red-700") || <span>{row.type === "expense" ? `-${fmtAmt(row.amount)}` : ""}</span>}
              </td>
              <td className={`${cellClass} text-right font-bold ${row.type === "income" ? "text-green-700" : ""}`} onDoubleClick={() => row.type === "income" && startEdit(row, "amount")}>
                {row.type === "income" && editInput(row, "amount", "text-right font-bold text-green-700") || <span>{row.type === "income" ? `+${fmtAmt(row.amount)}` : ""}</span>}
              </td>
              <td className={`${cellClass} text-center`}>
                <button className="rounded border border-red-700 bg-transparent px-2 py-1 text-[11px] font-bold text-red-700 opacity-100 transition-all hover:bg-[#0b1c67] hover:text-white hover:shadow-[0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-px sm:px-3 sm:text-xs sm:opacity-0 sm:group-hover:opacity-100" onClick={() => remove(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr className="bg-[rgba(82,113,255,0.08)]">
            <td className={`${cellClass} text-center`}><input value={form.newDate} onChange={(event) => setForm({ newDate: event.target.value })} type="text" className={`${inputClass} text-center`} placeholder={todayStr} /></td>
            <td className={`${cellClass} text-center`}><input value={form.newNote} onChange={(event) => setForm({ newNote: event.target.value })} type="text" className={`${inputClass} text-center`} placeholder="Summary..." onKeyDown={(event) => { if (event.key === "Enter") save(); }} /></td>
            <td className={`${cellClass} text-right`}><input value={form.newWithdraw} onChange={(event) => setForm({ newWithdraw: event.target.value })} type="text" className={`${inputClass} text-right font-bold text-red-700`} placeholder="0.00" onKeyDown={(event) => { if (event.key === "Enter") save(); }} /></td>
            <td className={`${cellClass} text-right`}><input value={form.newDeposit} onChange={(event) => setForm({ newDeposit: event.target.value })} type="text" className={`${inputClass} text-right font-bold text-green-700`} placeholder="0.00" onKeyDown={(event) => { if (event.key === "Enter") save(); }} /></td>
            <td className={`${cellClass} text-center`}><button className="rounded border border-[#0b1c67] bg-transparent px-2 py-1 text-[11px] font-bold text-[#0b1c67] transition-all hover:bg-[#0b1c67] hover:text-white hover:shadow-[0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-30 sm:px-3 sm:text-xs" disabled={saving || (!form.newWithdraw && !form.newDeposit)} onClick={save}>Save</button></td>
          </tr>
          {Array.from({ length: 6 }).map((_, row) => (
            <tr key={`empty-${row}`}>{Array.from({ length: 5 }).map((__, col) => <td key={col} className="h-8 border border-[rgba(82,113,255,0.3)] px-2 py-2 text-[13px] sm:px-4 sm:py-3 sm:text-[15px]" />)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
