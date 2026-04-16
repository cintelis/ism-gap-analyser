import { useState, useEffect } from "react";

let cached = null;

function normalise(raw) {
  if (!raw) return null;
  return {
    stars: raw.stars ?? raw.stargazers_count ?? 0,
    forks: raw.forks ?? raw.forks_count ?? 0,
    watchers: raw.watchers ?? raw.subscribers_count ?? 0,
    openIssues: raw.openIssues ?? raw.open_issues_count ?? 0,
    url: raw.url || raw.html_url || "https://github.com/cintelis/ism-gap-analyser",
  };
}

export function useRepoStats() {
  const [stats, setStats] = useState(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return;
    (async () => {
      try {
        const resp = await fetch("/api/repo-stats");
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        cached = normalise(data);
        setStats(cached);
      } catch {
        cached = null;
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { stats, loading };
}
