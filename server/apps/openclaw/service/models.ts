import { runOpenClaw, runOpenClawJson } from "./openclaw.js";

const listModels = async () => {
  try {
    const { data } = await runOpenClawJson(["models", "list", "--json"], 20000);
    const models = Array.isArray(data?.models) ? data.models : [];
    return { success: true, count: Number(data?.count ?? models.length) || 0, models };
  } catch (err: any) {
    return { status: 500, message: err?.message || "openclaw models list 执行失败" };
  }
};

const setModel = async (model?: string) => {
  const value = String(model || "").trim();
  if (!value) return { status: 400, message: "model 必填" };
  try {
    const out = await runOpenClaw(["models", "set", value], 20000);
    return { success: true, output: out.stdout.trim() };
  } catch (err: any) {
    return { status: 500, message: err?.message || "openclaw models set 执行失败" };
  }
};

export { listModels, setModel };
