import { useState, useCallback, useEffect } from "react";
import { cacheGet, cachePut, isFresh } from "../lib/idbCache.js";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1h
const URL = "/api/ism/PROTECTED";

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
      const cached = await cacheGet(URL);
      if (cached && isFresh(cached, CACHE_TTL_MS)) {
        setCurrentData(cached.body);
        setCacheStatus("hit");
        return;
      }

      const headers = {};
      if (cached?.etag) headers["If-None-Match"] = cached.etag;

      const resp = await fetch(URL, { headers });
      if (resp.status === 304 && cached) {
        await cachePut(URL, { ...cached, cachedAt: Date.now() });
        setCurrentData(cached.body);
        setCacheStatus("hit");
        return;
      }
      if (!resp.ok) throw new Error(`Failed to fetch: ${resp.status} ${resp.statusText}`);
      const data = await resp.json();
      await cachePut(URL, {
        body: data,
        etag: resp.headers.get("x-upstream-etag") || resp.headers.get("etag") || "",
        lastModified:
          resp.headers.get("x-upstream-last-modified") || resp.headers.get("last-modified") || "",
        cachedAt: Date.now(),
      });
      setCurrentData(data);
      setCacheStatus("miss");
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
