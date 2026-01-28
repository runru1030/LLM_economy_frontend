import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src/app"),
      "@entities": path.resolve(__dirname, "./src/app/entities"),
      "@pages": path.resolve(__dirname, "./src/app/pages"),
      "@_pages": path.resolve(__dirname, "./src/app/_pages"),
      "@features": path.resolve(__dirname, "./src/app/features"),
      "@widgets": path.resolve(__dirname, "./src/app/widgets"),
      "@shared": path.resolve(__dirname, "./src/app/shared"),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    exclude: ["**/node_modules/**"],
  },
});
