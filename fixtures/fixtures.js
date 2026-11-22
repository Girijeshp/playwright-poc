const base = require('@playwright/test');
const config = require('../utils/config');
const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const CheckoutOverviewPage = require('../pages/CheckoutOverviewPage');
const CheckoutCompletePage = require('../pages/CheckoutCompletePage');

const { expect } = base;

/**
 * Fixtures replace BaseTest + DriverFactory from the Selenium version. Playwright creates a fresh,
 * isolated browser context and page for every test and closes it afterwards, even when setup fails.
 */
const test = base.test.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  overviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  completePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  /** Logs in with the configured credentials and returns the products page (a test precondition). */
  loggedInProductsPage: async ({ loginPage, productsPage }, use) => {
    await loginPage.goto();
    await loginPage.login(config.username, config.password);
    await expect(productsPage.title, 'Precondition failed: login did not reach the products page').toHaveText(
      'Products'
    );
    await use(productsPage);
  },
});

module.exports = { test, expect };
