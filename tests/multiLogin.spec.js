const {test,expect} = require('../Fixture/test.fixture'); // import the test and expect from the fixture
const multiUsers = require('../data/multiUsers'); // import the multi user data from the data folder

test.describe('Multi User Login', () => {
    for(const user of multiUsers){
        test(`Login test for ${user.username}`, async ({page, loginPage}) => {
            await page.goto('/'); // navigate to the URL
            await loginPage.login(user.username, user.password); // call the login method to perform authentication
        })
    }
});