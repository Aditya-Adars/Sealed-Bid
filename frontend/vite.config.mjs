import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@midnight-ntwrk/ledger-v8": resolve("node_modules/@midnight-ntwrk/ledger-v8/midnight_ledger_wasm.js")
    }
  },
  plugins: [react(), wasm(), nodePolyfills()],
  optimizeDeps: {
    force: true,
    exclude: ["@midnight-ntwrk/ledger-v8"],
    include: [
      "@midnight-ntwrk/compact-js",
      "@midnight-ntwrk/compact-runtime",
      "@midnight-ntwrk/midnight-js-contracts",
      "@midnight-ntwrk/midnight-js-fetch-zk-config-provider",
      "@midnight-ntwrk/midnight-js-network-id",
      "midnight-wallet-kit"
    ]
  },
  build: {
    target: "esnext"
  },
  server: { port: 5173 }
});
