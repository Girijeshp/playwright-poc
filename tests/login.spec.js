const{test,expect} = require('@playwright/test');
const product = require('../pages/product.page'); // import the product page class

test('Add product to cart', async({page})=>{
    await page.goto('/inventory.html'); // navigate to the URL
    const productPage = new product(page); // create an instance of the product class
    await productPage.addProductToCart('Sauce Labs Bolt T-Shirt'); // call the addProductToCart method to add the product to the cart   
});