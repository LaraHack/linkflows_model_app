// package used to transform json to csv string
const csv = require('csv-parser');
const fs = require('fs');

const dataEditors = './public/files/data.csv';

module.exports = {
  downloadCsv
};

function downloadCsv(req, res) {
  fs.createReadStream(dataEditors)
    .pipe(csv({separator: ","}))
    .on("error", (err) => {
      console.log("error:" + err);
      res.end(err);
    })
    .on("data", (row) => {
      console.log(row);
      res.write(row);
    })
    .on("end", () => {
      console.log("CSV file read");
      res.setHeader('Content-Type', 'text/csv');
      res.end();
    });

//
// // console.log(csvParse(dataEditors));
//   // stringify returns a readable stream that can be directly piped to a
//   // writeable stream which is "res" (the response object)
//   csvParse(dataEditors, { header: true })
//     .pipe(res);
};
