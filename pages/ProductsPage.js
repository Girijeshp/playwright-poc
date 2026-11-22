const { test } = require('@playwright/test');
const BasePage = require('./BasePage');
const { parseMoney } = require('../utils/money');

/** Values of the sort dropdown on the products page. */
const SortOption = Object.freeze({
  NAME_ASC: 'az',
  NAME_DESC: 'za',
  PRICE_ASC: 'lohi',
  PRICE_DESC: 'hilo',
});

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    this.productNames = page.getByTestId('inventory-item-name');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge'); // absent while the cart is empty
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  /** The product card containing exactly this product name (no brittle absolute selectors). */
  productCard(productName) {
    return this.page
      .getByTestId('inventory-item')
      .filter({ has: this.page.getByText(productName, { exact: true }) });
  }

  addToCartButton(productName) {
    return this.productCard(productName).getByRole('button', { name: 'Add to cart' });
  }

  removeButton(productName) {
    return this.productCard(productName).getByRole('button', { name: 'Remove' });
  }

  async getProductNames() {
    await this.productNames.first().waitFor();
    return this.productNames.allInnerTexts();
  }

  /** Prices as displayed, e.g. "$29.99". */
  async getProductPrices() {
    await this.productPrices.first().waitFor();
    return this.productPrices.allInnerTexts();
  }

  async getProductPrice(productName) {
    return this.productCard(productName).getByTestId('inventory-item-price').innerText();
  }

  async getProductPriceValue(productName) {
    return parseMoney(await this.getProductPrice(productName));
  }

  async sortBy(option) {
    await test.step(`Sort products by '${option}'`, async () => {
      await this.sortDropdown.selectOption(option);
    });
  }

  /** Adds the product and waits until its button flips to "Remove". */
  async addToCart(productName) {
    await test.step(`Add '${productName}' to the cart`, async () => {
      await this.addToCartButton(productName).click();
      await this.removeButton(productName).waitFor();
    });
  }

  async addProductsToCart(productNames) {
    for (const name of productNames) {
      await this.addToCart(name);
    }
  }

  /** Removes the product and waits until its button flips back to "Add to cart". */
  async removeFromCart(productName) {
    await test.step(`Remove '${productName}' from the cart`, async () => {
      await this.removeButton(productName).click();
      await this.addToCartButton(productName).waitFor();
    });
  }

  async openCart() {
    await test.step('Open the cart', async () => {
      await this.cartLink.click();
    });
  }
}

module.exports = ProductsPage;
module.exports.SortOption = SortOption;
