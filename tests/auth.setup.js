const {test,expect} = require('../Fixture/test.fixture'); // import the test and expect from the fixture

test('Authentication setup', async ({ page, loginPage }) => {

    await page.goto('/'); // navigate to the URL
    await loginPage.login('standard_user', 'secret_sauce'); // call the login method to perform authentication
    await page.context().storageState({ path: '.auth/user.json' }); // save the authentication state to a file      
});