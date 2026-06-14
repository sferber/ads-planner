import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "Fokusplan – Tagesplanung bei ADHS",
        short_name: "Fokusplan",
        description:
          "ADHS-freundliche Tagesplanung: flexible Aktivitäten, Ziele, Wenn-Dann-Pläne und Fokus-Modus.",
        theme_color: "#5b8def",
        background_color: "#f7f9fc",
        display: "standalone",
        orientation: "portrait",
        lang: "de",
        start_url: "./",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
      },
    }),
  ],
});
