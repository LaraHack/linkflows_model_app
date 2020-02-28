var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var es6Renderer = require('express-es6-template-engine');
var cors = require('cors')

// var corsOptions = {
//   origin: 'http://127.0.0.1:3000',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// var whitelist = ['http://127.0.0.1:3000', 'http://127.0.0.1:8081']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

var indexRouter = require('./routes/index');
var editorsRouter = require('./routes/editors');
var helloRouter = require('./routes/hello');
var sparqlRouter = require('./routes/sparql');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.engine('html', es6Renderer);
app.set('views', 'views');
// app.set('view engine', 'html');

// app.use(cors(corsOptions));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/', cors(corsOptions), indexRouter);
app.use('/editors', editorsRouter);
app.use('/hello', helloRouter);
app.use('/sparql', sparqlRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(8081, '0.0.0.0');
