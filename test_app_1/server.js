// import required module
var http = require('http');

// create server instance and bind it to port 3000
http.createServer(function (req, res) {
  // Send the HTTP header
  // HTTP Status: 200 : OK
  // Content Type: text/plain
  res.writeHead(200, {'Content-Type': 'text/plain'});

   // Send the response body as "Hello World"
  res.end('Hello World\n');
}).listen(3000, "127.0.0.1");

// server console message
console.log('Server running at http://127.0.0.1:3000/');
