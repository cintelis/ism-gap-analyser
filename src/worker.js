const GITHUB_RAW = "https://raw.githubusercontent.com/AustralianCyberSecurityCentre/ism-oscal";
const GITHUB_API_RELEASES =
  "https://api.github.com/repos/AustralianCyberSecurityCentre/ism-oscal/releases?per_page=100";
const PROFILES = new Set(["PROTECTED"]);
const SAFE_REF = /^[A-Za-z0-9._-]+$/;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/ism/releases") return handleReleases(ctx);
    if (url.pathname.startsWith("/api/ism/")) return handleISM(url, request, ctx);
    return env.ASSETS.fetch(request);
  },
};

async function handleISM(url, request, ctx) {
  const profile = url.pathname.slice("/api/ism/".length);
  if (!PROFILES.has(profile)) return json({ error: "Unknown profile", profile }, 404);

  const ref = url.searchParams.get("ref") || "main";
  if (!SAFE_REF.test(ref)) return json({ error: "Invalid ref" }, 400);

  const cacheKey = new Request(url.toString(), request);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const upstream = `${GITHUB_RAW}/${ref}/ISM_${profile}-baseline-resolved-profile_catalog.json`;
  let resp;
  try {
    resp = await fetch(upstream, { cf: { cacheTtl: 3600, cacheEverything: true } });
  } catch (err) {
    return json({ error: "Upstream fetch failed", detail: String(err) }, 502);
  }
  if (resp.status === 404) return json({ error: "Release not found", ref }, 404);
  if (!resp.ok) return json({ error: "Upstream error", status: resp.status }, 502);

  const body = await resp.arrayBuffer();
  const out = new Response(body, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
      "access-control-allow-origin": "*",
      "x-upstream-etag": resp.headers.get("etag") ?? "",
      "x-upstream-last-modified": resp.headers.get("last-modified") ?? "",
      "x-ism-ref": ref,
    },
  });
  ctx.waitUntil(cache.put(cacheKey, out.clone()));
  return out;
}

async function handleReleases(ctx) {
  const cache = caches.default;
  const cacheKey = new Request("https://ism-gap-analyser.cache/releases");
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  let resp;
  try {
    resp = await fetch(GITHUB_API_RELEASES, {
      headers: {
        "user-agent": "ism-gap-analyser-worker",
        accept: "application/vnd.github+json",
      },
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
  } catch (err) {
    return json({ error: "GitHub API fetch failed", detail: String(err) }, 502);
  }
  if (!resp.ok) return json({ error: "GitHub API error", status: resp.status }, 502);

  const raw = await resp.json();
  const simplified = (Array.isArray(raw) ? raw : [])
    .filter((r) => !r.draft)
    .map((r) => ({
      tag: r.tag_name,
      name: r.name || r.tag_name,
      published: r.published_at,
      prerelease: !!r.prerelease,
      url: r.html_url,
    }));

  const out = new Response(JSON.stringify(simplified), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
      "access-control-allow-origin": "*",
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
