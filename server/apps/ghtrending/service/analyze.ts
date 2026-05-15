import { agentTask } from "../../../shared/apps/agentTask.js";

const analyze = async ({ repo }) => {
  const prompt = `Analyze this trending GitHub project in English.

You must investigate the repository before writing the analysis.

Required workflow:
1. Use shell commands to inspect the repository.
2. First fetch and read the README.
3. If helpful, inspect key files such as package.json, pyproject.toml, Cargo.toml, go.mod, or requirements.txt.
4. If the repository files are still not enough, perform necessary web searches, prioritizing official docs or the project site.
5. Then write the final analysis.

Focus on:
- what the project does
- why it may be popular
- who should use it
- notable technical highlights
- important limitations or caveats

Return only the final analysis.

Repository: ${repo.name}
Description: ${repo.description || ""}
Language: ${repo.language || ""}
Stars: ${repo.stars || 0}
URL: ${repo.url || ""}`;
  const result = await agentTask({
    app: "ghtrending",
    title: `Analyze: ${repo.name}`,
    payload: { messages: [{ role: "user", content: prompt }] }
  });
  return { success: true, analysis: result.response || "" };
};

export { analyze };
