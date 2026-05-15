import { useToastState } from "../stores/toast";

export default function GlobalToast() {
  const state = useToastState();
  return (
    <div className="pointer-events-none fixed bottom-14 left-1/2 z-[500] -translate-x-1/2">
      {state.visible && (
        <div className={`rounded-full px-4 py-2 text-[12px] font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.18)] ${state.type === "error" ? "bg-[#b03a20] text-white" : "bg-[#2a1f13] text-white"}`}>
          {state.message}
        </div>
      )}
    </div>
  );
}
