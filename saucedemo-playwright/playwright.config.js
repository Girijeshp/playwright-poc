const { defineConfig, devices } = require('@playwright/test');
const config = require('./utils/config');

module.exports = defineConfig({
  testDir: './tests',
  outputDir: 'test-results',

  // Each test gets its own isolated browser context, so tests can safely run in parallel
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,

  timeout: 30_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    baseURL: config.baseUrl,
    testIdAttribute: 'data-test', // lets page objects use getByTestId() for SauceDemo's data-test attributes
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  // npm scripts select one project with --project=chromium; plain "npx playwright test" runs all three
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
