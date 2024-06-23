import { join } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/test/server/**/*.test.{js,tsx,ts}"],
    exclude: [...configDefaults.exclude, "**/e2e/**"],
    env: {
      DATABASE_URL:
        "postgres://root:test@localhost:16533/defaultdb?sslmode=require",
    },
    environment: "node",
    coverage: {
      reportsDirectory: "./coverage/server",
      include: ['**/server/api/routers/**'],
    },
  },
  resolve: {
    alias: {
      "~/": join(__dirname, "./src/"),
    },
  },
});
