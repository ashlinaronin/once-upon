var express = require('express');
var compress = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var PubSub = require('pubsub-js');

// Set up mongoose by loading our data models
// Must be before routes, users and app
var mongoose = require('mongoose');
mongoose.connect(`${process.env.MONGO_URL || 'mongodb:127.0.0.1/'}once`);
require('./models/Sentence');

var routes = require('./routes/index');
var users = require('./routes/users');


// This setup thanks to jfriend00 on stack overflow
// Also, apparently Heroku dynamically assigns a port, so we need to use an
// environment variable here to allow it to do that.
// Now running with reverse proxy in nginx on digital ocean...
var app = express();

app.use(compress()); // use gzip to compress data

// var server = app.listen(process.env.PORT || 3000);
var server = app.listen(3000, '127.0.0.1');
console.log("Server started at 127.0.0.1:3000");

var io = require('socket.io').listen(server);
// Require an external module containing the socket logic
// and pass it the io object and PubSub so it can access them
require('./socket-logic')(io, PubSub);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view cache', true);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// Allow larger data to be sent
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

// Change static dir depending on environment
var oneDay = 86400000;
var publicDir;
if (app.get('env') === 'development') {
  publicDir = '/public';
} else {
  publicDir = '/dst';
}
app.use(express.static(__dirname + publicDir, {maxAge: oneDay}));

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
