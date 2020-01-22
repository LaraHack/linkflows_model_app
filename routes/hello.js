var express = require('express');
var router = express.Router();

/* GETrequest to send message. */
router.get('/', function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.send("Hello from server");
  res.render('index', { message: 'Message sent to client' });
});

module.exports = router;
