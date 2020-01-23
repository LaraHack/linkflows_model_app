var express = require('express');
var router = express.Router();
const dataEditors = require('../data.csv');
const getCsvCtrl = require('../controllers/getCsv');

/* GET . */
router.get('/csv', getCsvCtrl.downloadCsv);

module.exports = router;
