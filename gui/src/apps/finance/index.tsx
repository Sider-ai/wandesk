import { useEffect, useMemo, useState } from "react";
import FinanceHeader from "./FinanceHeader";
import FinanceLedgerTable from "./FinanceLedgerTable";

type FinanceRow = {
  id: number | string;
  date?: string;
  note?: string;
  type?: "income" | "expense";
  amount?: number;
};

const API_BASE = "/apps/finance";

const monthValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function FinanceApp() {
  const [month, setMonth] = useState(monthValue(new Date()));
  const [items, setItems] = useState<FinanceRow[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setFormState] = useState({ newDate: "", newNote: "", newWithdraw: "", newDeposit: "" });
  const [editing, setEditing] = useState({ active: false, id: null as number | string | null, field: "", value: "", original: "" });

  const displayMonth = month.replace("-", " / ");
  const isCurrentMonth = month === monthValue(new Date());
  const todayStr = useMemo(() => {
    const date = new Date();
    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }, []);
  const endingBalance = totalIncome - totalExpense;

  const setForm = (patch: Partial<typeof form>) => setFormState((prev) => ({ ...prev, ...patch }));

  const fmtAmt = (value?: number) => {
    const amount = Number(value) || 0;
    return amount.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const fmtDate = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const fetchData = async (targetMonth = month) => {
    try {
      const res = await fetch(`${API_BASE}/list?month=${targetMonth}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotalIncome(Number(data.totalIncome || 0));
      setTotalExpense(Number(data.totalExpense || 0));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData(month);
  }, [month]);

  const prevMonth = () => {
    const [year, mon] = month.split("-").map(Number);
    setMonth(monthValue(new Date(year, mon - 2, 1)));
  };

  const nextMonth = () => {
    if (isCurrentMonth) return;
    const [year, mon] = month.split("-").map(Number);
    setMonth(monthValue(new Date(year, mon, 1)));
  };

  const save = async () => {
    const withdraw = parseFloat(form.newWithdraw) || 0;
    const deposit = parseFloat(form.newDeposit) || 0;
    if ((!withdraw && !deposit) || saving) return;
    setSaving(true);
    try {
      const type = deposit > 0 ? "income" : "expense";
      const amount = deposit > 0 ? deposit : withdraw;
      const note = form.newNote.trim();
      const dateInput = form.newDate.trim() || todayStr;
      const dayPart = dateInput.includes("-") ? dateInput.split("-").pop()! : dateInput;
      const fullDate = `${month}-${dayPart.padStart(2, "0")}T12:00:00`;
      await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount, note, date: fullDate })
      });
      setFormState({ newDate: "", newNote: "", newWithdraw: "", newDeposit: "" });
      await fetchData(month);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (row: FinanceRow, field: string) => {
    const value = field === "date" ? fmtDate(row.date) : field === "amount" ? String(row.amount || "") : row.note || "";
    setEditing({ active: true, id: row.id, field, value, original: value });
  };

  const cancelEdit = () => {
    setEditing({ active: false, id: null, field: "", value: "", original: "" });
  };

  const saveEdit = async () => {
    if (!editing.active) return;
    if (editing.value === editing.original) {
      cancelEdit();
      return;
    }
    const body: Record<string, unknown> = { id: editing.id };
    if (editing.field === "date") {
      const dayPart = editing.value.includes("-") ? editing.value.split("-").pop()! : editing.value;
      body.date = `${month}-${dayPart.padStart(2, "0")}T12:00:00`;
    } else if (editing.field === "amount") {
      const amount = parseFloat(editing.value);
      if (!amount || amount <= 0) {
        cancelEdit();
        return;
      }
      body.amount = amount;
    } else {
      body.note = editing.value;
    }
    cancelEdit();
    try {
      await fetch(`${API_BASE}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      await fetchData(month);
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id: number | string) => {
    try {
      await fetch(`${API_BASE}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      await fetchData(month);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="passbook-bg flex h-full w-full items-center justify-center overflow-hidden px-5 py-8 font-['PingFang_SC','Microsoft_YaHei',sans-serif]">
      <div className="passbook-container flex h-full w-full max-h-[900px] max-w-[1400px] rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
        <div className="passbook-cover relative flex w-[25px] shrink-0 items-center justify-center rounded-l-xl">
          <div className="cover-stripe absolute bottom-0 left-[5px] top-0 w-[10px] opacity-80" />
        </div>
        <div className="passbook-pages relative flex flex-1 flex-col rounded-r-xl">
          <div className="spine-crease pointer-events-none absolute bottom-0 left-0 top-0 z-50 w-10" />
          <FinanceHeader
            displayMonth={displayMonth}
            isCurrentMonth={isCurrentMonth}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            endingBalance={endingBalance}
            fmtAmt={fmtAmt}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
          />
          <FinanceLedgerTable
            rows={items}
            editing={editing}
            setEditingValue={(value) => setEditing((prev) => ({ ...prev, value }))}
            form={form}
            setForm={setForm}
            todayStr={todayStr}
            saving={saving}
            fmtDate={fmtDate}
            fmtAmt={fmtAmt}
            startEdit={startEdit}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            remove={remove}
            save={save}
          />
        </div>
      </div>
    </div>
  );
}
