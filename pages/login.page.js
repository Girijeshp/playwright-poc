const {expect} = require('@playwright/test');
class loginPage{
    constructor(page){
        this.page = page;
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
    }
    async enterUsername(username){
        await this.usernameInput.fill(username);
    }
    async enterPassword(password){
        await this.passwordInput.fill(password);
    }
    async clickLoginButton(){
        await this.loginButton.click();
    }

    async login(username,password){
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
        console.log('Login successful, navigated to inventory page');// check if the URL is correct after login.
       
    }

}
module.exports = loginPage;