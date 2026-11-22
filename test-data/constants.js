// Test data and expected texts, kept out of page objects and test logic.
module.exports = {
  PRODUCTS: {
    BACKPACK: 'Sauce Labs Backpack',
    BIKE_LIGHT: 'Sauce Labs Bike Light',
    BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
  },
  PRODUCT_COUNT: 6,

  CUSTOMER: { firstName: 'John', lastName: 'Doe', postalCode: '12345' },

  // The application adds 8% sales tax, rounded to cents
  TAX_RATE: 0.08,
  MONEY_DELTA: 0.011,

  MESSAGES: {
    orderConfirmation: 'Thank you for your order!',
    firstNameRequired: 'Error: First Name is required',
    lastNameRequired: 'Error: Last Name is required',
    postalCodeRequired: 'Error: Postal Code is required',
  },
};
