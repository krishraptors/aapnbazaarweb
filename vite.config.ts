import { defineConfig } from "vite";
import { miaodaDevPlugin } from "miaoda-sc-plugin";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    miaodaDevPlugin(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (id.includes("motion")) {
            return "motion";
          }

          if (id.includes("@radix-ui")) {
            return "radix";
          }

          if (id.includes("lucide-react")) {
            return "icons";
          }

          if (id.includes("qrcode")) {
            return "qrcode";
          }

          if (id.includes("@supabase")) {
            return "supabase";
          }

          if (id.includes("axios")) {
            return "network";
          }

          return "vendor";
        },
      },
    },
  },
});
