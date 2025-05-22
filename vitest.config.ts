import type {} from "vitest"

import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    env: {
      NEXT_PUBLIC_RAINBOW_PROJECT_ID: "test-project-id",
    },
  },
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./src/components"),
      "@lib": resolve(__dirname, "./src/lib"),
      "@styles": resolve(__dirname, "./src/styles"),
    },
  },
})
