import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        trading: resolve(__dirname, "trading.html"),
        portfolio: resolve(__dirname, "portfolio.html"),
        watchlist: resolve(__dirname, "watchlist.html"),
        research: resolve(__dirname, "research.html"),
        login: resolve(__dirname, "login.html"),
      },
    },
  },
});
