export default function FinanceHeader({
  displayMonth,
  isCurrentMonth,
  totalIncome,
  totalExpense,
  endingBalance,
  fmtAmt,
  onPrevMonth,
  onNextMonth
}: {
  displayMonth: string;
  isCurrentMonth: boolean;
  totalIncome: number;
  totalExpense: number;
  endingBalance: number;
  fmtAmt: (value: number) => string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  return (
    <div className="dot-matrix flex shrink-0 flex-col gap-4 px-4 pb-4 pt-5 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:pb-5 sm:pl-[60px] sm:pt-[30px]">
      <div className="flex items-center gap-3 text-xl font-bold text-[#1a2a40] sm:gap-4 sm:text-2xl">
        <button className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-black/5 active:scale-90 sm:h-9 sm:w-9" onClick={onPrevMonth}>◄</button>
        <span className="tracking-[0.15em]">{displayMonth}</span>
        <button
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-black/5 active:scale-90 sm:h-9 sm:w-9 ${isCurrentMonth ? "cursor-not-allowed opacity-30" : ""}`}
          disabled={isCurrentMonth}
          onClick={onNextMonth}
        >
          ►
        </button>
      </div>
      <div className="summary-box flex justify-between gap-3 rounded border-2 border-dashed border-[rgba(82,113,255,0.4)] bg-white/60 px-3 py-2 shadow-[inset_0_0_10px_rgba(0,0,0,0.02)] sm:gap-[30px] sm:px-6 sm:py-3">
        <div className="flex flex-col items-end">
          <span className="mb-0.5 text-[10px] text-gray-500 sm:mb-1 sm:text-xs">Income</span>
          <span className="text-sm font-bold text-green-700 sm:text-lg">+ {fmtAmt(totalIncome)}</span>
        </div>
        <div className="flex flex-col items-end border-l border-dashed border-[rgba(82,113,255,0.3)] pl-3 sm:pl-[30px]">
          <span className="mb-0.5 text-[10px] text-gray-500 sm:mb-1 sm:text-xs">Expense</span>
          <span className="text-sm font-bold text-red-700 sm:text-lg">- {fmtAmt(totalExpense)}</span>
        </div>
        <div className="flex flex-col items-end border-l border-dashed border-[rgba(82,113,255,0.3)] pl-3 sm:pl-[30px]">
          <span className="mb-0.5 text-[10px] font-bold text-blue-900 sm:mb-1 sm:text-xs">Balance</span>
          <span className="text-base font-black text-black underline decoration-double sm:text-2xl">{fmtAmt(endingBalance)}</span>
        </div>
      </div>
    </div>
  );
}
