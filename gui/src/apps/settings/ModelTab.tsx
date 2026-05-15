import type { ProviderGroup, ProviderItem } from "../../data/providers";

type SaveNotice = { type: string; message: string };

type ModelTabProps = {
  provider: string;
  apiUrl: string;
  apiKey: string;
  model: string;
  providerGroups: ProviderGroup[];
  providers: ProviderItem[];
  saveNotice: SaveNotice;
  onProviderChange: (value: string) => void;
  onApiUrlChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onSave: () => void;
};

export default function ModelTab({ provider, apiUrl, apiKey, model, providerGroups, providers, saveNotice, onProviderChange, onApiUrlChange, onApiKeyChange, onModelChange, onSave }: ModelTabProps) {
  const getProvidersByGroup = (groupId: string) => providers.filter((item) => item.group === groupId);
  const inputClass = "w-full rounded-[10px] border bg-[#faf8f5] px-[14px] py-[10px] text-[13px] outline-none transition-colors placeholder:text-[rgba(0,0,0,0.25)] focus:border-[#a07850] focus:bg-white";
  const labelClass = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.05em]";

  return (
    <section className="space-y-4">
      <div className="rounded-[13px] border px-4 py-4" style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="space-y-4">
          <div>
            <label className={labelClass} style={{ color: "rgba(0,0,0,0.35)" }}>Provider</label>
            <select
              value={provider}
              className="w-full cursor-pointer appearance-none rounded-[10px] border bg-[#faf8f5] px-[14px] py-[10px] pr-9 text-[13px] outline-none transition-colors focus:border-[#a07850] focus:bg-white"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2a1f13", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a8a7a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
              onChange={(event) => onProviderChange(event.target.value)}
            >
              {providerGroups.map((group) => (
                <optgroup key={group.id} label={group.name}>
                  {getProvidersByGroup(group.id).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} style={{ color: "rgba(0,0,0,0.35)" }}>Request URL</label>
            <input value={apiUrl} placeholder="https://api.example.com/v1/chat/completions" className={inputClass} style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2a1f13" }} onChange={(event) => onApiUrlChange(event.target.value)} />
          </div>

          <div>
            <label className={labelClass} style={{ color: "rgba(0,0,0,0.35)" }}>Model Key</label>
            <input value={apiKey} type="password" placeholder="sk-..." className={inputClass} style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2a1f13" }} onChange={(event) => onApiKeyChange(event.target.value)} />
          </div>

          <div>
            <label className={labelClass} style={{ color: "rgba(0,0,0,0.35)" }}>Model</label>
            <input value={model} placeholder="Enter a model name, for example gpt-4o" className={inputClass} style={{ borderColor: "rgba(0,0,0,0.1)", color: "#2a1f13" }} onChange={(event) => onModelChange(event.target.value)} />
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t pt-4" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-3">
            {saveNotice?.message && <p className="text-[12px] font-medium" style={{ color: saveNotice.type === "error" ? "#b2452f" : "#6f7f4b" }}>{saveNotice.message}</p>}
            <button className="rounded-[9px] bg-[#5c4332] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#3d2a1e]" onClick={onSave}>Save</button>
          </div>
        </div>
      </div>
    </section>
  );
}
