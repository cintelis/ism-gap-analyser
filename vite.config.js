import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist" },
  server: {
    proxy: {
      "/api/ism": {
        target: "https://raw.githubusercontent.com",
        changeOrigin: true,
        rewrite: (path) => {
          const profile = path.replace(/^\/api\/ism\//, "");
          return `/AustralianCyberSecurityCentre/ism-oscal/main/ISM_${profile}-baseline-resolved-profile_catalog.json`;
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
