import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@midnight-ntwrk/ledger-v8": fileURLToPath(
        new URL("./node_modules/@midnight-ntwrk/ledger-v8/midnight_ledger_wasm.js", import.meta.url)
      ),
      "@midnight-ntwrk/onchain-runtime-v3": fileURLToPath(
        new URL("./node_modules/@midnight-ntwrk/onchain-runtime-v3/midnight_onchain_runtime_wasm.js", import.meta.url)
      )
    }
  },
  plugins: [react(), wasm(), nodePolyfills()],
  optimizeDeps: {
    force: true,
    include: [
      "@midnight-ntwrk/compact-js",
      "@midnight-ntwrk/compact-runtime",
      "@midnight-ntwrk/ledger-v8",
      "@midnight-ntwrk/onchain-runtime-v3",
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
