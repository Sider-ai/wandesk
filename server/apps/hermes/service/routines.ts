import { runHermes } from "./exec.js";

const listRoutines = async () => {
  try {
    const raw = await runHermes(["cron", "list"], 10000);
    const text = raw.stdout.trim();
    if (!text || /No scheduled jobs/i.test(text)) return { success: true, count: 0, routines: [], raw: text };
    const routines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    return { success: true, count: routines.length, routines, raw: text };
  } catch (err: any) {
    return { status: 500, message: err?.message || "Hermes routines read failed" };
  }
};

export { listRoutines };
