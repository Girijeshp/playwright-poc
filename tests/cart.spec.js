const { test, expect } = require('../fixtures/fixtures');
const { PRODUCTS } = require('../test-data/constants');
const { SANITY, REGRESSION } = require('../test-data/groups');

const { BACKPACK, BIKE_LIGHT, BOLT_TSHIRT } = PRODUCTS;

test.describe('Cart', () => {
  test('cart can be opened', { tag: SANITY }, async ({ loggedInProductsPage: productsPage, cartPage, page }) => {
    await productsPage.openCart();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.title).toHaveText('Your Cart');
  });

  test('selected products appear in the cart with correct details', { tag: SANITY }, async ({ loggedInProductsPage: productsPage, cartPage }) => {
    const selected = [BACKPACK, BIKE_LIGHT];
    await productsPage.addProductsToCart(selected);
    const expectedPrices = {
      [BACKPACK]: await productsPage.getProductPrice(BACKPACK),
      [BIKE_LIGHT]: await productsPage.getProductPrice(BIKE_LIGHT),
    };

    await productsPage.openCart();
    await expect(cartPage.items).toHaveCount(selected.length);

    const names = await cartPage.getItemNames();
    const prices = await cartPage.getItemPrices();
    expect([...names].sort(), 'Cart contains the wrong products').toEqual([...selected].sort());
    for (const name of selected) {
      expect(prices[names.indexOf(name)], `Price differs for ${name}`).toBe(expectedPrices[name]);
    }
  });

  test('cart shows the correct number of products', { tag: REGRESSION }, async ({ loggedInProductsPage: productsPage, cartPage }) => {
    await productsPage.addProductsToCart([BACKPACK, BIKE_LIGHT, BOLT_TSHIRT]);
    await productsPage.openCart();

    await expect(cartPage.items).toHaveCount(3);
  });

  test('product can be removed from the cart', { tag: REGRESSION }, async ({ loggedInProductsPage: productsPage, cartPage }) => {
    await productsPage.addProductsToCart([BACKPACK, BIKE_LIGHT]);
    await productsPage.openCart();

    await cartPage.removeItem(BACKPACK);

    await expect(cartPage.itemNames).toHaveText([BIKE_LIGHT]);
  });

  test('continue shopping returns to the products page and keeps the cart', { tag: REGRESSION }, async ({ loggedInProductsPage: productsPage, cartPage, page }) => {
    await productsPage.addToCart(BACKPACK);
    await productsPage.openCart();

    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(productsPage.title).toHaveText('Products');
    await expect(productsPage.cartBadge).toHaveText('1');
  });

  test('user can proceed to checkout', { tag: SANITY }, async ({ loggedInProductsPage: productsPage, cartPage, page }) => {
    await productsPage.addToCart(BACKPACK);
    await productsPage.openCart();

    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
