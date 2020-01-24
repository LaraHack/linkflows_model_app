// code from https://github.com/aitchkhan/express-csv-download

// package used to transform json to csv string
const csv = require('csv-parser');
const fs = require('fs');
// const dataEditors = require('../data.csv');

module.exports = {
  downloadCsv
};

function downloadCsv(req, res) {
  fs.createReadStream("../public/files/data_with_quotes.csv")
    .pipe(csv({separator: ","}))
    .on("data", (row) => {
      console.log(row);
    })
    .on("end", () => {
      console.log("CSV file read");
    });

//
// // console.log(csvParse(dataEditors));
//   // stringify returns a readable stream that can be directly piped to a
//   // writeable stream which is "res" (the response object)
//   csvParse(dataEditors, { header: true })
//     .pipe(res);
};
