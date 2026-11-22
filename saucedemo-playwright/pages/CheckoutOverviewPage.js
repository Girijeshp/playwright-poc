const { test } = require('@playwright/test');
const BasePage = require('./BasePage');
const { parseMoney } = require('../utils/money');

/** Checkout step two: "Overview" with the item list and totals. */
class CheckoutOverviewPage extends BasePage {
  constructor(page) {
    super(page);
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.itemTotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
  }

  async getItemNames() {
    return this.itemNames.allInnerTexts();
  }

  /** "Item total: $39.98" gives 39.98 */
  async getItemTotal() {
    return parseMoney(await this.itemTotalLabel.innerText());
  }

  async getTax() {
    return parseMoney(await this.taxLabel.innerText());
  }

  async getTotal() {
    return parseMoney(await this.totalLabel.innerText());
  }

  async finish() {
    await test.step('Finish the order', async () => {
      await this.finishButton.click();
    });
  }
}

module.exports = CheckoutOverviewPage;
