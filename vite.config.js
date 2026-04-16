import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist" },
  server: {
    proxy: {
      "/api/repo-stats": {
        target: "https://api.github.com",
        changeOrigin: true,
        rewrite: () => "/repos/cintelis/ism-gap-analyser",
        headers: { "user-agent": "ism-gap-analyser-dev" },
      },
      "/api/ism/releases": {
        target: "https://api.github.com",
        changeOrigin: true,
        rewrite: () => "/repos/AustralianCyberSecurityCentre/ism-oscal/releases?per_page=100",
        headers: { "user-agent": "ism-gap-analyser-dev" },
      },
      "^/api/ism/[^/]+$": {
        target: "https://raw.githubusercontent.com",
        changeOrigin: true,
        rewrite: (path) => {
          const [bare, query = ""] = path.split("?");
          const profile = bare.replace(/^\/api\/ism\//, "");
          const params = new URLSearchParams(query);
          const ref = params.get("ref") || "main";
          return `/AustralianCyberSecurityCentre/ism-oscal/${ref}/ISM_${profile}-baseline-resolved-profile_catalog.json`;
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.js"],
    css: false,
  },
});
