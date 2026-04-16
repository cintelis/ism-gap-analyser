import { useState, useEffect } from "react";

export function useReleases() {
  const [releases, setReleases] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch("/api/ism/releases");
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const list = await resp.json();
        if (cancelled) return;
        const sorted = Array.isArray(list)
          ? [...list].sort((a, b) => (b.published || "").localeCompare(a.published || ""))
          : [];
        setReleases(sorted);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { releases, loading, error };
}
