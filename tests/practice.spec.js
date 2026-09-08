const{test,expect} = require('@playwright/test');

test('Demo test',async({page})=>{

    await page.goto('https://www.saucedemo.com/'); // navigate to the URL
    const title = await page.title(); // to get the title of the page
    console.log(title);// print the title in the console
    await expect(page).toHaveTitle('Swag Labs');
    const username =page.locator('#user-name');
    const password = page.locator('input[placeholder=Password]');// locate the password field using placeholder attribute
    const loginButton = page.locator('#login-button');// locate the login button using its ID
    if(await username.isVisible()) {
        console.log('Username field is visible');// check if the username field is visible
    }

    await username.fill('standard_user');// fill the username field
    await password.fill('secret_sauce');// fill the password field
    await expect(password).toHaveValue('secret_sauce');
    console.log(await password.inputValue());// print the value of the password field in the console
    await loginButton.click();// click the login button
    if(await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')){
        console.log('Login successful, navigated to inventory page');// check if the URL is correct after login.
    }

    const inventoryList = await page.locator('.inventory_item_name');// locate the inventory list on the page
    const productCount =  await inventoryList.count();// count the number of products in the inventory list
    console.log(`Number of products in the inventory: ${productCount}`);// print the number of products in the console 
    const firstProduct = await inventoryList.first();// locate the first product in the inventory list
    console.log(await firstProduct.textContent());// print the text content of the first product in the console
    console.log('List of products:', await inventoryList.allTextContents());// print the text content of all products in the inventory list in the console   
    
    for(let i=0;i<productCount;i++){
        const productName = (await inventoryList.nth(i).textContent()).trim();// get the text content of each product and trim any whitespace
        if(productName ==='Sauce Labs Bolt T-Shirt' ){
            console.log(`product found: ${productName}`);// check if the product name matches the expected value and print it in the console
            await inventoryList.nth(i).click();// click on the product name to navigate to the product details page
            break;
        }
        
    }
    await page.pause();// pause the test execution to inspect the page

});