@include ../_agent-instructions/ism-gap-analyser/AGENTS.frontend.md
# ISM Gap Analyser — Agent Instructions

## Deployment

```bash
cd C:\code\ism-gap-analyser
npm run deploy
```

## Architecture

- **Frontend**: React 19 SPA (Vite, JSX)
- **Hosting**: Cloudflare Workers (static assets)
- **Data**: ASD ISM OSCAL baselines fetched from GitHub at runtime
- **Build**: `vite build` → `dist/` → `wrangler deploy`

## Key Conventions

- React functional components with hooks
- ES modules throughout
- No TypeScript (plain JSX)
- OSCAL JSON parsing client-side
- Classification levels: Non-Classified, OFFICIAL: Sensitive, PROTECTED, SECRET, TOP SECRET
- Essential Eight: ML1, ML2, ML3
