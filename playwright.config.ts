import { defineConfig, devices } from "@playwright/test";
import { loadEnv } from "utils/env/loadEnv.utils";

loadEnv();

export default defineConfig({
  globalTeardown: require.resolve("./src/config/global.teardown"),
  testDir: "./src/tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 5,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html"],
    ["list"],
    [
      "allure-playwright",
      {
        suiteTitle: false,
        environmentInfo: {
          UI_URL: process.env.SALES_PORTAL_URL,
          API_URL: process.env.SALES_PORTAL_API_URL,
        },
      },
    ],
  ],
  use: {
    trace: "on",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  expect: {
    toHaveScreenshot: {
      // pathTemplate: "{testDir}/__screenshots__{/projectName}/{testFilePath}/{arg}{ext}",
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      use: { ...devices["Desktop Chrome"] },
      testDir: "src/tests/ui/sales-portal",
      testMatch: /\.setup\.ts/,
    },
    {
      name: "sales-portal-ui",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        storageState: "src/.auth/user.json",
      },
      dependencies: ["setup"],
      testDir: "src/tests/ui/sales-portal",
    },
    {
      name: "sales-portal-api",
      use: {
        ...devices["Desktop Chrome"],
      },
      testDir: "src/tests/api",
    },
    {
      name: "sales-portal-visual",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        storageState: "src/.auth/user.json",
      },
      dependencies: ["setup"],
      testDir: "src/tests/ui/sales-portal/visual",
    },
  ],
});
