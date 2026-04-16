import { useState, useCallback, useEffect } from "react";
import { GITHUB_BASE } from "../theme.js";

export function useCurrentISM(classification) {
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  const loadCurrentISM = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    setLoadingMessage(`Fetching ISM ${classId} baseline...`);
    try {
      const filename = `ISM_${classId}-baseline-resolved-profile_catalog.json`;
      const url = `${GITHUB_BASE}/${filename}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Failed to fetch: ${resp.status} ${resp.statusText}`);
      const data = await resp.json();
      setCurrentData(data);
    } catch (err) {
      setError(`Failed to load current ISM: ${err.message}. Check your network connection and try again.`);
    } finally {
      setLoadingMessage("");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentISM(classification);
  }, [classification, loadCurrentISM]);

  return { currentData, loading, error, loadingMessage, setError };
}
