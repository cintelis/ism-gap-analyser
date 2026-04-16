import { useState, useCallback, useEffect } from "react";
import { fetchBaseline } from "../lib/fetchBaseline.js";

export function useCurrentISM() {
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [cacheStatus, setCacheStatus] = useState(null);

  const loadCurrentISM = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCacheStatus(null);
    setLoadingMessage("Fetching current ISM PROTECTED baseline...");
    try {
      const { data, cacheStatus: status } = await fetchBaseline("main");
      setCurrentData(data);
      setCacheStatus(status);
    } catch (err) {
      setError(
        `Failed to load current ISM: ${err.message}. Check your network connection and try again.`
      );
    } finally {
      setLoadingMessage("");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentISM();
  }, [loadCurrentISM]);

  return { currentData, loading, error, loadingMessage, setError, cacheStatus };
}
