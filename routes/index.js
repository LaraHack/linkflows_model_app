var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.writeHead(200, {'Content-Type': 'text/html'});
    res.send("Hello from server");
  // res.render('index', {locals: {title: 'Welcome!'}});
});

module.exports = router;
