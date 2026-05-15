import { db } from "./client.js";

const saveAnalysis = ({ repoId, repoName, repoUrl, repoDescription, repoLanguage, repoStars, repoAvatar, analysis }) => {
  db.prepare(`
    INSERT OR REPLACE INTO gh_analyses (repo_id, repo_name, repo_url, repo_description, repo_language, repo_stars, repo_avatar, analysis, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(repoId, repoName, repoUrl || '', repoDescription || '', repoLanguage || '', repoStars || 0, repoAvatar || '', analysis);
};

const getAnalysis = (repoId) => {
  return db.prepare("SELECT * FROM gh_analyses WHERE repo_id = ?").get(repoId);
};

const listAnalyses = () => {
  return db.prepare("SELECT * FROM gh_analyses ORDER BY created_at DESC").all();
};

export { saveAnalysis, getAnalysis, listAnalyses };
