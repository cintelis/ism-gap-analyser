# ISM Gap Analyser

A web application for performing gap analysis between current and previous versions of the Australian Information Security Manual (ISM) using OSCAL-formatted control data.

## Features

- Fetches the latest ISM OSCAL baselines directly from the [ASD ISM OSCAL repository](https://github.com/AustralianCyberSecurityCentre/ism-oscal)
- Supports all classification levels: Non-Classified, OFFICIAL: Sensitive, PROTECTED, SECRET, TOP SECRET
- Supports Essential Eight Maturity Levels: ML1, ML2, ML3
- Upload a previous ISM OSCAL resolved profile catalog to identify new/removed controls
- Search, filter, expand/collapse controls
- Export gap reports as CSV or TXT

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deploy to Cloudflare Workers

### Prerequisites

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up)
2. Node.js 18+ installed

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Login to Cloudflare (first time only)
npx wrangler login

# 3. Build and deploy
npm run deploy
```

That's it. Wrangler will build the Vite project and deploy the static assets to Cloudflare Workers. You'll get a URL like `https://ism-gap-analyser.<your-subdomain>.workers.dev`.

### Custom Domain

To use a custom domain, add it in the Cloudflare dashboard under **Workers & Pages → your worker → Settings → Domains & Routes**, or add to `wrangler.jsonc`:

```jsonc
{
  "name": "ism-gap-analyser",
  "compatibility_date": "2026-04-02",
  "assets": {
    "directory": "./dist"
  },
  "routes": [
    { "pattern": "ism.yourdomain.com", "custom_domain": true }
  ]
}
```

## How to Use

1. **Select classification level** — defaults to PROTECTED
2. **Upload a previous ISM baseline** — download a prior release from [ISM OSCAL releases](https://github.com/AustralianCyberSecurityCentre/ism-oscal/releases), or click "Use Sample (Demo)"
3. **Review the gap** — new controls (green) are your gap; removed controls (red) are no longer required
4. **Export** — download as CSV or TXT for reporting

## Project Structure

```
ism-gap-analyser/
├── index.html              # HTML entry point
├── src/
│   ├── main.jsx            # React bootstrap
│   └── App.jsx             # Main application component
├── vite.config.js          # Vite build configuration
├── wrangler.jsonc          # Cloudflare Workers config
└── package.json
```

## Data Source

ISM OSCAL data is sourced from the [Australian Cyber Security Centre](https://github.com/AustralianCyberSecurityCentre/ism-oscal) under Creative Commons Attribution 4.0 International licence.
