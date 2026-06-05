import { useEffect, useMemo, useState } from "react";

type Schedule = { cron?: string; every?: string; at?: string };
type Job = {
  id: string;
  name?: string;
  message?: string;
  prompt?: string;
  schedule?: Schedule;
  lastRunAt?: number | string;
  state?: { lastStatus?: string };
};
type SchedType = "cron" | "every" | "at";

const BASE = "/apps/openclaw";
const EMOJIS = ["🐡", "🐠", "🐙", "🪼", "🦑", "🐚", "🦀", "🐳"];
const PINS = [
  "radial-gradient(circle at 38% 32%,#ff8888,#c83030)",
  "radial-gradient(circle at 38% 32%,#88dd88,#30a030)",
  "radial-gradient(circle at 38% 32%,#88aaff,#3050c8)",
  "radial-gradient(circle at 38% 32%,#ffdd66,#c8a020)"
];
const STRIPES = [
  "linear-gradient(180deg,#e06848,#c04830)",
  "linear-gradient(180deg,#48a8a0,#308880)",
  "linear-gradient(180deg,#9068a8,#704888)",
  "linear-gradient(180deg,#d0a040,#b08020)"
];

const scheduleText = (job: Job) => {
  if (job.schedule?.cron) return `cron: ${job.schedule.cron}`;
  if (job.schedule?.every) return `every ${job.schedule.every}`;
  if (job.schedule?.at) return `at ${job.schedule.at}`;
  return job.id;
};

const post = async (path: string, body: unknown) => {
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json().catch(() => ({}));
};

const SCHED_LABELS: Record<SchedType, string> = {
  cron: "__T_OPENCLAW_SCHED_LABEL_CRON__",
  every: "__T_OPENCLAW_SCHED_LABEL_EVERY__",
  at: "__T_OPENCLAW_SCHED_LABEL_AT__"
};
const SCHED_PH: Record<SchedType, string> = {
  cron: "__T_OPENCLAW_SCHED_CRON_PH__",
  every: "__T_OPENCLAW_SCHED_EVERY_PH__",
  at: "__T_OPENCLAW_SCHED_AT_PH__"
};
const SCHED_TABS: { id: SchedType; label: string }[] = [
  { id: "cron", label: "__T_OPENCLAW_SCHED_CRON__" },
  { id: "every", label: "__T_OPENCLAW_SCHED_EVERY__" },
  { id: "at", label: "__T_OPENCLAW_SCHED_AT__" }
];

export default function TaskView() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Job | null>(null);
  const [runBusy, setRunBusy] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [addBusy, setAddBusy] = useState(false);
  const [lastOutput, setLastOutput] = useState("");
  const [name, setName] = useState("");
  const [schedType, setSchedType] = useState<SchedType>("cron");
  const [schedValue, setSchedValue] = useState("");
  const [prompt, setPrompt] = useState("");

  const selectedIdx = useMemo(() => (selected ? jobs.indexOf(selected) : 0), [jobs, selected]);

  const loadCron = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/cron/list`);
      const data = await res.json().catch(() => ({}));
      if (data.success === false) { setError(data.message || ""); return; }
      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCron(); }, []);

  const doRun = async (jobId: string) => {
    setRunBusy(true);
    try {
      const data = await post("cron/run", { jobId });
      if (data.success === false) setError(data.message || "");
      else {
        setLastOutput(data.output || "");
        await loadCron();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRunBusy(false);
    }
  };

  const doDelete = async (jobId: string) => {
    try {
      await post("cron/delete", { jobId });
      setSelected(null);
      await loadCron();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const doAdd = async () => {
    if (!name.trim() || !prompt.trim()) return;
    setAddBusy(true);
    try {
      const schedule: Schedule = { [schedType]: schedValue };
      const data = await post("cron/add", { name: name.trim(), schedule, prompt: prompt.trim() });
      if (data.success !== false) {
        setShowNew(false);
        setName(""); setSchedType("cron"); setSchedValue(""); setPrompt("");
        await loadCron();
      } else {
        setError(data.message || "");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAddBusy(false);
    }
  };

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <div className="h-full min-h-0 overflow-y-auto px-4 pb-16 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading ? (
          <div className="py-10 text-center text-xs text-[rgba(255,230,180,0.3)]">{"__T_OPENCLAW_LOADING__"}</div>
        ) : error ? (
          <div className="py-10 text-center text-xs text-[#e0a070]">{error}</div>
        ) : !jobs.length ? (
          <div className="py-10 text-center text-xs text-[rgba(255,230,180,0.3)]">{"__T_OPENCLAW_CRON_EMPTY__"}</div>
        ) : (
          jobs.map((job, idx) => (
            <button
              key={job.id}
              onClick={() => setSelected(job)}
              className="relative mb-3 block w-full cursor-pointer overflow-hidden rounded-sm text-left transition-transform active:scale-[0.98]"
              style={{ background: "linear-gradient(180deg,#faf4e4,#f4ecda,#f0e6d0)", boxShadow: "1px 2px 4px rgba(0,0,0,0.18),2px 3px 6px rgba(0,0,0,0.08),inset 0 0 20px rgba(200,180,140,0.12)" }}
            >
              <span className="absolute -top-[3px] right-3 z-[3] h-4 w-4 rounded-full" style={{ background: PINS[idx % PINS.length], boxShadow: "0 2px 3px rgba(0,0,0,0.3)" }} />
              <span className="absolute bottom-0 left-0 top-0 w-1" style={{ background: STRIPES[idx % STRIPES.length] }} />
              <div className="px-3 py-2.5 pl-3.5">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-xl">{EMOJIS[idx % EMOJIS.length]}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-[#3a2810]">{job.name || job.id}</div>
                    <div className="mt-px font-mono text-[9px] text-[#9a8a68]">{scheduleText(job)}</div>
                  </div>
                </div>
                {(job.message || job.prompt) && <div className="mt-1.5 line-clamp-2 text-[11px] italic leading-relaxed text-[#6a5838]">{job.message || job.prompt}</div>}
              </div>
            </button>
          ))
        )}
      </div>

      <button
        onClick={() => setShowNew(true)}
        className="absolute bottom-4 right-4 z-[5] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-xl text-white transition-transform active:translate-y-0.5"
        style={{ background: "linear-gradient(180deg,#c8a050,#a07828)", border: "1px solid #7a5818", textShadow: "0 1px 1px rgba(0,0,0,0.3)", boxShadow: "0 3px 8px rgba(90,50,10,0.4),0 1px 0 #5a3a08,inset 0 1px 1px rgba(255,230,160,0.25)" }}
      >+</button>

      {selected && <DetailPanel job={selected} idx={selectedIdx} runBusy={runBusy} lastOutput={lastOutput} onBack={() => setSelected(null)} onRun={doRun} onDelete={doDelete} />}

      {showNew && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-5" style={{ background: "rgba(30,20,12,0.7)", backdropFilter: "blur(4px)" }} onClick={(event) => { if (event.target === event.currentTarget) setShowNew(false); }}>
          <div className="relative w-full max-w-[320px] rounded-sm p-[18px] shadow-xl" style={{ background: "linear-gradient(180deg,#faf4e4,#f0e6d0)" }}>
            <span className="absolute -top-[3px] right-4 z-[3] h-4 w-4 rounded-full" style={{ background: PINS[0], boxShadow: "0 2px 3px rgba(0,0,0,0.3)" }} />
            <div className="mb-3.5 text-center text-[15px] font-bold text-[#3a2810]">📌 {"__T_OPENCLAW_NEW_TASK__"}</div>
            <Field label="__T_OPENCLAW_CRON_NAME_LABEL__">
              <input className="oc-nc w-full border-none bg-transparent px-0.5 py-[7px] text-[13px] text-[#3a2810] outline-none" style={{ borderBottom: "1px solid rgba(160,140,100,0.3)", fontFamily: "Georgia,serif" }} value={name} onChange={(event) => setName(event.target.value)} placeholder="__T_OPENCLAW_CRON_NAME_PH__" />
            </Field>
            <Field label="__T_OPENCLAW_SCHED_TYPE_LABEL__">
              <div className="mb-1 flex gap-1">
                {SCHED_TABS.map((tab) => (
                  <div
                    key={tab.id}
                    onClick={() => setSchedType(tab.id)}
                    className="flex-1 cursor-pointer rounded py-1 text-center text-[9px] font-bold"
                    style={schedType === tab.id
                      ? { background: "linear-gradient(180deg,#c8a050,#a07828)", border: "1px solid #7a5818", color: "#fff", textShadow: "0 1px 1px rgba(0,0,0,0.2)", fontFamily: "Georgia,serif" }
                      : { background: "rgba(0,0,0,0.03)", border: "1px solid rgba(160,140,100,0.15)", color: "#9a8a68", fontFamily: "Georgia,serif" }}
                  >{tab.label}</div>
                ))}
              </div>
            </Field>
            <Field label={SCHED_LABELS[schedType]}>
              <input className="oc-nc w-full border-none bg-transparent px-0.5 py-[7px] text-[13px] text-[#3a2810] outline-none" style={{ borderBottom: "1px solid rgba(160,140,100,0.3)", fontFamily: "Georgia,serif" }} value={schedValue} onChange={(event) => setSchedValue(event.target.value)} placeholder={SCHED_PH[schedType]} />
            </Field>
            <Field label="__T_OPENCLAW_CRON_PROMPT_LABEL__">
              <textarea rows={3} className="oc-nc w-full resize-none border-none bg-transparent px-0.5 py-[7px] text-[13px] leading-relaxed text-[#3a2810] outline-none" style={{ borderBottom: "1px solid rgba(160,140,100,0.3)", fontFamily: "Georgia,serif" }} value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="__T_OPENCLAW_CRON_PROMPT_PH__" />
            </Field>
            <div className="mt-3.5 flex justify-center gap-2">
              <button onClick={() => setShowNew(false)} className="cursor-pointer rounded px-5 py-[7px] text-[11px] font-bold transition-transform active:translate-y-0.5" style={{ background: "linear-gradient(180deg,#e8e0d0,#d8d0c0)", border: "1px solid #c0b8a0", color: "#8a7a58", boxShadow: "0 2px 0 rgba(0,0,0,0.12)", fontFamily: "Georgia,serif" }}>{"__T_OPENCLAW_CANCEL__"}</button>
              <button onClick={doAdd} disabled={addBusy} className="cursor-pointer rounded px-5 py-[7px] text-[11px] font-bold text-white transition-transform active:translate-y-0.5 disabled:opacity-50" style={{ background: "linear-gradient(180deg,#c8a050,#a07828)", border: "1px solid #7a5818", textShadow: "0 1px 1px rgba(0,0,0,0.2)", boxShadow: "0 2px 0 #5a3a08", fontFamily: "Georgia,serif" }}>{"__T_OPENCLAW_PIN_IT__"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      <div className="mb-0.5 text-[9px] font-bold tracking-wider text-[#9a8a68]">{label}</div>
      {children}
    </div>
  );
}

function DetailPanel({ job, idx, runBusy, lastOutput, onBack, onRun, onDelete }: {
  job: Job; idx: number; runBusy: boolean; lastOutput: string;
  onBack: () => void; onRun: (id: string) => void; onDelete: (id: string) => void;
}) {
  const lastRun = job.lastRunAt ? new Date(job.lastRunAt).toLocaleString() : "";
  return (
    <div className="absolute inset-0 z-[3] flex flex-col overflow-hidden" style={{ background: "linear-gradient(160deg,#8a6a42,#7a5c38,#6a4e30,#5a4228)" }}>
      <div className="flex shrink-0 items-center gap-2.5 px-4 pb-1.5 pt-2">
        <button onClick={onBack} className="cursor-pointer rounded border border-[#3a2810] px-3 py-1 text-[10px] font-bold text-[rgba(255,220,150,0.6)] transition-transform active:translate-y-0.5" style={{ background: "linear-gradient(180deg,#6a5838,#4a3820)", boxShadow: "0 2px 0 rgba(0,0,0,0.3)" }}>{"__T_OPENCLAW_BACK__"}</button>
        <div className="flex-1 truncate text-[13px] font-bold text-[#3a2810]">{job.name || job.id}</div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="rounded-sm p-3.5" style={{ background: "linear-gradient(180deg,#faf4e4,#f0e6d0)", boxShadow: "1px 2px 4px rgba(0,0,0,0.15)" }}>
          <div className="mb-1.5 flex items-center gap-2.5">
            <span className="text-[26px]">{EMOJIS[idx % EMOJIS.length]}</span>
            <div>
              <div className="text-base font-bold text-[#3a2810]">{job.name || job.id}</div>
              <div className="mt-0.5 font-mono text-[11px] text-[#9a8a68]">{scheduleText(job)}</div>
            </div>
          </div>
          {(job.message || job.prompt) && <div className="mt-1.5 border-t border-dashed border-[rgba(160,140,100,0.2)] py-2 text-xs italic leading-relaxed text-[#5a4830]">{job.message || job.prompt}</div>}
          {lastRun && <div className="mt-1.5 text-[10px] text-[#9a8a68]">{"__T_OPENCLAW_LAST_RUN__"} {lastRun}</div>}
          {job.state?.lastStatus && <div className={`mt-0.5 text-[10px] ${job.state.lastStatus === "error" ? "text-[#c05040]" : "text-[#4a8a40]"}`}>{job.state.lastStatus}</div>}
          {lastOutput && <div className="mt-2 rounded-sm border border-[#9a875d]/25 bg-[#fff7df]/45 px-2.5 py-2 font-mono text-[10px] leading-relaxed text-[#5a3b18]">{lastOutput}</div>}
          <div className="mt-2.5 flex gap-1.5 border-t border-dashed border-[rgba(160,140,100,0.2)] pt-2">
            <button onClick={() => onRun(job.id)} disabled={runBusy} className="cursor-pointer rounded px-3.5 py-1.5 text-[9px] font-bold transition-transform active:translate-y-0.5 disabled:opacity-50" style={{ background: "linear-gradient(180deg,#5a9a50,#408838)", border: "1px solid #2a6a20", color: "#d8f0d0", boxShadow: "0 2px 0 rgba(0,0,0,0.12)" }}>{runBusy ? "__T_OPENCLAW_RUNNING__" : "▶ __T_OPENCLAW_RUN__"}</button>
            <button onClick={() => onDelete(job.id)} className="cursor-pointer rounded px-3.5 py-1.5 text-[9px] font-bold text-white transition-transform active:translate-y-0.5" style={{ background: "linear-gradient(180deg,#c0a090,#a88878)", border: "1px solid #8a6858", boxShadow: "0 2px 0 rgba(0,0,0,0.12)" }}>{"__T_OPENCLAW_DELETE__"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
