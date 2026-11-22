const { test } = require('@playwright/test');
const BasePage = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.items = page.locator('.cart_item');
    this.itemNames = this.items.getByTestId('inventory-item-name');
    this.itemPrices = this.items.getByTestId('inventory-item-price');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.checkoutButton = page.getByTestId('checkout');
  }

  itemRow(productName) {
    return this.items.filter({ has: this.page.getByText(productName, { exact: true }) });
  }

  async getItemNames() {
    return this.itemNames.allInnerTexts();
  }

  /** Prices as displayed, in the same order as getItemNames(). */
  async getItemPrices() {
    return this.itemPrices.allInnerTexts();
  }

  /** Removes the product and waits until its row has disappeared. */
  async removeItem(productName) {
    await test.step(`Remove '${productName}' on the cart page`, async () => {
      const row = this.itemRow(productName);
      await row.getByRole('button', { name: 'Remove' }).click();
      await row.waitFor({ state: 'detached' });
    });
  }

  async continueShopping() {
    await test.step('Continue shopping', async () => {
      await this.continueShoppingButton.click();
    });
  }

  async proceedToCheckout() {
    await test.step('Proceed to checkout', async () => {
      await this.checkoutButton.click();
    });
  }
}

module.exports = CartPage;
