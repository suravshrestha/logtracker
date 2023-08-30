const NepaliDate = require("nepali-date-converter");
const nepDate = new NepaliDate();

const recentBatch = nepDate.getYear() - 1;
const batches = [];
for (let i = 0; i < 4; ++i) {
  batches.push(String(recentBatch - i).slice(1, 4));
}

module.exports = batches;
