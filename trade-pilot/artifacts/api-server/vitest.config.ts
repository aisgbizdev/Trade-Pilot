import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.ts"],
    testTimeout: 20000,
    hookTimeout: 20000,
    pool: "forks",
    fileParallelism: false,
    env: {
      // Disable web-push delivery during tests so the regression suite cannot
      // fan out real push notifications to non-test users.
      VAPID_PUBLIC_KEY: "",
      VAPID_PRIVATE_KEY: "",
    },
  },
});
