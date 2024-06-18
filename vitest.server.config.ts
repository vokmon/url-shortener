import { join } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ['**/test/server/**/*.test.{js,tsx,ts}'],
    exclude: [...configDefaults.exclude, "**/e2e/**"],
    env: {
      DATABASE_URL: "",
    },
    environment: "node"
  },
  resolve: {
    alias: {
      "~/": join(__dirname, "./src/"),
    },
  },
});