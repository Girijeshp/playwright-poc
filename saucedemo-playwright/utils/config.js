// Central configuration. Every value can be overridden with an environment variable.
// SAUCE_USERNAME / SAUCE_PASSWORD are used (not USERNAME) because Windows already defines USERNAME.
module.exports = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com/',
  username: process.env.SAUCE_USERNAME || 'standard_user', // public SauceDemo demo account
  password: process.env.SAUCE_PASSWORD || 'secret_sauce',
};
