import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "query-vendor": [
            "@tanstack/react-query",
            "@tanstack/react-query-devtools",
          ],
          "xlsx-vendor": ["xlsx"],
          "pdf-vendor": ["jspdf", "jspdf-autotable"],
          "icons-vendor": ["lucide-react"],
        },
      },
    },
  },
});
