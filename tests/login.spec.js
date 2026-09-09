const{test,expect} = require('@playwright/test');
const login = require('../pages/login.page'); // import the login page class
const product = require('../pages/product.page'); // import the product page class

test('Login test', async({page})=>{

    await page.goto('https://www.saucedemo.com/'); // navigate to the URL
    const loginPage = new login(page); // create an instance of the login class
    await loginPage.login('standard_user','secret_sauce'); // call
    const productPage = new product(page); // create an instance of the product class
    await productPage.addProductToCart('Sauce Labs Bolt T-Shirt'); // call the addProductToCart method to add the product to the cart   
});