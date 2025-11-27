import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],

  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },

  // -----------------------
  // PRODUCTION OPTIMIZATION
  // -----------------------
  build: {
    sourcemap: false, // ❌ no .map files → cannot view original code
    minify: "esbuild", // ⚡ fastest minifier
    cssMinify: true, // remove unused CSS
    target: "esnext",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },

  // -----------------------
  // DEV SERVER CONFIG
  // -----------------------
  server: {
    port: 5173,
    strictPort: true,
  },

  // -----------------------
  // RESOLVE ALIASES (optional)
  // -----------------------
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
