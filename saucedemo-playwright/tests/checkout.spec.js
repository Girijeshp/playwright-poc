const { test, expect } = require('../fixtures/fixtures');
const { PRODUCTS, CUSTOMER, TAX_RATE, MONEY_DELTA, MESSAGES } = require('../test-data/constants');
const { SMOKE, SANITY, REGRESSION } = require('../test-data/groups');

const { BACKPACK, BIKE_LIGHT } = PRODUCTS;

test.describe('Checkout', () => {
  test('user can complete checkout', { tag: SMOKE }, async ({
    loggedInProductsPage: productsPage, cartPage, checkoutPage, overviewPage, completePage, page,
  }) => {
    const selected = [BACKPACK, BIKE_LIGHT];
    await productsPage.addProductsToCart(selected);
    await productsPage.openCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await checkoutPage.submitCustomerInformation(CUSTOMER);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(overviewPage.itemNames).toHaveCount(selected.length);
    expect([...(await overviewPage.getItemNames())].sort(), 'Overview shows the wrong products').toEqual(
      [...selected].sort()
    );

    await overviewPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(completePage.confirmationHeader).toHaveText(MESSAGES.orderConfirmation);
    await expect(completePage.title).toHaveText('Checkout: Complete!');
  });

  test('overview totals match the selected products', { tag: SANITY }, async ({
    loggedInProductsPage: productsPage, cartPage, checkoutPage, overviewPage,
  }) => {
    await productsPage.addProductsToCart([BACKPACK, BIKE_LIGHT]);
    const expectedItemTotal =
      (await productsPage.getProductPriceValue(BACKPACK)) + (await productsPage.getProductPriceValue(BIKE_LIGHT));
    await productsPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.submitCustomerInformation(CUSTOMER);
    await expect(overviewPage.title).toHaveText('Checkout: Overview');

    const itemTotal = await overviewPage.getItemTotal();
    const tax = await overviewPage.getTax();
    const total = await overviewPage.getTotal();

    expect(itemTotal, 'Item total differs from the sum of the prices').toBeCloseTo(expectedItemTotal, 2);
    expect(Math.abs(tax - itemTotal * TAX_RATE), 'Tax is not 8% of the item total').toBeLessThan(MONEY_DELTA);
    expect(total, 'Total is not item total + tax').toBeCloseTo(itemTotal + tax, 2);
  });

  // Negative cases: required customer information missing (data-driven)
  const missingInformationCases = [
    { scenario: 'missing first name', customer: { ...CUSTOMER, firstName: '' }, error: MESSAGES.firstNameRequired },
    { scenario: 'missing last name', customer: { ...CUSTOMER, lastName: '' }, error: MESSAGES.lastNameRequired },
    { scenario: 'missing postal code', customer: { ...CUSTOMER, postalCode: '' }, error: MESSAGES.postalCodeRequired },
  ];

  for (const { scenario, customer, error } of missingInformationCases) {
    test(`checkout shows an error when customer information is missing: ${scenario}`, { tag: REGRESSION }, async ({
      loggedInProductsPage: productsPage, cartPage, checkoutPage, page,
    }) => {
      await productsPage.addToCart(BACKPACK);
      await productsPage.openCart();
      await cartPage.proceedToCheckout();

      await checkoutPage.submitCustomerInformation(customer);

      await expect(checkoutPage.errorMessage).toHaveText(error);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }
});
