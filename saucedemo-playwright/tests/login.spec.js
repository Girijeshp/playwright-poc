const { test, expect } = require('../fixtures/fixtures');
const config = require('../utils/config');
const loginData = require('../test-data/loginData.json');
const { SMOKE, SANITY } = require('../test-data/groups');

test.describe('Login', () => {
  test('valid user can login', { tag: SMOKE }, async ({ loginPage, productsPage, page }) => {
    await loginPage.goto();
    await loginPage.login(config.username, config.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(productsPage.title).toHaveText('Products');
  });

  // Data-driven scenarios (the equivalent of the Excel-driven verifyLogin). Rows with execute=N are skipped.
  for (const row of loginData.filter((r) => r.execute.toUpperCase() === 'Y')) {
    test(`${row.testCaseId} - ${row.scenario}`, { tag: SANITY }, async ({ loginPage, productsPage, page }) => {
      await loginPage.goto();
      await loginPage.login(row.username, row.password);

      if (row.expectedResult === 'PASS') {
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(productsPage.title).toHaveText('Products');
      } else if (row.expectedResult === 'FAIL') {
        await expect(loginPage.errorMessage).toHaveText(row.expectedMessage);
        await expect(page).not.toHaveURL(/inventory\.html/);
      } else {
        throw new Error(`expectedResult must be PASS or FAIL but was '${row.expectedResult}' in ${row.testCaseId}`);
      }
    });
  }
});
