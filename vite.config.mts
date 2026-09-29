import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const PORT = 5176;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export default defineConfig({
  plugins: [
    federation({
      name: "care_sbiepay",
      filename: "remoteEntry.js",
      exposes: {
        "./manifest": "./src/manifest.ts",
      },
      shared: ["react", "react-dom", "react-i18next", "@tanstack/react-query"],
    }),
    tailwindcss(),
    react(),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: {
      external: [],
      input: {
        main: "./src/index.ts",
      },
      output: {
        format: "esm",
      },
      onwarn(warning, warn) {
        if (
          warning.code === "INVALID_ANNOTATION" &&
          warning.id?.includes("/node_modules/zod/")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: PORT,
    allowedHosts: true,
    host: "0.0.0.0",
    cors: true,
    headers: corsHeaders,
  },
  preview: {
    port: PORT,
    allowedHosts: true,
    host: "0.0.0.0",
    headers: corsHeaders,
  },
});
