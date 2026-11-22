// Prints a markdown results table from Playwright's JSON report (used for the GitHub job summary).
// Usage: node scripts/summary.js [results.json] [label]
const fs = require('fs');

const [, , file = 'test-results/results.json', label = 'Playwright'] = process.argv;

if (!fs.existsSync(file)) {
  console.log(`### Results: ${label}\nNo results were produced (the run probably failed before the tests started).`);
  process.exit(0);
}

const { stats } = JSON.parse(fs.readFileSync(file, 'utf8'));
const total = stats.expected + stats.unexpected + stats.flaky + stats.skipped;
console.log(
  [
    `### Results: ${label}`,
    '| Total | Passed | Failed | Flaky | Skipped |',
    '|---|---|---|---|---|',
    `| ${total} | ${stats.expected} | ${stats.unexpected} | ${stats.flaky} | ${stats.skipped} |`,
  ].join('\n')
);
