// Every test is tagged @regression; important ones are also @sanity; the critical path is also @smoke.
// Run a group with: npx playwright test --grep @smoke
module.exports = {
  SMOKE: ['@smoke', '@sanity', '@regression'],
  SANITY: ['@sanity', '@regression'],
  REGRESSION: ['@regression'],
};
