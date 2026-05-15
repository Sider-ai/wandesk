import { agentTask } from "../../../../shared/apps/agentTask.js";

const requestDecisionTask = async (cfg) => {
  const title = "Cryptobot Autonomous Run";
  const prompt = `You are an autonomous cryptocurrency trading agent operating in live trading mode.
Goal: ${cfg.goal || ""}

Exchange connection:
API Endpoint: ${cfg.base_url || "https://www.okx.com"}
API Key: ${cfg.api_key || ""}
API Secret: ${cfg.api_secret || ""}
Passphrase: ${cfg.passphrase || ""}

Requirements:
1. In this run, you may fully analyze the market and execute trading actions autonomously.
2. Do not explain the full process to the user; only provide the execution summary for this run.
3. Output plain text only (120-280 words). Do not return JSON, markdown, or code fences.
4. The summary must include: the main judgment, actions taken, result, and what to watch next.`;
  const data = await agentTask({
    app: "cryptobot",
    title,
    payload: { messages: [{ role: "user", content: prompt }] }
  });
  const summary = String(data.response || "").trim() || "This run completed, but no valid summary was returned.";
  return {
    summary: summary.slice(0, 1200),
    task_id: Number(data.id || 0)
  };
};
export {
  requestDecisionTask
};
