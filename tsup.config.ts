import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  platform: "neutral",
  target: "es2022",
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  banner: {
    js: "/*! Code: MIT. Country data: CC BY-SA 4.0, lukes and contributors. See NOTICE.md. */",
  },
});
