const { test, expect } = require('../fixtures/fixtures');
const { SortOption } = require('../pages/ProductsPage');
const { PRODUCTS, PRODUCT_COUNT } = require('../test-data/constants');
const { SMOKE, SANITY, REGRESSION } = require('../test-data/groups');
const { parseMoney } = require('../utils/money');

const { BACKPACK, BIKE_LIGHT, BOLT_TSHIRT } = PRODUCTS;

test.describe('Products', () => {
  test('products page is displayed after login', { tag: SMOKE }, async ({ loggedInProductsPage: productsPage, page }) => {
    await expect(productsPage.title).toHaveText('Products');
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('product names and prices are displayed', { tag: REGRESSION }, async ({ loggedInProductsPage: productsPage }) => {
    await expect(productsPage.productNames).toHaveCount(PRODUCT_COUNT);
    await expect(productsPage.productNames).toHaveText(Array(PRODUCT_COUNT).fill(/\S/)); // none blank
    await expect(productsPage.productPrices).toHaveText(Array(PRODUCT_COUNT).fill(/^\$\d+\.\d{2}$/));
  });

  test('products can be sorted by name ascending', { tag: REGRESSION }, async ({ loggedInProductsPage: productsPage }) => {
    const expected = [...(await productsPage.getProductNames())].sort();
    await productsPage.sortBy(SortOption.NAME_ASC);

    await expect(productsPage.productNames).toHaveText(expected);
  });

  test('products can be sorted by name descending', { tag: REGRESSION }, async ({ loggedInProductsPage: productsPage }) => {
    const expected = [...(await productsPage.getProductNames())].sort().reverse();
    await productsPage.sortBy(SortOption.NAME_DESC);

    await expect(productsPage.productNames).toHaveText(expected);
  });

  test('products can be sorted by price ascending', { tag: REGRESSION }, async ({ loggedInProductsPage: productsPage }) => {
    const expected = [...(await productsPage.getProductPrices())].sort((a, b) => parseMoney(a) - parseMoney(b));
    await productsPage.sortBy(SortOption.PRICE_ASC);

    await expect(productsPage.productPrices).toHaveText(expected);
  });

  test('products can be sorted by price descending', { tag: REGRESSION }, async ({ loggedInProductsPage: productsPage }) => {
    const expected = [...(await productsPage.getProductPrices())].sort((a, b) => parseMoney(b) - parseMoney(a));
    await productsPage.sortBy(SortOption.PRICE_DESC);

    await expect(productsPage.productPrices).toHaveText(expected);
  });

  test('single product can be added to cart', { tag: SMOKE }, async ({ loggedInProductsPage: productsPage }) => {
    await productsPage.addToCart(BACKPACK);

    await expect(productsPage.removeButton(BACKPACK)).toBeVisible();
    await expect(productsPage.cartBadge).toHaveText('1');
  });

  test('multiple products can be added to cart', { tag: SANITY }, async ({ loggedInProductsPage: productsPage }) => {
    await productsPage.addProductsToCart([BACKPACK, BIKE_LIGHT, BOLT_TSHIRT]);

    await expect(productsPage.cartBadge).toHaveText('3');
  });

  test('cart badge updates when products are added and removed', { tag: REGRESSION }, async ({ loggedInProductsPage: productsPage }) => {
    await expect(productsPage.cartBadge).toHaveCount(0); // the badge is absent while the cart is empty

    await productsPage.addToCart(BACKPACK);
    await productsPage.addToCart(BIKE_LIGHT);
    await expect(productsPage.cartBadge).toHaveText('2');

    await productsPage.removeFromCart(BACKPACK);
    await expect(productsPage.cartBadge).toHaveText('1');
  });

  test('product can be removed from the inventory page', { tag: REGRESSION }, async ({ loggedInProductsPage: productsPage }) => {
    await productsPage.addToCart(BACKPACK);
    await productsPage.removeFromCart(BACKPACK);

    await expect(productsPage.addToCartButton(BACKPACK)).toBeVisible();
    await expect(productsPage.cartBadge).toHaveCount(0);
  });
});
