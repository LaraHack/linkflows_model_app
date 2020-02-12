var express = require('express');
var router = express.Router();
const getCsvCtrl = require('../controllers/getCsv');
const sparqlQueries = require('../controllers/sparqlQueries');

/* GET . */
// router.get('/csv', getCsvCtrl.downloadCsv);
router.get('/csv', (req, res, next) => {
    // adding appropriate headers, so browsers can start downloading
    // file as soon as this request starts to get served
    // res.setHeader('Content-Type', 'text/csv');
    // res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
    // res.setHeader('Cache-Control', 'no-cache');
    // res.setHeader('Pragma', 'no-cache');
    //
    // res.attachment('data.csv');
    //
    // res.status(200).sendFile('data.csv');

    // res.download(dataEditors);
    // res.status(200).send(getCsvCtrl.downloadCsv(req, res));
    // getCsvCtrl.downloadCsv(req, res);

    // console.log("BODY REQ");
    // console.log(req.query);
    // console.log("/BODY REQ");
    sparqlQueries.buildQuery(req, res);
});

module.exports = router;
