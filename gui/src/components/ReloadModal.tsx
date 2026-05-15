import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppearance } from "../stores/appearance";
import { on } from "../system/ws";

type Phase = "confirm" | "building" | "restarting" | "error";

type ReloadOptions = {
  build: boolean;
  restartApps: boolean;
  restartServer: boolean;
};

const defaultOptions = (): ReloadOptions => ({ build: false, restartApps: false, restartServer: false });

export default function ReloadModal() {
  const { desktopTheme } = useAppearance();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>("confirm");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingOptions, setPendingOptions] = useState<ReloadOptions>(defaultOptions);

  const dismiss = () => {
    setVisible(false);
    setPhase("confirm");
    setMessage("");
    setErrorMsg("");
    setPendingOptions(defaultOptions());
  };

  const updateOption = (key: keyof ReloadOptions, value: boolean) => {
    setPendingOptions((current) => ({ ...current, [key]: value }));
  };

  const doReload = async () => {
    setPhase(pendingOptions.build ? "building" : "restarting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/runtime/reload", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingOptions)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      window.setTimeout(() => location.reload(), pendingOptions.restartApps || pendingOptions.restartServer ? 1200 : 200);
    } catch (error) {
      setPhase("error");
      setErrorMsg(error instanceof Error ? error.message : "Unknown error");
    }
  };

  useEffect(() => {
    return on("reload_request", (data) => {
      setPendingOptions({
        build: data?.build ?? false,
        restartApps: data?.restartApps === true || data?.restart === "apps",
        restartServer: data?.restartServer === true
      });
      setMessage(data?.message || "");
      setPhase("confirm");
      setErrorMsg("");
      setVisible(true);
    });
  }, []);

  if (!visible) return null;

  const dark = desktopTheme === "dark";
  const busy = phase === "building" || phase === "restarting";
  const panelClass = dark ? "border-white/[0.10] bg-[#111]/75 text-white" : "border-white/70 bg-white/[0.82] text-[#222]";
  const subtleText = dark ? "text-white/52" : "text-black/45";
  const itemClass = dark ? "border-white/[0.08] bg-white/[0.05] text-white/72" : "border-black/[0.06] bg-black/[0.025] text-black/62";
  const secondaryButton = dark ? "border-white/[0.10] text-white/62 hover:bg-white/[0.08] hover:text-white" : "border-black/[0.08] text-black/55 hover:bg-black/[0.045] hover:text-[#222]";
  const primaryButton = dark ? "bg-white text-[#111] hover:bg-white/[0.88]" : "bg-[#222] text-white hover:bg-[#111]";
  const spinnerColor = dark ? "border-white/70 border-t-transparent" : "border-[#222] border-t-transparent";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/25 backdrop-blur-sm">
      <div className={`w-[420px] max-w-[calc(100vw-32px)] rounded-2xl border p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28),0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-2xl ${panelClass}`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${dark ? "border-white/[0.10] bg-white/[0.06]" : "border-black/[0.06] bg-black/[0.035]"}`}>
            <RotateCcw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold">Restart System</h3>
            <p className={`mt-0.5 text-[12px] leading-relaxed ${subtleText}`}>Apply runtime updates and refresh the desktop.</p>
          </div>
        </div>

        {message && <p className={`mt-4 rounded-xl border px-3 py-2 text-[12.5px] leading-relaxed ${itemClass}`}>{message}</p>}

        <div className="mt-4 space-y-2 text-[12.5px]">
          <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 ${itemClass}`}>
            <input checked={pendingOptions.build} onChange={(event) => updateOption("build", event.target.checked)} disabled={busy} type="checkbox" className="h-3.5 w-3.5 rounded border-black/20 bg-transparent accent-[#222] disabled:opacity-45" />
            <span>Rebuild frontend</span>
          </label>
          <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 ${itemClass}`}>
            <input checked={pendingOptions.restartApps} onChange={(event) => updateOption("restartApps", event.target.checked)} disabled={busy} type="checkbox" className="h-3.5 w-3.5 rounded border-black/20 bg-transparent accent-[#222] disabled:opacity-45" />
            <span>Restart app service</span>
          </label>
          <label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 ${itemClass}`}>
            <input checked={pendingOptions.restartServer} onChange={(event) => updateOption("restartServer", event.target.checked)} disabled={busy} type="checkbox" className="h-3.5 w-3.5 rounded border-black/20 bg-transparent accent-[#222] disabled:opacity-45" />
            <span>Restart main service</span>
          </label>
        </div>

        <div className="mt-5">
          {phase === "confirm" && (
            <div className="flex items-center justify-end gap-2">
              <button onClick={dismiss} className={`cursor-pointer rounded-xl border px-4 py-2 text-[13px] font-semibold transition ${secondaryButton}`}>Cancel</button>
              <button onClick={doReload} className={`cursor-pointer rounded-xl px-4 py-2 text-[13px] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition active:scale-[0.98] ${primaryButton}`}>Confirm Restart</button>
            </div>
          )}

          {phase === "building" && (
            <div className={`flex items-center gap-3 text-[13px] font-medium ${subtleText}`}>
              <span className={`inline-block h-4 w-4 animate-spin rounded-full border-2 ${spinnerColor}`} />
              Building frontend...
            </div>
          )}

          {phase === "restarting" && (
            <div className={`flex items-center gap-3 text-[13px] font-medium ${subtleText}`}>
              <span className={`inline-block h-4 w-4 animate-spin rounded-full border-2 ${spinnerColor}`} />
              Restarting services...
            </div>
          )}

          {phase === "error" && (
            <div className="space-y-3">
              <p className={`rounded-xl border px-3 py-2 text-[12.5px] ${dark ? "border-red-400/20 bg-red-500/10 text-red-200" : "border-red-500/15 bg-red-500/[0.06] text-red-700"}`}>{errorMsg}</p>
              <div className="flex items-center justify-end gap-2">
                <button onClick={dismiss} className={`cursor-pointer rounded-xl border px-4 py-2 text-[13px] font-semibold transition ${secondaryButton}`}>Close</button>
                <button onClick={doReload} className={`cursor-pointer rounded-xl px-4 py-2 text-[13px] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition active:scale-[0.98] ${primaryButton}`}>Retry</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
