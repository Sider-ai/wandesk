import { instantTask } from "../../../shared/apps/instantTask.js";

const digest = async ({ list = "" }) => {
  const prompt = `Summarize this batch of trending GitHub repositories in English.

Use only the project list below. Highlight the most notable themes, representative projects, and the problems they are solving.

Return only the final digest.

Project list:
${list}`;
  const result = await instantTask({
    app: "ghtrending",
    title: "GitHub Trending Digest",
    payload: { messages: [{ role: "user", content: prompt }] }
  });
  return { success: true, analysis: result.response || "" };
};

export { digest };
