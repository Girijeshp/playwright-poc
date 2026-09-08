const{test,expect} = require('@playwright/test');
const login = require('../pages/login'); // import the login page class

test('Login test', async({page})=>{

    await page.goto('https://www.saucedemo.com/'); // navigate to the URL
    const loginPage = new login(page); // create an instance of the login class
    await loginPage.login('standard_user','secret_sauce'); // call
});