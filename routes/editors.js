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
    // adding appropriate headers, so browsers can start downloading
    // file as soon as this request starts to get served
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');

    res.attachment(dataEditors);

  // fs.createReadStream('data_with_quotes.csv')
  //   .pipe(csv({separator: ","}))
  //   .on("data", (row) => {
  //     console.log(row);
  //   })
  //   .on("end", () => {
  //     console.log("CSV file read");
  //   });

  // res.status(200).send(getCsvCtrl.downloadCsv);
});

module.exports = router;
