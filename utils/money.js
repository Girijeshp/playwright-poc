/** Extracts the number from displayed money text: "$29.99" or "Item total: $39.98" gives 29.99 / 39.98. */
function parseMoney(text) {
  return Number.parseFloat(text.replace(/[^0-9.]/g, ''));
}

module.exports = { parseMoney };
