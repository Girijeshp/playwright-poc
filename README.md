# SauceDemo Playwright Automation Framework

End-to-end UI test automation for [SauceDemo](https://www.saucedemo.com/) built with **Playwright, JavaScript (Node.js) and the Page Object Model**. It is the Playwright counterpart of a Java / Selenium / TestNG framework that covers the same business flows with the same 28 tests.

## What is covered

| Area | Tests | Scenarios |
|---|---|---|
| Login | 7 | Valid login, wrong password, unknown user, empty fields, empty password, locked-out user (data-driven from `test-data/loginData.json`) |
| Products | 10 | Page displayed, names and prices shown, four sort orders checked against the displayed values, add / remove, cart badge |
| Cart | 6 | Open cart, products and prices match, item count, remove item, continue shopping, proceed to checkout |
| Checkout | 5 | Full end-to-end order, overview item total / tax / total, missing first name / last name / postal code |

## Project structure

```
pages/        BasePage, LoginPage, ProductsPage, CartPage, CheckoutPage, CheckoutOverviewPage, CheckoutCompletePage
fixtures/     fixtures.js - page-object fixtures and the logged-in products page
tests/        login / products / cart / checkout .spec.js
test-data/    constants.js, groups.js (tags), loginData.json
utils/        config.js (environment config), money.js
scripts/      summary.js (results table for the CI job summary)
playwright.config.js
.github/      workflows/playwright.yml, dependabot.yml
```

Design points:
- **Page objects** hold locators and business actions only. **Assertions stay in the tests.** Locators are exposed as read-only properties so tests can use Playwright's auto-retrying `expect(locator)` assertions.
- **Locators** use `getByTestId` (configured for SauceDemo's `data-test` attribute) and `getByRole`. There is no XPath and no absolute selector.
- **No explicit waits or sleeps.** Playwright auto-waits for elements to be actionable, and web-first assertions retry until they pass or time out.
- **Isolation:** every test gets a fresh browser context, so tests are independent and run in parallel safely.
- **Fixtures** (`fixtures/fixtures.js`) create the page objects and provide `loggedInProductsPage`, which logs in once as a precondition.
- **Reporting:** `test.step` in the page objects gives a readable step tree in the HTML report. Failed tests keep a screenshot and video, and a trace is recorded on the first retry.

## Prerequisites

Node.js 20 or newer.

```bash
npm install
npx playwright install chromium
```

## Running the tests

| Command | What it does |
|---|---|
| `npm test` | Full regression (all 28 tests) in Chromium |
| `npm run test:smoke` | Smoke group (4 tests) |
| `npm run test:sanity` | Sanity group (15 tests, includes smoke) |
| `npm run test:regression` | Regression group (28 tests) |
| `npm run test:headed` | Visible browser window |
| `npm run test:ui` | Playwright UI mode (watch, debug, time travel) |
| `npm run test:all-browsers` | Chromium, Firefox and WebKit (run `npx playwright install` first) |
| `npm run report` | Open the last HTML report |

Run one test by name: `npx playwright test --project=chromium -g "valid user can login"`.

### Groups

Tests are tagged and selected with `--grep`:

| Tag | Contents |
|---|---|
| `@smoke` | Critical path: login, products page, add to cart, full checkout |
| `@sanity` | Smoke plus the main cart, checkout and login checks |
| `@regression` | Every test |

Tag a new test with `test('name', { tag: SANITY }, ...)` using the arrays in `test-data/groups.js`.

### Parallel execution

`fullyParallel: true` with 4 workers locally and 2 on CI (see `playwright.config.js`). Set `workers: 1` for a sequential run.

## Configuration

Set environment variables to override the defaults (see `utils/config.js`):

| Variable | Default |
|---|---|
| `BASE_URL` | https://www.saucedemo.com/ |
| `SAUCE_USERNAME` | standard_user (public SauceDemo demo account) |
| `SAUCE_PASSWORD` | secret_sauce |

PowerShell: `$env:BASE_URL="https://example.test/"; npm test`. Bash: `BASE_URL=https://example.test/ npm test`.

## Reports

- HTML report: `playwright-report/index.html` (open with `npm run report`)
- Screenshots, videos and traces: `test-results/`
- Machine-readable: `test-results/results.json` and `test-results/junit.xml`

Open a trace with `npx playwright show-trace <path-to-trace.zip>`.

## CI/CD (GitHub Actions)

Workflow: `.github/workflows/playwright.yml`

| Trigger | Group | Browsers |
|---|---|---|
| Pull request | `@smoke` (fast feedback) | Chromium |
| Push to `main` | `@regression` | Chromium |
| Nightly (07:00 IST) | `@regression` | Chromium, Firefox and WebKit |
| Manual run | your choice of group | Chromium |

Every run writes a results table to the job summary and uploads `playwright-report-<browser>` and `test-results-<browser>` (traces, screenshots, videos) even when tests fail, kept for 14 days. On `main`, the `publish-report` job publishes the latest HTML report to GitHub Pages. One-time setup: **Settings > Pages > Build and deployment > Source: GitHub Actions**. GitHub Pages on a private repository needs a paid plan.

Dependabot (`.github/dependabot.yml`) opens weekly pull requests for npm packages and GitHub Actions versions.

## Selenium to Playwright mapping

| Selenium / Java framework | Playwright / JavaScript equivalent |
|---|---|
| `DriverFactory` (ThreadLocal driver) + `BaseTest` | Built-in browser contexts per test + `fixtures/fixtures.js` |
| `WaitUtils` (explicit waits) | Auto-waiting locators and retrying `expect` |
| `ConfigReader` + `config.properties` | `utils/config.js` + environment variables |
| Excel data + `@ExcelData` + data provider | `test-data/loginData.json`, one generated test per row (`execute: "N"` rows are skipped) |
| TestNG groups and suite XMLs | Tags (`@smoke`, `@sanity`, `@regression`) and `--grep` |
| `parallel="classes"` in `testng.xml` | `fullyParallel` and `workers` in `playwright.config.js` |
| ExtentReports + `TestListener` + `ScreenshotUtils` | Built-in HTML reporter, `screenshot`, `video` and `trace` settings |
| Log4j2 | `test.step` entries in the report |
| Maven Surefire + GitHub Actions | npm scripts + GitHub Actions |

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Executable doesn't exist` | Run `npx playwright install chromium` |
| `npx` or `npm` not recognized | Install Node.js 20+ from nodejs.org and open a new terminal |
| A test fails only in CI | Download the `test-results-<browser>` artifact and open the trace with `npx playwright show-trace` |
| Locator timeout after a SauceDemo UI change | Run `npx playwright test --ui`, or `npx playwright codegen https://www.saucedemo.com/` to inspect the current attributes |
