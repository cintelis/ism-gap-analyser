import { useState, useEffect } from "react";

let cached = null;

export function useGuidelines() {
  const [data, setData] = useState(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return;
    (async () => {
      try {
        const resp = await fetch("/guidelines.json");
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        cached = json.sections || {};
        setData(cached);
      } catch {
        cached = {};
        setData(cached);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { sections: data, loading };
}
