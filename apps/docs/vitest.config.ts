import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: [
      // Specific path aliases — must come before any catch-all prefix aliases.
      // These mirror the tsconfig paths.
      { find: /^@jscad\/builder$/, replacement: resolve(__dirname, "src/@jscad/builder/index.ts") },
      { find: /^@jscad\/builder\/(.*)$/, replacement: resolve(__dirname, "src/@jscad/builder/$1") },
      { find: /^@jscad\/(?!modeling|stl-serializer)(.*)$/, replacement: resolve(__dirname, "src/@jscad/$1") },
      { find: "@pocs", replacement: resolve(__dirname, "src/pocs") },
      { find: "@charts", replacement: resolve(__dirname, "src/charts") },
      { find: "@components", replacement: resolve(__dirname, "src/components") },
      { find: "@utils", replacement: resolve(__dirname, "src/utils") },
    ],
  },
  test: {
    environment: "node",
  },
});
