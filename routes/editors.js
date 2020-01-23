var express = require('express');
var router = express.Router();
const dataEditors = require('../data.csv');
const getCsvCtrl = require('../controllers/getCsv');

/* GET . */
// router.get('/csv', getCsvCtrl.downloadCsv);
router.get('/csv', (req, res, next) => {
  res.attachment(dataEditors);
  res.status(200).send(getCsvCtrl.downloadCsv);
});

module.exports = router;
