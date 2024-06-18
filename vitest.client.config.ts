import react from '@vitejs/plugin-react';
import { join } from "path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['**/test/client/**/*.test.{js,tsx,ts}'],
    exclude: [...configDefaults.exclude, "**/e2e/**"],
    environment: "jsdom",
    setupFiles: './test/client/setup.ts',
  },
  resolve: {
    alias: {
      "~/": join(__dirname, "./src/"),
    },
  },
});