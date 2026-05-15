const GH_API = "https://api.github.com";

const list = async ({ language = "", since = "daily" } : any = {}) => {
  const date = new Date(Date.now() - (since === "weekly" ? 7 : since === "monthly" ? 30 : 1) * 86400000);
  const dateStr = date.toISOString().split("T")[0];
  let q = `created:>${dateStr} stars:>5`;
  if (language) q += ` language:${language}`;
  const url = `${GH_API}/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=30`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "AIOS-App" } });
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  const data = await res.json();
  return {
    success: true,
    repos: (data.items || []).map((r) => ({
      id: r.id, name: r.full_name, description: r.description || "",
      stars: r.stargazers_count, forks: r.forks_count, language: r.language || "",
      url: r.html_url, owner: r.owner?.login, avatar: r.owner?.avatar_url,
      createdAt: r.created_at
    }))
  };
};

export { list };
