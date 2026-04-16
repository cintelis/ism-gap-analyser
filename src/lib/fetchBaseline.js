import { cacheGet, cachePut, isFresh } from "./idbCache.js";

const CACHE_TTL_MS = 60 * 60 * 1000;

export async function fetchBaseline(ref) {
  const url = ref && ref !== "main" ? `/api/ism/PROTECTED?ref=${encodeURIComponent(ref)}` : "/api/ism/PROTECTED";

  const cached = await cacheGet(url);
  if (cached && isFresh(cached, CACHE_TTL_MS)) {
    return { data: cached.body, cacheStatus: "hit" };
  }

  const headers = {};
  if (cached?.etag) headers["If-None-Match"] = cached.etag;

  const resp = await fetch(url, { headers });
  if (resp.status === 304 && cached) {
    await cachePut(url, { ...cached, cachedAt: Date.now() });
    return { data: cached.body, cacheStatus: "hit" };
  }
  if (!resp.ok) {
    const detail = await resp.text().catch(() => "");
    throw new Error(`Failed to fetch baseline: ${resp.status} ${detail || resp.statusText}`);
  }
  const data = await resp.json();
  await cachePut(url, {
    body: data,
    etag: resp.headers.get("x-upstream-etag") || resp.headers.get("etag") || "",
    lastModified:
      resp.headers.get("x-upstream-last-modified") || resp.headers.get("last-modified") || "",
    cachedAt: Date.now(),
  });
  return { data, cacheStatus: "miss" };
}
