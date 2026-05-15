import { readBody } from "../../../shared/http/readBody.js";
import { json } from "../../../shared/http/json.js";
import { list } from "../service/list.js";
import { analyze } from "../service/analyze.js";
import { digest } from "../service/digest.js";
import { saveAnalysis, getAnalysis, listAnalyses } from "../repository/analysis.js";

const handleGhtrendingApi = async (req, res, path) => {
  if (path === "/apps/ghtrending/list" && req.method === "GET") {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const language = url.searchParams.get("language") || "";
    const since = url.searchParams.get("since") || "weekly";
    const data = await list({ language, since });
    return json(res, data);
  }
  if (path === "/apps/ghtrending/analyze" && req.method === "POST") {
    const body = await readBody(req);
    const repo = body.repo;
    const existing = repo.id ? getAnalysis(repo.id) : null;
    if (existing) return json(res, { success: true, analysis: existing.analysis });
    const data = await analyze(body);
    if (repo.id && data.analysis) {
      saveAnalysis({
        repoId: repo.id, repoName: repo.name, repoUrl: repo.url,
        repoDescription: repo.description, repoLanguage: repo.language,
        repoStars: repo.stars, repoAvatar: repo.avatar, analysis: data.analysis
      });
    }
    return json(res, data);
  }
  if (path === "/apps/ghtrending/digest" && req.method === "POST") {
    const body = await readBody(req);
    return json(res, await digest({ list: body.list || "" }));
  }
  if (path === "/apps/ghtrending/check" && req.method === "POST") {
    const body = await readBody(req);
    const ids = body.ids || [];
    const result: Record<string, any> = {};
    for (const id of ids) {
      const row = getAnalysis(id);
      if (row) result[id] = row.analysis;
    }
    return json(res, { success: true, analyses: result });
  }
  if (path === "/apps/ghtrending/history" && req.method === "GET") {
    return json(res, { success: true, analyses: listAnalyses() });
  }
  return false;
};

export { handleGhtrendingApi };
