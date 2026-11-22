const { test } = require('@playwright/test');
const BasePage = require('./BasePage');

/** Checkout step one: "Your Information". */
class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.errorMessage = page.getByTestId('error');
  }

  /**
   * Fills the form and clicks Continue. If a field is blank the page stays here and shows an error,
   * which tests then assert on via errorMessage.
   */
  async submitCustomerInformation({ firstName, lastName, postalCode }) {
    await test.step('Submit customer information', async () => {
      await this.firstNameInput.fill(firstName);
      await this.lastNameInput.fill(lastName);
      await this.postalCodeInput.fill(postalCode);
      await this.continueButton.click();
    });
  }
}

module.exports = CheckoutPage;
