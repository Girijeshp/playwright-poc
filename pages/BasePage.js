/**
 * Shared base for page objects. Page objects hold locators and business actions only;
 * assertions live in the tests. Locators are lazy and auto-waiting, so there are no explicit waits.
 */
class BasePage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title'); // the page heading, e.g. "Products"
  }
}

module.exports = BasePage;
