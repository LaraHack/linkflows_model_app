var express = require('express');
var router = express.Router();
const sparqlQueries = require('../controllers/sparqlQueries');

/* GET . */
router.get('/', (req, res, next) => {
  sparqlQueries.test(req, res);
    // sparqlQueries.buildQuery(req, res);
});

/* PUT . */
// router.put('/', (req, res, next) => {
//   console.log('request =' + JSON.stringify(request.body));
// });

module.exports = router;
