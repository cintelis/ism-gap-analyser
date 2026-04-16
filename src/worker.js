const GITHUB_BASE =
  "https://raw.githubusercontent.com/AustralianCyberSecurityCentre/ism-oscal/main";

const PROFILES = new Set(["PROTECTED"]);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/ism/")) return handleISM(url, request, ctx);
    return env.ASSETS.fetch(request);
  },
};

async function handleISM(url, request, ctx) {
  const profile = url.pathname.slice("/api/ism/".length);
  if (!PROFILES.has(profile)) {
    return json({ error: "Unknown profile", profile }, 404);
  }

  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const upstream = `${GITHUB_BASE}/ISM_${profile}-baseline-resolved-profile_catalog.json`;
  let resp;
  try {
    resp = await fetch(upstream, { cf: { cacheTtl: 3600, cacheEverything: true } });
  } catch (err) {
    return json({ error: "Upstream fetch failed", detail: String(err) }, 502);
  }
  if (!resp.ok) {
    return json({ error: "Upstream error", status: resp.status }, 502);
  }

  const body = await resp.arrayBuffer();
  const out = new Response(body, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
      "access-control-allow-origin": "*",
      "x-upstream-etag": resp.headers.get("etag") ?? "",
      "x-upstream-last-modified": resp.headers.get("last-modified") ?? "",
    },
  });
  ctx.waitUntil(cache.put(cacheKey, out.clone()));
  return out;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
    },
  });
}
