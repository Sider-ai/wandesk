import { runOpenClaw, runOpenClawJson } from "./openclaw.js";

const run = async (args: string[]): Promise<string> => {
  const res = await runOpenClaw(args, 20000);
  return res.stdout.trim();
};

const normalizeJob = (job: any) => {
  const schedule: { cron?: string; at?: string; every?: number } = {};
  if (job?.schedule?.kind === "cron") schedule.cron = job.schedule.expr || "";
  else if (job?.schedule?.kind === "at") schedule.at = job.schedule.at || "";
  else if (job?.schedule?.kind === "every") schedule.every = Number(job.schedule.everyMs || 0) || 0;

  let lastRunAt = "";
  if (job?.state?.lastRunAtMs) {
    const ts = Number(job.state.lastRunAtMs);
    if (Number.isFinite(ts) && ts > 0) lastRunAt = new Date(ts).toISOString().replace("T", " ").slice(0, 19);
  }

  return {
    ...job,
    schedule,
    message: String(job?.message || job?.payload?.message || ""),
    prompt: String(job?.payload?.message || job?.message || ""),
    lastRunAt
  };
};

const listCron = async () => {
  try {
    const { data } = await runOpenClawJson(["cron", "list", "--json"], 20000);
    const rawJobs = Array.isArray(data) ? data : Array.isArray(data.jobs) ? data.jobs : [];
    return {
      success: true,
      jobs: rawJobs.map(normalizeJob),
      total: Number(data?.total ?? rawJobs.length) || 0
    };
  } catch (err: any) {
    return { status: 500, message: err?.message || "openclaw cron list 执行失败" };
  }
};

type Schedule = { cron?: string; at?: string; every?: number };

const addCron = async ({
  name,
  schedule,
  prompt,
  sessionTarget
}: {
  name?: string;
  schedule?: Schedule;
  prompt?: string;
  sessionTarget?: string;
}) => {
  if (!name || !prompt) return { status: 400, message: "name 和 prompt 必填" };

  const args = ["cron", "add", "--name", name];
  if (schedule?.cron) args.push("--cron", schedule.cron);
  else if (schedule?.at) args.push("--at", schedule.at);
  else if (schedule?.every) args.push("--every", String(schedule.every));
  args.push("--message", prompt);
  if (sessionTarget) args.push("--session", sessionTarget);

  try {
    const out = await run(args);
    return { success: true, output: out };
  } catch (err: any) {
    return { status: 500, message: err?.message || "openclaw cron add 执行失败" };
  }
};

const runCron = async (jobId?: string) => {
  if (!jobId) return { status: 400, message: "jobId 必填" };
  try {
    const out = await run(["cron", "run", String(jobId), "--session", "main"]);
    return { success: true, output: out };
  } catch (err: any) {
    return { status: 500, message: err?.message || "openclaw cron run 执行失败" };
  }
};

const deleteCron = async (jobId?: string) => {
  if (!jobId) return { status: 400, message: "jobId 必填" };
  try {
    const out = await run(["cron", "delete", String(jobId)]);
    return { success: true, output: out };
  } catch (err: any) {
    return { status: 500, message: err?.message || "openclaw cron delete 执行失败" };
  }
};

export { listCron, addCron, runCron, deleteCron };
