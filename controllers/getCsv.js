// package used to transform json to csv string
const csv = require('csv-parser');
const fs = require('fs');

const dataEditors = './public/files/data.csv';

module.exports = {
  downloadCsv
};

function downloadCsv(req, res) {
  // res.setHeader('Content-Type', 'text/csv');

  fs.createReadStream(dataEditors)
    .pipe(csv({separator: ","}))
    .on("error", (err) => {
      // res.end(err);
      console.log("error:" + err);
    })
    .on("data", (row) => {
      // res.setHeader('Content-Type', 'text/csv');
      // res.write(row);
      console.log(row);
    })
    .on("end", () => {
      // res.end();
      console.log("CSV file read");
    });

//
// // console.log(csvParse(dataEditors));
//   // stringify returns a readable stream that can be directly piped to a
//   // writeable stream which is "res" (the response object)
//   csvParse(dataEditors, { header: true })
//     .pipe(res);
};
