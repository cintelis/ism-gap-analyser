import { useState, useCallback, useEffect } from "react";
import { cacheGet, cachePut, isFresh } from "../lib/idbCache.js";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1h

export function useCurrentISM(classification) {
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [cacheStatus, setCacheStatus] = useState(null); // 'hit' | 'miss' | null

  const loadCurrentISM = useCallback(async (classId) => {
    setLoading(true);
    setError(null);
    setCacheStatus(null);
    setLoadingMessage(`Fetching ISM ${classId} baseline...`);
    const url = `/api/ism/${classId}`;
    try {
      const cached = await cacheGet(url);
      if (cached && isFresh(cached, CACHE_TTL_MS)) {
        setCurrentData(cached.body);
        setCacheStatus("hit");
        return;
      }

      const headers = {};
      if (cached?.etag) headers["If-None-Match"] = cached.etag;

      const resp = await fetch(url, { headers });
      if (resp.status === 304 && cached) {
        await cachePut(url, { ...cached, cachedAt: Date.now() });
        setCurrentData(cached.body);
        setCacheStatus("hit");
        return;
      }
      if (!resp.ok) throw new Error(`Failed to fetch: ${resp.status} ${resp.statusText}`);
      const data = await resp.json();
      await cachePut(url, {
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
    loadCurrentISM(classification);
  }, [classification, loadCurrentISM]);

  return { currentData, loading, error, loadingMessage, setError, cacheStatus };
}
