# Contributing

Thanks for thinking about contributing. Keeping it short.

## What's in scope

- Bug fixes
- IRAP assessor workflow improvements (status tracking, exports, usability for real assessments)
- Better diff/search/filter UX
- Accessibility fixes (keyboard nav, screen readers, colour contrast)
- Performance (IDB cache, lazy loading, smaller bundles)
- Documentation

## What's out of scope (for this repo)

- Other ISM classifications (OFFICIAL:Sensitive, SECRET, TOP SECRET) — this is a PROTECTED-only tool by design
- Essential Eight maturity level views — handled separately by ASD tooling
- Cross-framework mappings (NIST 800-53, ISO 27001)
- Server-side evidence storage / multi-user collaboration — those features live in the commercial Azure fork (different repo)

If your idea falls out of scope for the OSS repo, consider whether it belongs in a fork or as a separate project.

## Getting started

```bash
git clone https://github.com/cintelis/ism-gap-analyser
cd ism-gap-analyser
npm install
npm run dev
```

Open a draft PR early. Reviewers would rather see an incomplete PR and help shape it than receive a finished PR that took the wrong direction.

## Quality gates

Before opening a PR:

```bash
npm run lint        # Must pass
npm test            # Must pass
npm run build       # Must build cleanly
```

CI runs all three on every PR.

## Code style

- ESLint + Prettier configured — run `npm run format` before committing
- React 19, functional components + hooks only, no class components
- Plain JSX, no TypeScript (keeping the barrier to entry low for assessors who want to read the code)
- No CSS framework — inline styles with the `palette` in `src/theme.js`
- Modules stay platform-agnostic: only `src/worker.js` and `wrangler.jsonc` may contain Cloudflare-specific code

## Adding a feature

1. Pure logic → `src/lib/`
2. Stateful hook → `src/hooks/`
3. Presentational component → `src/components/`
4. Keep `src/App.jsx` thin — it orchestrates, doesn't implement
5. If you're adding something that needs a backend, pause and open an issue first — the OSS version is deliberately stateless

## Reporting a bug

Include:
- What you did
- What you expected
- What actually happened
- Browser + OS
- If relevant: which ISM release tag you were comparing against

## License

By contributing, you agree your contributions are released under the [MIT License](./LICENSE).
