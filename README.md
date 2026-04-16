# ISM Gap Analyser

> Compare the latest Australian ISM PROTECTED baseline against prior releases — built for IRAP assessment prep.

**Live:** [irap.cintelis.ai](https://irap.cintelis.ai)

A single-page web app that performs a side-by-side diff between the current Australian Information Security Manual (ISM) OSCAL catalog and any historical release. Highlights new, removed, and modified controls so IRAP assessors and system owners can see exactly what's changed between assessment cycles.

## Features

- **Latest-vs-prior diff** — baseline is always the current ISM on `main`; pick any tagged release as the comparison point
- **Modified-control detection** — not just add/remove: same-ID controls with changed wording or props surface as `MODIFIED` with a word-level diff view
- **Inline ASD guidelines** — click the ⓘ on any control group to open a drawer with the official ASD guideline text (scraped from cyber.gov.au, CC BY 4.0)
- **Exports** — TXT, CSV, JSON (versioned schema), and print-to-PDF via browser
- **All client-side** — no backend, no tracking, no evidence leaves your machine. Just `fetch` a baseline, diff in the browser, export locally.
- **Edge-cached** — Cloudflare Worker proxies GitHub so you don't hit rate limits

## Stack

| Layer | Tool |
|---|---|
| Frontend | React 19, Vite, plain JSX |
| Worker / proxy | Cloudflare Workers (single file `src/worker.js`) |
| Client cache | IndexedDB with ETag revalidation |
| Persisted UI state | localStorage (filter, expanded cards) |
| Styling | Inline styles + minimal global CSS, no framework |
| Tests | Vitest + React Testing Library |
| CI | GitHub Actions → Cloudflare Workers deploy |

## Data sources

- **Control catalogs**: [AustralianCyberSecurityCentre/ism-oscal](https://github.com/AustralianCyberSecurityCentre/ism-oscal) — CC BY 4.0
- **Guideline text**: [cyber.gov.au](https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/ism/cyber-security-guidelines) — CC BY 4.0
- **Releases list**: GitHub Releases API, cached 1h at the edge

## Running locally

```bash
# Prereqs: Node 20+, npm
npm install
npm run dev           # Vite dev server on :5173 with /api proxy to GitHub
```

Other scripts:

```bash
npm test              # Vitest
npm run lint          # ESLint
npm run build         # Production build → dist/
npm run deploy        # vite build && wrangler deploy
```

## Updating guideline data

The `public/guidelines.json` is extracted from cyber.gov.au once per ISM release:

```bash
node scripts/extract-guidelines.mjs
```

Re-run after each ISM release (typically March and September). Commits the updated JSON.

## Deploying your own instance

1. Fork the repo
2. `npx wrangler login` once, then `npm run deploy`
3. (Optional) Add a custom domain in the Cloudflare dashboard
4. (Optional) Set repo secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` to enable auto-deploy on push to `main` via `.github/workflows/deploy.yml`

## Scope

This tool is scoped to **PROTECTED** classification IRAP prep work only. No Essential Eight ML1/ML2/ML3 views, no SECRET/TOP SECRET, no cross-framework mappings (NIST, ISO). That's a deliberate focus decision — broadening would add clutter without serving the assessor workflow we actually care about.

## Contributing

IRAP assessors, system owners, and OSCAL-curious folks all welcome. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the quick version.

Bug reports and feature ideas: open an issue on [GitHub](https://github.com/cintelis/ism-gap-analyser/issues).

## Security + data residency

The public deployment at `irap.cintelis.ai` is stateless — nothing you do in the app leaves your browser except the initial `fetch` calls for catalog data. If your assessment evidence contains PROTECTED-classified content, you should either:

- Keep using the public tool for the diff / guideline lookup only, and record evidence in your own environment, **or**
- Deploy a private instance in your tenant (PRs welcome if you hit snags adapting for Azure / on-prem)

Cloudflare is IRAP-assessed up to PROTECTED via the [Cloudflare for Government – Australia](https://www.cloudflare.com/en-gb/cloudflare-for-government/australia/irap/) edition, but the public `workers.dev`-hosted version is on standard Cloudflare and does not inherit that assurance.

## License

[MIT](./LICENSE) — free to fork, modify, deploy, sell. Attribution appreciated but not required.

OSCAL catalog data and guideline text are the Commonwealth of Australia's, licensed CC BY 4.0 — do not strip the source links from the guideline drawer or exports.
