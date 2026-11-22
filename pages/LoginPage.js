const { test } = require('@playwright/test');
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  async goto() {
    await test.step('Open the login page', async () => {
      await this.page.goto('/');
    });
  }

  /** Logs in. The password is never written into the step title, so it cannot leak into reports. */
  async login(username, password) {
    await test.step(`Log in as '${username}'`, async () => {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    });
  }
}

module.exports = LoginPage;
