var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// Set up mongoose by loading our data models
// Must be before routes, users and app
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/once');
require('./models/Sentence');

var routes = require('./routes/index');
var users = require('./routes/users');


// This setup thanks to jfriend00 on stack overflow
var app = express();
var server = app.listen(3000, function() {
  console.log("Server started on port 3000");
});
var io = require('socket.io').listen(server);
// Require an external module containing the socket logic
// and pass it the io object so it can access it
require('./socket-logic')(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// Allow larger data to be sent
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
