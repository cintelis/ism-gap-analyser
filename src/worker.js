const GITHUB_RAW = "https://raw.githubusercontent.com/AustralianCyberSecurityCentre/ism-oscal";
const GITHUB_API_RELEASES =
  "https://api.github.com/repos/AustralianCyberSecurityCentre/ism-oscal/releases?per_page=100";
const GITHUB_API_REPO = "https://api.github.com/repos/cintelis/ism-gap-analyser";
const PROFILES = new Set(["PROTECTED"]);
const SAFE_REF = /^[A-Za-z0-9._-]+$/;

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
].join("; ");

const SECURITY_HEADERS = {
  "content-security-policy": CSP,
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "x-frame-options": "DENY",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/repo-stats") return withJsonHeaders(await handleRepoStats(ctx));
    if (url.pathname === "/api/ism/releases") return withJsonHeaders(await handleReleases(ctx));
    if (url.pathname.startsWith("/api/ism/"))
      return withJsonHeaders(await handleISM(url, request, ctx));
    const assetResp = await env.ASSETS.fetch(request);
    return withAssetHeaders(assetResp, url);
  },
};

function withAssetHeaders(resp, url) {
  const headers = new Headers(resp.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);

  // Vite emits hashed filenames under /assets/. Treat as immutable.
  if (url.pathname.startsWith("/assets/")) {
    headers.set("cache-control", "public, max-age=31536000, immutable");
  } else {
    // index.html / other routes (SPA) — revalidate so users get the latest build
    headers.set("cache-control", "public, max-age=0, must-revalidate");
  }

  return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers });
}

function withJsonHeaders(resp) {
  const headers = new Headers(resp.headers);
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers });
}

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

async function handleRepoStats(ctx) {
  const cache = caches.default;
  const cacheKey = new Request("https://ism-gap-analyser.cache/repo-stats");
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  let resp;
  try {
    resp = await fetch(GITHUB_API_REPO, {
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

  const data = await resp.json();
  const simplified = {
    stars: data.stargazers_count ?? 0,
    forks: data.forks_count ?? 0,
    watchers: data.subscribers_count ?? 0,
    openIssues: data.open_issues_count ?? 0,
    url: data.html_url,
  };

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
