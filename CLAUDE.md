# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # Production build → dist/
npm run preview   # Preview built output
npm run deploy    # vite build && wrangler deploy (Cloudflare Workers)
```

No test suite, linter, or type-checker is configured. There is no TypeScript — plain JSX only.

First-time Cloudflare deploy requires `npx wrangler login`.

## Architecture

Single-page React 19 app served as static assets by a Cloudflare Worker. The Worker config (`wrangler.jsonc`) does nothing but publish `./dist` — there is no server-side code.

**All logic lives in `src/App.jsx`** (~840 lines). Keep it monolithic; extract sub-components only when complexity warrants. `src/main.jsx` is just the React bootstrap.

### Data flow

1. On load / profile change, the app fetches OSCAL JSON baselines from `raw.githubusercontent.com/AustralianCyberSecurityCentre/ism-oscal/main` (constant `GITHUB_BASE`). This is the "current" ISM.
2. The user uploads a previous OSCAL resolved-profile catalog (or clicks "Use Sample (Demo)"). This is the "previous" ISM.
3. `extractControls()` walks `catalog.groups` (recursively) and `catalog.controls`, flattening into a single array tagged with `groupTitle` / `groupId`.
4. Gap diff is computed client-side by comparing control IDs between the two catalogs. New = gap to address (green), removed = no longer required (red).
5. Export is synthesised client-side as CSV or TXT — no backend involved.

### OSCAL parsing helpers

`getControlProp` / `getControlProps` / `getControlDescription` / `getControlRevision` / `getControlGuideline` abstract OSCAL's nested `props` (name/ns/value) and `parts` (statement/overview/guideline) structures. Use these rather than reaching into `control.props`/`control.parts` directly — the ISM namespace is `https://www.cyber.gov.au/ism/oscal/v1`.

### Profiles

`CLASSIFICATIONS` (Non-Classified → TOP SECRET) and `E8_LEVELS` (ML1–ML3) are defined at the top of `App.jsx` with their display colours. The selected profile determines which OSCAL baseline file is fetched from GitHub.

## Conventions

- React functional components + hooks only
- ES modules, plain JSX (no TypeScript, no JSX type annotations)
- Styling is inline / CSS-in-JS — no Tailwind, no external CSS framework
- Monospace for control IDs; green = added, red = removed across the UI
