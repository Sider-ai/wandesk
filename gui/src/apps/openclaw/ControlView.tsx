import { useEffect, useMemo, useState } from "react";

type Status = {
  gateway?: boolean;
  gatewayUrl?: string;
  serviceStatus?: string;
  authCapability?: string;
  bind?: string;
  model?: string;
  modelConfigured?: boolean;
  sessionsCount?: number;
  gatewayIssue?: string;
  modelIssue?: string;
};

type Session = {
  key: string;
  sessionId?: string;
  agentId?: string;
  model?: string;
  updatedAt?: number | string | null;
  totalTokens?: number;
};

type Model = {
  key: string;
  name?: string;
  available?: boolean;
  tags?: string[];
};

const BASE = "/apps/openclaw";

const paperStyle = {
  background: "linear-gradient(180deg,#f8efd8,#ead8b4 58%,#dec398)",
  border: "1px solid rgba(70,40,10,0.32)",
  boxShadow: "0 2px 0 rgba(80,48,14,0.22),0 10px 22px rgba(30,18,8,0.24),inset 0 1px 0 rgba(255,250,220,0.72),inset 0 -18px 28px rgba(140,94,35,0.08)"
};

const brassButton = {
  background: "linear-gradient(180deg,#d9bd70,#b38d35 54%,#8f681e)",
  border: "1px solid #6d4a14",
  color: "#321d08",
  boxShadow: "0 2px 0 rgba(46,24,0,0.5),inset 0 1px 1px rgba(255,245,190,0.42)",
  textShadow: "0 1px 0 rgba(255,238,174,0.32)",
  fontFamily: "Georgia,'PingFang SC',serif"
};

const formatTime = (value?: number | string | null) => {
  if (!value) return "";
  const ms = typeof value === "number" && value < 100000000000 ? value * 1000 : Number(value);
  const date = Number.isFinite(ms) ? new Date(ms) : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

const shortModel = (model?: string) => String(model || "").replace(/^claude-cli\//, "").replace(/^openai\//, "");

export default function ControlView({ status, onRefresh }: { status: Status; onRefresh: () => void }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelBusy, setModelBusy] = useState(false);
  const [error, setError] = useState("");

  const availableModels = useMemo(() => models.filter((item) => item.available !== false), [models]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [sessionsRes, modelsRes] = await Promise.all([
        fetch(`${BASE}/sessions`),
        fetch(`${BASE}/models`)
      ]);
      const sessionsData = await sessionsRes.json().catch(() => ({}));
      const modelsData = await modelsRes.json().catch(() => ({}));
      if (sessionsData.success === false) setError(sessionsData.message || "");
      setSessions(Array.isArray(sessionsData.sessions) ? sessionsData.sessions : []);
      setModels(Array.isArray(modelsData.models) ? modelsData.models : []);
      const current = String(status.model || modelsData.models?.find((item: Model) => item.tags?.includes("default"))?.key || "");
      setSelectedModel(current);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status.model]);

  const setDefaultModel = async () => {
    if (!selectedModel || modelBusy) return;
    setModelBusy(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/models/set`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: selectedModel })
      });
      const data = await res.json().catch(() => ({}));
      if (data.success === false) setError(data.message || "");
      await onRefresh();
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setModelBusy(false);
    }
  };

  const openDashboard = () => {
    if (status.gatewayUrl) window.open(status.gatewayUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="grid gap-3">
        <div className="grid grid-cols-3 gap-2">
          <Gauge label="__T_OPENCLAW_GAUGE_GATEWAY__" value={status.gateway ? "__T_OPENCLAW_READY__" : "__T_OPENCLAW_SLEEPING__"} active={Boolean(status.gateway)} detail={status.bind || "127.0.0.1:18789"} />
          <Gauge label="__T_OPENCLAW_GAUGE_MODEL__" value={status.modelConfigured ? "__T_OPENCLAW_READY__" : "__T_OPENCLAW_MISSING__"} active={Boolean(status.modelConfigured)} detail={shortModel(status.model)} />
          <Gauge label="__T_OPENCLAW_GAUGE_SESSIONS__" value={String(status.sessionsCount || sessions.length || 0)} active={Boolean(status.sessionsCount || sessions.length)} detail="__T_OPENCLAW_SESSION_UNIT__" />
        </div>

        <section className="relative rounded-sm px-3.5 py-3" style={paperStyle}>
          <span className="absolute -top-[3px] right-4 h-4 w-4 rounded-full" style={{ background: "radial-gradient(circle at 38% 32%,#d88454,#8e321f)", boxShadow: "0 2px 3px rgba(0,0,0,0.32)" }} />
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <div className="text-[15px] font-bold text-[#3a2810]">__T_OPENCLAW_PANEL_RUNTIME__</div>
              <div className="mt-0.5 text-[10px] text-[#8b7650]">{status.serviceStatus || "__T_OPENCLAW_UNKNOWN__"} · {status.authCapability || "__T_OPENCLAW_UNKNOWN__"}</div>
            </div>
            <div className="flex gap-1.5">
              <button className="rounded px-3 py-1.5 text-[10px] font-bold transition-transform active:translate-y-0.5" style={brassButton} onClick={onRefresh}>__T_OPENCLAW_REFRESH__</button>
              <button className="rounded px-3 py-1.5 text-[10px] font-bold transition-transform active:translate-y-0.5 disabled:opacity-40" style={brassButton} onClick={openDashboard} disabled={!status.gatewayUrl}>__T_OPENCLAW_DASHBOARD__</button>
            </div>
          </div>
          {(status.gatewayIssue || status.modelIssue || error) && (
            <div className="mt-2 rounded-sm border border-[#9a5a2a]/30 bg-[#7a2e1a]/10 px-2.5 py-2 text-[10.5px] leading-relaxed text-[#7a321c]">
              {error || status.modelIssue || status.gatewayIssue}
            </div>
          )}
        </section>

        <section className="relative rounded-sm px-3.5 py-3" style={paperStyle}>
          <span className="absolute -top-[3px] left-6 h-4 w-4 rounded-full" style={{ background: "radial-gradient(circle at 38% 32%,#76a9da,#244e93)", boxShadow: "0 2px 3px rgba(0,0,0,0.32)" }} />
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <div className="text-[15px] font-bold text-[#3a2810]">__T_OPENCLAW_PANEL_MODEL__</div>
              <div className="mt-0.5 text-[10px] text-[#8b7650]">{status.model || "__T_OPENCLAW_MODEL_NOT_SET__"}</div>
            </div>
            <button className="rounded px-3 py-1.5 text-[10px] font-bold transition-transform active:translate-y-0.5 disabled:opacity-40" style={brassButton} disabled={!selectedModel || modelBusy} onClick={setDefaultModel}>{modelBusy ? "__T_OPENCLAW_SAVING__" : "__T_OPENCLAW_SET_MODEL__"}</button>
          </div>
          <select
            value={selectedModel}
            onChange={(event) => setSelectedModel(event.target.value)}
            className="w-full rounded-md px-3 py-2 text-[11px] outline-none"
            style={{ background: "linear-gradient(180deg,#3a2817,#24160d)", border: "1px solid #110904", color: "#dec99c", boxShadow: "inset 0 2px 5px rgba(0,0,0,0.55)", fontFamily: "Georgia,'PingFang SC',serif" }}
          >
            {!availableModels.length && <option value="">{loading ? "__T_OPENCLAW_LOADING__" : "__T_OPENCLAW_NO_MODELS__"}</option>}
            {availableModels.map((item) => <option key={item.key} value={item.key}>{item.name || item.key}</option>)}
          </select>
        </section>

        <section className="relative rounded-sm px-3.5 py-3" style={paperStyle}>
          <span className="absolute -top-[3px] right-10 h-4 w-4 rounded-full" style={{ background: "radial-gradient(circle at 38% 32%,#95cc83,#2d7d32)", boxShadow: "0 2px 3px rgba(0,0,0,0.32)" }} />
          <div className="mb-2 text-[15px] font-bold text-[#3a2810]">__T_OPENCLAW_PANEL_SESSIONS__</div>
          {!sessions.length ? (
            <div className="rounded-sm border border-dashed border-[#9a875d]/45 py-5 text-center text-[11px] text-[#8b7650]">__T_OPENCLAW_SESSIONS_EMPTY__</div>
          ) : (
            <div className="grid gap-2">
              {sessions.map((item) => (
                <div key={item.key || item.sessionId} className="rounded-sm border border-[#7a5a22]/20 bg-[#fff7df]/40 px-2.5 py-2">
                  <div className="truncate font-mono text-[10px] text-[#5b3a12]">{item.key || item.sessionId}</div>
                  <div className="mt-1 flex items-center justify-between gap-2 text-[10px] text-[#8b7650]">
                    <span className="truncate">{shortModel(item.model)}</span>
                    <span className="shrink-0 tabular-nums">{item.totalTokens || 0} __T_OPENCLAW_TOKEN_UNIT__</span>
                  </div>
                  {formatTime(item.updatedAt) && <div className="mt-0.5 text-[9px] text-[#a08a5f]">{formatTime(item.updatedAt)}</div>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Gauge({ label, value, detail, active }: { label: string; value: string; detail?: string; active?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-sm px-2 py-2 text-center" style={{ background: "linear-gradient(180deg,#4b3320,#2d1b10)", border: "1px solid #1a0e06", boxShadow: "inset 0 2px 7px rgba(0,0,0,0.55),0 1px 0 rgba(255,224,150,0.06)" }}>
      <div className="mx-auto mb-1.5 h-7 w-7 rounded-full" style={{ background: active ? "radial-gradient(circle,#79c95b,#356e22 58%,#14340c)" : "radial-gradient(circle,#a7864a,#6d4a25 58%,#2c1a0b)", border: "1px solid rgba(255,220,120,0.22)", boxShadow: "inset 0 2px 2px rgba(255,255,200,0.16),0 0 12px rgba(200,160,80,0.14)" }} />
      <div className="text-[8px] font-bold tracking-wider text-[#bca46f]">{label}</div>
      <div className="mt-0.5 truncate text-[11px] font-bold text-[#f0d99a]">{value}</div>
      {detail && <div className="mt-px truncate text-[8px] text-[#8d7750]">{detail}</div>}
    </div>
  );
}
