var express = require('express');
var router = express.Router();
const sparqlQueries = require('../controllers/sparqlQueries');

/* GET . */
router.get('/', (req, res, next) => {
  sparqlQueries.test(req, res);
});

module.exports = router;
