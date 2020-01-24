var express = require('express');
var router = express.Router();
const getCsvCtrl = require('../controllers/getCsv');

const csv = require('csv-parser');
const fs = require('fs');

// const dataEditors = require('../public/files/data_with_quotes.csv');
// const dataEditors = require('../data.csv');

/* GET . */
// router.get('/csv', getCsvCtrl.downloadCsv);
router.get('/csv', (req, res, next) => {
  // res.attachment(dataEditors);

  fs.createReadStream('data.csv')
    .pipe(csv({separator: ","}))
    .on("data", (row) => {
      console.log(row);
    })
    .on("end", () => {
      console.log("CSV file read");
    });

  // res.status(200).send(getCsvCtrl.downloadCsv);
});

module.exports = router;
