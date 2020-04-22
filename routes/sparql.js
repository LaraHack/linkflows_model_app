var express = require('express');
var router = express.Router();
const sparqlQueries = require('../controllers/sparqlQueries');

/* GET . */
router.get('/commentsByReviewers', (req, res, next) => {
  sparqlQueries.getReviewCommentsByReviewers(req, res);
});

/* GET . */
router.get('/mainSections', (req, res, next) => {
  sparqlQueries.getArticleMainSections(req, res);
});

/* GET . */
router.get('/commentsBySection', (req, res, next) => {
  sparqlQueries.getReviewCommentsBySection(req, res);
});

/* PUT . */
// router.put('/', (req, res, next) => {
//   console.log('request =' + JSON.stringify(request.body));
// });

module.exports = router;
