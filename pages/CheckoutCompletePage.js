const { test } = require('@playwright/test');
const BasePage = require('./BasePage');

/** Order confirmation page. */
class CheckoutCompletePage extends BasePage {
  constructor(page) {
    super(page);
    this.confirmationHeader = page.getByTestId('complete-header'); // "Thank you for your order!"
    this.confirmationMessage = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async backToProducts() {
    await test.step('Back to products', async () => {
      await this.backHomeButton.click();
    });
  }
}

module.exports = CheckoutCompletePage;
