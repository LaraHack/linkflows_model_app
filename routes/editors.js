var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/csv', function(req, res, next) {
  // res.send('respond with a resource');
  // res.render('index', {locals: {title: 'File sent to client'}});
  res.setHeader('Content-Type', 'text/csv');
  // res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
    res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
});

module.exports = router;
